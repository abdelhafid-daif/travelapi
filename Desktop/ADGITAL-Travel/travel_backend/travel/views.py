from rest_framework import viewsets
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db import models
from .models import Categorie, Destination, Offre, DepartDetail, OptionExtra, OffreImage,Payment,Booking,Partenaire,ContratPartenaire,Facture,HistoriquePaiement,HistoriquePaiementHotel
from accounts.models import Profile
from rest_framework.generics import RetrieveAPIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser 
import json 
from rest_framework.decorators import action
from .serializers import PartenaireSerializer,CategorieSerializer, DestinationSerializer,SupDestinationSerializer, OffreSerializer, DepartDetailSerializer, OptionExtraSerializer, OffreImageSerializer,OffreDetailSerializer,BookingSerializer,PaymentSerializer,SupOffreSerializer,SupDepartDetailSerializer,SupBookingSerializer,ContratPartenaireSerializer,ComptBookingSerializer,FactureSerializer,HistoriquePaiementSerializer,ManagerBookingSerializer,HistoriquePaiementHotelSerializer,StatsOffreSerializer
from .permissions import IsSupportUser,IsCommercialUser,IsComptableUser,IsManagerUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse, Http404
from rest_framework.decorators import api_view,permission_classes
from django.db.models import Count,Sum
from django.db.models.functions import TruncDate
from django.db.models.functions import TruncMonth
from django.http import JsonResponse
from django.db.models import OuterRef, Subquery
from collections import defaultdict
from datetime import date
from datetime import datetime, time
from django.utils.timezone import now
from django.utils.timezone import make_aware
from hotel.models import ReservationHotel,Hotel



class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class OffreViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.filter(active=True).order_by('-created_at') 
    serializer_class = OffreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DepartDetailViewSet(viewsets.ModelViewSet):
    queryset = DepartDetail.objects.all()
    serializer_class = DepartDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class OptionExtraViewSet(viewsets.ModelViewSet):
    queryset = OptionExtra.objects.all()
    serializer_class = OptionExtraSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class OffreImageViewSet(viewsets.ModelViewSet):
    queryset = OffreImage.objects.all()
    serializer_class = OffreImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PopularDestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.filter(populaire=True)
    serializer_class = DestinationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PopularOffreViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.filter(populaire=True, active=True).order_by('-created_at')
    serializer_class = OffreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class OffreDetailAPIView(RetrieveAPIView):
    queryset = Offre.objects.all()
    serializer_class = OffreDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]

class OffreByCatViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.all().order_by('-created_at')
    serializer_class = OffreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        categorie_id = self.request.query_params.get('categorie')
        if categorie_id:
            queryset = queryset.filter(categorie_id=categorie_id)
        return queryset

class OffreByDestViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.all().order_by('-created_at')
    serializer_class = OffreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        destination_id = self.request.query_params.get('destination')
        if destination_id:
            queryset = queryset.filter(destinations__id=destination_id)
        return queryset

class OffreSherchViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.all().order_by('-created_at')
    serializer_class = OffreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        destination_id = self.request.query_params.get('destination')
        if destination_id:
            queryset = queryset.filter(destinations__id=destination_id)
        
        nom_offre = self.request.query_params.get('nom')
        if nom_offre:
            queryset = queryset.filter(nom__icontains=nom_offre)  

        return queryset

class BookingWithPaymentCreateView(generics.GenericAPIView):
    serializer_class = BookingSerializer
    permission_classes = [AllowAny] 

    def post(self, request, *args, **kwargs):
        booking_serializer = BookingSerializer(data=request.data)
        if booking_serializer.is_valid():
            booking = booking_serializer.save()

            methode = request.data.get('methode')
            if not methode:
                return Response({"error": "La méthode de paiement est requise."}, status=400)

            
            montant =  0

            payment = Payment.objects.create(
                booking=booking,
                methode=methode,
                montant=montant,
                statut='en_attente',
                transaction_id=None,  
                date_paiement=timezone.now(),
            )

            return Response({
                "booking": BookingSerializer(booking).data,
                "payment": PaymentSerializer(payment).data,
            }, status=status.HTTP_201_CREATED)

        return Response(booking_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SupCategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsSupportUser] 

    @action(detail=False, methods=['get'])
    def current_user(self, request):
        return Response({
            "user": request.user.username,
            "is_support": request.user.profile.is_support
        })
    def perform_create(self, serializer):
        last_order = Categorie.objects.aggregate(max_order=models.Max('ordre'))['max_order'] or 0
        serializer.save(ordre=last_order + 1)

class SupDestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = SupDestinationSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsSupportUser]

    @action(detail=False, methods=['get'])
    def current_user(self, request):
        return Response({
            "user": request.user.username,
            "is_support": request.user.profile.is_support
        })

class SupOffreViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.all().order_by('-created_at') 
    serializer_class = SupOffreSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsSupportUser]

    @action(detail=False, methods=['get'])
    def current_user(self, request):
        return Response({
            "user": request.user.username,
            "is_support": request.user.profile.is_support
        })

    
    def update(self, request, *args, **kwargs):

        return super().update(request, *args, **kwargs)

class SupDepartDetailViewSet(viewsets.ModelViewSet):
    queryset = DepartDetail.objects.all()
    serializer_class = SupDepartDetailSerializer
    permission_classes = [IsSupportUser]

class SupBookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = SupBookingSerializer
    permission_classes = [IsSupportUser]
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, partial=True, **kwargs)


class PartenaireViewSet(viewsets.ModelViewSet):
    queryset = Partenaire.objects.all()
    serializer_class = PartenaireSerializer
    permission_classes = [IsCommercialUser]

class ContratPartenaireViewSet(viewsets.ModelViewSet):
    queryset = ContratPartenaire.objects.all()
    serializer_class = ContratPartenaireSerializer
    permission_classes = [IsCommercialUser]

    def get_queryset(self):
        partenaire_id = self.request.query_params.get('partenaire_id')
        if partenaire_id:
            return self.queryset.filter(partenaire_id=partenaire_id)
        return self.queryset

class ComptBookingViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ComptBookingSerializer
    permission_classes = [IsComptableUser]
    def get_queryset(self):
        queryset = Booking.objects.filter(statut='confirmee').exclude(id__in=Facture.objects.values('booking'))
        queryset = queryset.select_related('offre').prefetch_related('offre__extras')
        return queryset

class CreateFactureView(APIView):
    def post(self, request, booking_id):
        try:
            # Récupérer la réservation
            booking = get_object_or_404(Booking, id=booking_id)
            selected_options_ids = request.data.get('options_extras', [])
            if isinstance(selected_options_ids, str):  # si JSON string
                selected_options_ids = json.loads(selected_options_ids)

            selected_options = OptionExtra.objects.filter(id__in=selected_options_ids)

            if not selected_options.exists():
                return Response({'detail': 'Une ou plusieurs options supplémentaires sont invalides.'},
                                status=status.HTTP_400_BAD_REQUEST)

            montant_total = request.data.get('montant_total')
            prix_offre = request.data.get('prix_offre')

            if not montant_total or not prix_offre:
                return Response({'detail': 'Les champs montant_total et prix_offre sont obligatoires.'},
                                status=status.HTTP_400_BAD_REQUEST)

            facture = Facture.objects.create(
                booking=booking,
                numero_facture=f'FCT-{booking.id}',
                montant_total=montant_total,
                prix_offre=prix_offre,
                statut=request.data.get('statut'),
            )

            facture.options_extras.set(selected_options)
            facture.save()

            serializer = FactureSerializer(facture)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except ValueError as e:
            return Response({'detail': 'Données invalides : ' + str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FactureViewSet(viewsets.ModelViewSet):
    queryset = Facture.objects.all().exclude(id__in=HistoriquePaiement.objects.values('facture'))
    serializer_class = FactureSerializer
    permission_classes = [IsComptableUser]

    @action(detail=True, methods=['patch'], url_path='update-statut')
    def update_statut(self, request, pk=None):
        facture = self.get_object()
        new_statut = request.data.get('statut')
        if new_statut not in ['en_attente', 'confirmee', 'annulee']:
            return Response({'error': 'Statut invalide'}, status=status.HTTP_400_BAD_REQUEST)
        
        facture.statut = new_statut
        facture.save()
        return Response({'message': 'Statut mis à jour avec succès'})

class HistoriquePaiementHotelViewSet(viewsets.ModelViewSet):
    queryset = HistoriquePaiementHotel.objects.all()
    serializer_class = HistoriquePaiementHotelSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsComptableUser] 
    def perform_create(self, serializer):
        # Récupérer l'utilisateur connecté
        user = self.request.user
        
        # Vérifier que l'utilisateur est un comptable (vérification via le profil)
        if hasattr(user, 'profile') and user.profile.is_comptable:
            # Ajouter l'utilisateur connecté comme comptable
            serializer.save(comptable=user)
        else:
            # Si l'utilisateur n'est pas un comptable, on peut lever une exception
            raise PermissionError("L'utilisateur connecté n'a pas les droits nécessaires pour effectuer cette action.")

    def get_file_url(self, instance):
        # This method generates a secure URL to the facture file
        return f"http://localhost:8000/api/serve_facture/{instance.fichier_facture.name.split('/')[-1]}"

class HistoriquePaiementViewSet(viewsets.ModelViewSet):
    queryset = HistoriquePaiement.objects.all()
    serializer_class = HistoriquePaiementSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsComptableUser] 
    def perform_create(self, serializer):
        # Récupérer l'utilisateur connecté
        user = self.request.user
        
        # Vérifier que l'utilisateur est un comptable (vérification via le profil)
        if hasattr(user, 'profile') and user.profile.is_comptable:
            # Ajouter l'utilisateur connecté comme comptable
            serializer.save(comptable=user)
        else:
            # Si l'utilisateur n'est pas un comptable, on peut lever une exception
            raise PermissionError("L'utilisateur connecté n'a pas les droits nécessaires pour effectuer cette action.")

    def get_file_url(self, instance):
        # This method generates a secure URL to the facture file
        return f"http://localhost:8000/api/serve_facture/{instance.fichier_facture.name.split('/')[-1]}"



class SecureFileDownloadView(APIView):
    def get(self, request, file_name):
        file_path = os.path.join(settings.MEDIA_ROOT, 'factures', file_name)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)
        else:
            return HttpResponseNotFound('Fichier non trouvé')


@api_view(['GET'])
@permission_classes([IsManagerUser])
def booking_stats(request):
    data = {
        "by_statut": list(Booking.objects.values('statut').annotate(count=Count('id'))),
        "by_date": list(
            Booking.objects
                .annotate(date=TruncDate('date_reservation'))
                .values('date')
                .annotate(count=Count('id'))
                .order_by('date')
        ),
        "by_offre": list(Booking.objects.values('offre__titre').annotate(count=Count('id'))),
    }
    return JsonResponse(data, safe=False)


class PartenaireStatsView(APIView):
    permission_classes = [IsManagerUser]
    def get(self, request):
        data = Partenaire.objects.values('type_partenaire').annotate(count=Count('id'))
        type_counts = {entry['type_partenaire']: entry['count'] for entry in data}
        return Response({'type_counts': type_counts})


class ContratStatsView(APIView):
    permission_classes = [IsManagerUser]
    def get(self, request):
        statut_data = ContratPartenaire.objects.values('statut').annotate(count=Count('id'))
        statut_counts = {entry['statut']: entry['count'] for entry in statut_data}

        month_data = (
            ContratPartenaire.objects.annotate(month=TruncMonth('date_creation'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        contrats_par_mois = [
            {"mois": entry['month'].strftime("%b"), "count": entry['count']}
            for entry in month_data
        ]

        avatar_subquery = Profile.objects.filter(user=OuterRef('partenaire__commercial_responsable')).values('avatar')[:1]

        partenaires_data = ContratPartenaire.objects.annotate(
            avatar=Subquery(avatar_subquery)
        ).values(
            'id',
            'partenaire__id',
            'partenaire__nom',
            'partenaire__type_partenaire',
            'partenaire__adresse',
            'titre',
            'description',
            'fichier_contrat',
            'date_debut',
            'date_fin',
            'statut',
            'partenaire__commercial_responsable__id',
            'partenaire__commercial_responsable__email',
            'partenaire__commercial_responsable__phone_number',
            'partenaire__commercial_responsable__city',
            'avatar',  # ✅ champ ajouté depuis Profile
        )

        return Response({
            'statut_counts': statut_counts,
            'contrats_par_mois': contrats_par_mois,
            'partenaires': list(partenaires_data),
        })

class FactureChartData(APIView):
    permission_classes = [IsManagerUser]

    def get(self, request):
        data = (
            Facture.objects
            .values('statut')
            .annotate(date=TruncDate('date_emission'))
            .values('date', 'statut')
            .annotate(montant_total=Sum('montant_total'))
            .order_by('date')
        )
        grouped = {}
        for entry in data:
            date = entry['date'].strftime("%Y-%m-%d")
            statut = entry['statut']
            montant = float(entry['montant_total'])

            if date not in grouped:
                grouped[date] = {}
            grouped[date][statut] = montant

        # Construire la liste finale pour React
        chart_data = []
        for date, valeurs in grouped.items():
            row = {"date": date}
            for statut in ['en_attente', 'payée', 'annulée']:
                row[statut] = valeurs.get(statut, 0)
            chart_data.append(row)

        return Response(chart_data)


class ManagerBookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = ManagerBookingSerializer
    permission_classes = [IsManagerUser]

@api_view(['GET'])
@permission_classes([IsManagerUser])
def statistiques_paiements(request):
    # Montants totaux des paiements
    total_paiements_facture = HistoriquePaiement.objects.aggregate(Sum('montant'))['montant__sum'] or 0
    total_paiements_hotel = HistoriquePaiementHotel.objects.aggregate(Sum('montant'))['montant__sum'] or 0
    paiements_facture = HistoriquePaiement.objects.annotate(date=TruncDate('date_paiement')).values('date').annotate(total_facture=Sum('montant')).order_by('date')

        # Paiements hôtel
    paiements_hotel = HistoriquePaiementHotel.objects.annotate(date=TruncDate('date_paiement')).values('date').annotate(total_hotel=Sum('montant')).order_by('date')

        # Fusion des données par date
    data_dict = defaultdict(lambda: {'date': None, 'total_facture': 0, 'total_hotel': 0})

    for item in paiements_facture:
            d = item['date']
            data_dict[d]['date'] = d
            data_dict[d]['total_facture'] = item['total_facture']

    for item in paiements_hotel:
            d = item['date']
            data_dict[d]['date'] = d
            data_dict[d]['total_hotel'] = item['total_hotel']

        # Conversion en liste triée
    result = sorted(data_dict.values(), key=lambda x: x['date'])
        # paiements_facture = HistoriquePaiement.objects.annotate(date=TruncDate('date_paiement')).values('date').annotate(total=Sum('montant')).order_by('date')
        # paiements_hotel = HistoriquePaiementHotel.objects.annotate(date=TruncDate('date_paiement')).values('date').annotate(total=Sum('montant')).order_by('date')

    data = {
            'total_paiements_facture': total_paiements_facture,
            'total_paiements_hotel': total_paiements_hotel,
            'paiements_par_date': result,
        }

    return JsonResponse(data)

class BookingStatsByOffre(APIView):
    queryset = Booking.objects.all()
    serializer_class = ManagerBookingSerializer
    permission_classes = [IsManagerUser]
    def get(self, request):
        data = (
            Booking.objects
            .values('offre__titre')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        # Formatage
        results = [
            {'offre_titre': item['offre__titre'], 'count': item['count']}
            for item in data
        ]
        return Response(results)


class OffreParDestinationView(APIView):
    def get(self, request):
        destinations = Destination.objects.all()
        serializer = StatsOffreSerializer(destinations, many=True)
        return Response(serializer.data)

class BookingStatsView(APIView):
    def get(self, request):
        today = now().date()
        year = today.year
        month = today.month

        start_day = make_aware(datetime.combine(today, time.min))
        end_day = make_aware(datetime.combine(today, time.max))

        bookings_today = Booking.objects.filter(date_reservation__range=(start_day, end_day)).count()
        bookings_month = Booking.objects.filter(date_reservation__year=year, date_reservation__month=month).count()
        bookings_year = Booking.objects.filter(date_reservation__year=year).count()
        hotel_bookings_today = ReservationHotel.objects.filter(date_reservation__range=(start_day, end_day)).count()
        hotel_bookings_month = ReservationHotel.objects.filter(date_reservation__year=year, date_reservation__month=month).count()
        hotel_bookings_year = ReservationHotel.objects.filter(date_reservation__year=year).count()
        offres_count =  Offre.objects.count()
        hotels_count =  Hotel.objects.count()

        

        return Response({
            'today': bookings_today,
            'month': bookings_month,
            'year': bookings_year,
            'htoday': hotel_bookings_today,
            'hmonth': hotel_bookings_month,
            'hyear': hotel_bookings_year,
            'offres_count': offres_count,
            'hotels_count':hotels_count,
        })



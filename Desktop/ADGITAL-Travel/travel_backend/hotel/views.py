from rest_framework import viewsets
from .models import Hotel, Chambre, ReservationHotel, Devis, Facture, HotelImage
from .serializers import ComReservationHotelSerializer,HotelSerializer, ChambreSerializer, ReservationHotelSerializer, DevisSerializer, FactureSerializer, HotelImageSerializer,PublicHotelSerializer,ReservationSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from travel.permissions import IsCommercialUser
from rest_framework.decorators import api_view,permission_classes
from django.utils import timezone
from rest_framework.decorators import action




class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

class HotelImageViewSet(viewsets.ModelViewSet):
    queryset = HotelImage.objects.all()
    serializer_class = HotelImageSerializer

class ChambreViewSet(viewsets.ModelViewSet):
    queryset = Chambre.objects.all()
    serializer_class = ChambreSerializer

class ReservationHotelViewSet(viewsets.ModelViewSet):
    queryset = ReservationHotel.objects.all()
    serializer_class = ComReservationHotelSerializer
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, partial=True, **kwargs)

class DevisViewSet(viewsets.ModelViewSet):
    queryset = Devis.objects.all()
    serializer_class = DevisSerializer

class FactureViewSet(viewsets.ModelViewSet):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer
    @action(detail=False, methods=['get'])
    def by_reservation(self, request):
        reservation_id = request.query_params.get('reservation')
        try:
            facture = Facture.objects.get(reservation_id=reservation_id)
            serializer = self.get_serializer(facture)
            return Response(serializer.data)
        except Facture.DoesNotExist:
            return Response({'detail': 'Facture non trouvée'}, status=404)

@api_view(['POST'])
def create_facture(request, reservation_id):
    try:
        reservation = ReservationHotel.objects.get(pk=reservation_id)
        if hasattr(reservation, 'facture'):
            return Response({'error': 'Facture déjà existante'}, status=400)

        data = request.data
        facture = Facture.objects.create(
            reservation=reservation,
            numero=f"FCT-{timezone.now().strftime('%Y%m%d%H%M%S')}",
            montant_total=data.get('montant_total'),
            statut_paiement=data.get('statut_paiement', 'non_payee'),
        )
        return Response({'message': 'Facture créée', 'facture_id': facture.id})
    except ReservationHotel.DoesNotExist:
        return Response({'error': 'Réservation non trouvée'}, status=404)


class PublicHotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = PublicHotelSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PublicHotelImageViewSet(viewsets.ModelViewSet):
    queryset = HotelImage.objects.all()
    serializer_class = HotelImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class PublicChambreViewSet(viewsets.ModelViewSet):
    queryset = Chambre.objects.all()
    serializer_class = ChambreSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CreateReservationAPIView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = ReservationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Réservation créée avec succès."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
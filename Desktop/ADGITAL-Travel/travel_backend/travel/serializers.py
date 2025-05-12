from rest_framework import serializers
from .models import ContratPartenaire,Partenaire,Categorie, Destination, Offre, DepartDetail, OptionExtra, OffreImage,Booking,Payment,OffrePlanning,Facture,HistoriquePaiement,HistoriquePaiementHotel

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id', 'nom', 'slug', 'ordre']

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'ville', 'pays', 'image']
class SupDestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'

class OffreImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = OffreImage
        fields = ['id', 'image_url', 'ordre']


class OptionExtraSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptionExtra
        fields = ['id', 'nom', 'description', 'prix', 'obligatoire']

class DepartDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartDetail
        fields = ['id', 'date_depart', 'date_retour', 'prix', 'places_total', 'places_dispo', 'statut']

class OffreSerializer(serializers.ModelSerializer):
    categorie = CategorieSerializer()
    destinations = DestinationSerializer(many=True)
    depart_details = DepartDetailSerializer(many=True)
    extras = OptionExtraSerializer(many=True)
    images = OffreImageSerializer(many=True)

    class Meta:
        model = Offre
        fields = ['id', 'titre', 'slug', 'description', 'categorie', 'image_principale', 'destinations', 'active', 'mise_en_avant', 'created_at', 'updated_at', 'depart_details', 'extras', 'images']

class OffrePlanningSerializer(serializers.ModelSerializer):
    class Meta:
        model = OffrePlanning
        fields = '__all__'

class OffreDetailSerializer(serializers.ModelSerializer):
    depart_details = DepartDetailSerializer(many=True)
    extras = OptionExtraSerializer(many=True)
    images = OffreImageSerializer(many=True)
    plannings = OffrePlanningSerializer(many=True)

    class Meta:
        model = Offre
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking        
        fields = ['id', 'offre', 'nom', 'email', 'telephone', 'nombre_personnes', 'date_reservation', 'message']

class SupBookingSerializer(serializers.ModelSerializer):
    offre_titre = serializers.CharField(source='offre.titre', read_only=True)
    class Meta:
        model = Booking
        fields = ['id', 'offre','offre_titre', 'nom', 'email', 'telephone', 'nombre_personnes', 'date_reservation', 'message','statut']
        extra_kwargs = {
            'statut': {'required': True} 
        }
class ManagerBookingSerializer(serializers.ModelSerializer):
    offre_titre = serializers.CharField(source='offre.titre', read_only=True)
    has_facture = serializers.SerializerMethodField()
    numero_facture = serializers.SerializerMethodField()
    class Meta:
        model = Booking
        fields = ['id', 'offre','offre_titre', 'nom', 'email', 'telephone', 'nombre_personnes', 'date_reservation', 'message','statut','has_facture', 'numero_facture']
        extra_kwargs = {
            'statut': {'required': True} 
        }
    def get_has_facture(self, obj):
        return obj.factures.exists()
    def get_numero_facture(self, obj):
        facture = obj.factures.first()
        return facture.numero_facture if facture else None
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'methode']

class SupOffreSerializer(serializers.ModelSerializer):
    categorie = serializers.PrimaryKeyRelatedField(queryset=Categorie.objects.all())  
    destinations = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Destination.objects.all()
    )
    categorieNom = serializers.SerializerMethodField()
    destinationsVilles = serializers.SerializerMethodField()

    class Meta:
        model = Offre
        fields = [
            'id',
            'titre',
            'description',
            'categorie',
            'categorieNom',
            'image_principale',
            'active',
            'mise_en_avant',
            'populaire',
            'destinations',
            'destinationsVilles',
        ]
    def get_categorieNom(self, obj):
        # Récupère le nom de la catégorie ou 'Inconnue' si elle est vide
        return obj.categorie.nom if obj.categorie else 'Inconnue'

    def get_destinationsVilles(self, obj):
        # Récupère les destinations sous forme de chaîne de villes séparées par des virgules
        return ', '.join([destination.ville for destination in obj.destinations.all()]) if obj.destinations.exists() else 'Aucune destination'
    def create(self, validated_data):
        destinations = validated_data.pop('destinations', [])
        offre = Offre.objects.create(**validated_data)
        offre.destinations.set(destinations)
        return offre

    def update(self, instance, validated_data):
        destinations = validated_data.pop('destinations', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if destinations is not None:
            instance.destinations.set(destinations)
        return instance

class SupDepartDetailSerializer(serializers.ModelSerializer):
    offre_titre = serializers.CharField(source='offre.titre', read_only=True)

    class Meta:
        model = DepartDetail
        fields = ['id', 'offre', 'offre_titre', 'date_depart', 'date_retour', 'prix', 'places_total', 'places_dispo', 'statut']
        
class PartenaireSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partenaire
        fields = ['id', 'nom', 'type_partenaire', 'contact_nom', 'contact_email', 'contact_telephone', 'site_web', 'actif', 'remarque','offres_associees','commercial_responsable']


class ContratPartenaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContratPartenaire
        fields = ['id','partenaire', 'titre','description', 'fichier_contrat','date_debut', 'date_fin', 'statut']

class ComptBookingSerializer(serializers.ModelSerializer):
    options_extras = OptionExtraSerializer(many=True, read_only=True)
    offre = OffreSerializer()
    class Meta:
        model = Booking
        fields = ['id', 'nom', 'offre', 'email', 'telephone', 'nombre_personnes', 'date_reservation', 'statut', 'options_extras']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.offre:
            representation['options_extras'] = OptionExtraSerializer(instance.offre.extras.all(), many=True).data
        return representation
class CompttBookingSerializer(serializers.ModelSerializer):
    offre = OffreSerializer()
    class Meta:
        model = Booking
        fields = ['id', 'offre', 'nom', 'email', 'telephone', 'nombre_personnes', 'date_reservation', 'message']

class FactureSerializer(serializers.ModelSerializer):
    booking = ComptBookingSerializer()
    options_extras = OptionExtraSerializer(many=True)

    class Meta:
        model = Facture
        fields = '__all__'

    def to_representation(self, instance):
        """Personnaliser la représentation pour inclure le titre de l'offre"""
        representation = super().to_representation(instance)
        representation['offre_titre'] = instance.booking.offre.titre if instance.booking.offre else None
        return representation

class HistoriquePaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriquePaiement
        fields = '__all__'
class HistoriquePaiementHotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriquePaiementHotel
        fields = '__all__'


class StatsOffreSerializer(serializers.ModelSerializer):
    offres_count = serializers.SerializerMethodField()

    class Meta:
        model = Destination
        fields = ['id', 'ville','pays', 'offres_count']

    def get_offres_count(self, obj):
        return obj.offres.count()
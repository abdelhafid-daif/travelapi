from rest_framework import serializers
from .models import Hotel, Chambre, ReservationHotel, Devis, Facture, HotelImage,Client , ReservationHotel
from travel.serializers import DestinationSerializer
from travel.models import Destination

class HotelSerializer(serializers.ModelSerializer):
    destinations = DestinationSerializer(read_only=True,default=None)
    destinations_ville = serializers.CharField(source='destinations.ville', read_only=True)
    destinations_pays = serializers.CharField(source='destinations.pays', read_only=True)
    destinations_id = serializers.PrimaryKeyRelatedField(
        queryset=Destination.objects.all(), source='destinations', write_only=True
    )

    class Meta:
        model = Hotel
        fields = ['id', 'nom', 'adresse', 'etoiles', 'description', 'destinations', 'destinations_id','destinations_ville', 'destinations_pays','prix_init','latitude','longitude']

class HotelImageSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel.nom', read_only=True)
    class Meta:
        model = HotelImage
        fields = ['id','hotel','hotel_name','image_url','ordre']

class ChambreSerializer(serializers.ModelSerializer):
    hotel_nom = serializers.CharField(source='hotel.nom', read_only=True)  # Ajouter le nom de l'hôtel associé
    hotel_adresse = serializers.CharField(source='hotel.adresse', read_only=True)  # Ajouter le pays de l'hôtel associé

    class Meta:
        model = Chambre
        fields = ['id', 'hotel', 'hotel_nom', 'hotel_adresse', 'numero', 'type_chambre', 'prix_par_nuit', 'capacite', 'est_disponible']
        
    def validate_prix_par_nuit(self, value):
        """Validation pour s'assurer que le prix est positif."""
        if value <= 0:
            raise serializers.ValidationError("Le prix par nuit doit être positif.")
        return value

class ReservationHotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReservationHotel
        fields = ['id', 'client', 'chambre', 'date_arrivee', 'date_depart', 'statut', 'date_reservation']

class DevisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devis
        fields = ['id', 'reservation', 'date_creation', 'montant_estime']

class FactureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facture
        fields = ['id', 'reservation', 'numero', 'date_facture', 'montant_total', 'statut_paiement']


class PublicHotelSerializer(serializers.ModelSerializer):
    images = HotelImageSerializer(many=True, read_only=True)
    chambres = ChambreSerializer(many=True, read_only=True)
    destinations = DestinationSerializer(read_only=True,default=None)
    destinations_ville = serializers.CharField(source='destinations.ville', read_only=True)
    destinations_pays = serializers.CharField(source='destinations.pays', read_only=True)

    class Meta:
        model = Hotel
        fields = ['id', 'nom','destinations','destinations_ville','destinations_pays', 'adresse', 'etoiles','prix_init', 'description', 'latitude','longitude','images', 'chambres']


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    client = ClientSerializer()

    class Meta:
        model = ReservationHotel
        fields = '__all__'

    def create(self, validated_data):
        client_data = validated_data.pop('client')
        client = Client.objects.create(**client_data)
        reservation = ReservationHotel.objects.create(client=client, **validated_data)
        return reservation

class ComReservationHotelSerializer(serializers.ModelSerializer):
    chambre = ChambreSerializer(read_only=True)
    client = ClientSerializer(read_only=True)
    get_nuits = serializers.SerializerMethodField()
    get_total = serializers.SerializerMethodField()
    client_nom = serializers.SerializerMethodField()
    hotel_nom = serializers.SerializerMethodField() 
    has_facture = serializers.SerializerMethodField()
    facture_numero = serializers.SerializerMethodField()  # Added facture number
    facture_date_facture = serializers.SerializerMethodField()
    facture_id = serializers.SerializerMethodField()

    

    class Meta:
        model = ReservationHotel
        fields = [
            'id', 'client', 'chambre', 'date_arrivee',
            'date_depart', 'statut', 'date_reservation',
            'get_nuits', 'get_total', 'client_nom', 'hotel_nom','has_facture','facture_numero','facture_date_facture','facture_id',
        ]

    def get_get_nuits(self, obj):
        return obj.get_nuits()

    def get_get_total(self, obj):
        return obj.get_total()

    def get_client_nom(self, obj):
        return obj.client.nom if obj.client else '—'

    def get_hotel_nom(self, obj):
        return obj.chambre.hotel.nom if obj.chambre and obj.chambre.hotel else '—'
        
    def get_has_facture(self, obj):
        return hasattr(obj, 'facture') 
    
    def get_facture_numero(self, obj):
        # Retrieve the invoice number if available
        return obj.facture.numero if hasattr(obj, 'facture') else None

    def get_facture_date_facture(self, obj):
        # Retrieve the invoice date if available
        return obj.facture.date_facture if hasattr(obj, 'facture') else None

    def get_facture_id(self, obj):
        # Retrieve the invoice number if available
        return obj.facture.id if hasattr(obj, 'facture') else None


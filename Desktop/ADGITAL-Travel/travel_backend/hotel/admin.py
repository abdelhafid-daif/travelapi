from django.contrib import admin
from .models import Client, Hotel, HotelImage, Chambre, ReservationHotel, Devis, Facture

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('nom', 'type_client', 'email', 'telephone', 'date_creation')
    search_fields = ('nom', 'email', 'telephone')
    list_filter = ('type_client', 'date_creation')


class HotelImageInline(admin.TabularInline):
    model = HotelImage
    extra = 1


class ChambreInline(admin.TabularInline):
    model = Chambre
    extra = 1


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('nom', 'destinations', 'etoiles', 'prix_init', 'latitude', 'longitude')
    search_fields = ('nom', 'adresse', 'description')
    list_filter = ('etoiles', 'destinations')
    inlines = [HotelImageInline, ChambreInline]


@admin.register(Chambre)
class ChambreAdmin(admin.ModelAdmin):
    list_display = ('hotel', 'numero', 'type_chambre', 'prix_par_nuit', 'capacite', 'est_disponible')
    list_filter = ('hotel', 'type_chambre', 'est_disponible')
    search_fields = ('hotel__nom', 'numero')


@admin.register(ReservationHotel)
class ReservationHotelAdmin(admin.ModelAdmin):
    list_display = ('client', 'chambre', 'date_arrivee', 'date_depart', 'statut', 'date_reservation', 'get_total')
    list_filter = ('statut', 'date_arrivee', 'date_depart')
    search_fields = ('client__nom', 'chambre__hotel__nom')

    def get_total(self, obj):
        return obj.get_total()
    get_total.short_description = 'Montant total'


@admin.register(Devis)
class DevisAdmin(admin.ModelAdmin):
    list_display = ('reservation', 'date_creation', 'montant_estime')


@admin.register(Facture)
class FactureAdmin(admin.ModelAdmin):
    list_display = ('reservation', 'numero', 'date_facture', 'montant_total', 'statut_paiement')
    list_filter = ('statut_paiement',)
    search_fields = ('numero', 'reservation__client__nom')

from django.contrib import admin
from .models import Categorie, Destination, Offre, DepartDetail, OptionExtra, OffreImage,Booking,Payment,OffrePlanning,Facture,HistoriquePaiement

@admin.register(Categorie)
class CategorieAdmin(admin.ModelAdmin):
    list_display = ('nom', 'slug', 'ordre')
    prepopulated_fields = {'slug': ('nom',)}
    search_fields = ('nom',)

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ('ville', 'pays', 'populaire', 'image')
    list_filter = ('populaire',)
    search_fields = ('ville', 'pays')

@admin.register(Offre)
class OffreAdmin(admin.ModelAdmin):
    list_display = ('titre', 'slug', 'categorie', 'active', 'mise_en_avant', 'populaire', 'created_at', 'updated_at')
    list_filter = ('active', 'mise_en_avant', 'populaire', 'categorie')
    search_fields = ('titre', 'description')
    prepopulated_fields = {'slug': ('titre',)}
    filter_horizontal = ('destinations',)

@admin.register(DepartDetail)
class DepartDetailAdmin(admin.ModelAdmin):
    list_display = ('offre', 'date_depart', 'date_retour', 'prix', 'places_total', 'places_dispo', 'statut')
    list_filter = ('statut', 'offre')
    search_fields = ('offre__titre', 'date_depart')

@admin.register(OptionExtra)
class OptionExtraAdmin(admin.ModelAdmin):
    list_display = ('offre', 'nom', 'prix', 'obligatoire')
    list_filter = ('obligatoire', 'offre')
    search_fields = ('nom', 'offre__titre')

@admin.register(OffreImage)
class OffreImageAdmin(admin.ModelAdmin):
    list_display = ('offre', 'image_url', 'ordre')
    list_filter = ('offre',)
    search_fields = ('offre__titre',)
    ordering = ['ordre']

class OffrePlanningAdmin(admin.ModelAdmin):
    list_display = ('offre', 'jour', 'titre')
    list_filter = ('offre',)
    ordering = ('offre', 'jour')

admin.site.register(OffrePlanning, OffrePlanningAdmin)
@admin.register(Facture)
class FactureAdmin(admin.ModelAdmin):
    list_display = ['numero_facture', 'booking', 'montant_total', 'statut', 'date_emission']
    search_fields = ['numero_facture', 'booking__nom']
    list_filter = ['statut', 'date_emission']

@admin.register(HistoriquePaiement)
class HistoriquePaiementAdmin(admin.ModelAdmin):
    list_display = ['facture', 'date_paiement', 'montant', 'methode']
    list_filter = ['methode', 'date_paiement']
    search_fields = ['facture__numero_facture']
admin.site.register(Booking)
admin.site.register(Payment)

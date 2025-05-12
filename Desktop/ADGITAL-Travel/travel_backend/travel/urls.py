from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import OffreDetailAPIView,BookingWithPaymentCreateView,CreateFactureView,SecureFileDownloadView,booking_stats,ContratStatsView,PartenaireStatsView,FactureChartData,statistiques_paiements,BookingStatsByOffre,OffreParDestinationView,BookingStatsView
from hotel.views import PublicHotelViewSet,PublicHotelImageViewSet,PublicChambreViewSet,CreateReservationAPIView
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()

# Enregistrement des vues avec des basenames uniques
router.register(r'categories', views.CategorieViewSet, basename='category')
router.register(r'destinations', views.DestinationViewSet, basename='destination')
router.register(r'offres', views.OffreViewSet, basename='offer')
router.register(r'offres-cat', views.OffreByCatViewSet, basename='offrescat')
router.register(r'offres-dest', views.OffreByDestViewSet, basename='offresdest')
router.register(r'offres-sherch', views.OffreSherchViewSet, basename='offressherch')
router.register(r'depart-details', views.DepartDetailViewSet, basename='departdetail')
router.register(r'option-extras', views.OptionExtraViewSet, basename='optionextra')
router.register(r'offre-images', views.OffreImageViewSet, basename='offreimage')

router.register(r'hotels', PublicHotelViewSet,basename='hotels')
router.register(r'images', PublicHotelImageViewSet,basename='img')
router.register(r'chambres', PublicChambreViewSet,basename='chambers')

# Basename unique pour les vues populaires
router.register(r'popular-destinations', views.PopularDestinationViewSet, basename='populardestination')
router.register(r'popular-offres', views.PopularOffreViewSet, basename='popularoffer')

#Support 
router.register(r'categories-crud', views.SupCategorieViewSet, basename='category-crud')
router.register(r'destinations-crud', views.SupDestinationViewSet, basename='destinations-crud')
router.register(r'offres-crud', views.SupOffreViewSet, basename='offres-crud')
router.register(r'depart-details-crud', views.SupDepartDetailViewSet, basename='departdetail-crud')
router.register(r'booking-dtst', views.SupBookingViewSet, basename='booking-crud')

#Commercial
router.register(r'part-crud', views.PartenaireViewSet, basename='part-crud')
router.register(r'contrats-part', views.ContratPartenaireViewSet, basename='contratpartenaire')

#Comptable 
router.register(r'compt-bookings', views.ComptBookingViewSet,basename='booking-confermed' )
router.register(r'compt-factures', views.FactureViewSet,basename='booking-facture' )
router.register(r'historique_paiements', views.HistoriquePaiementViewSet,basename='history-facture')
router.register(r'historique_paiements_hotel', views.HistoriquePaiementHotelViewSet,basename='history-facture-hotel')
router.register(r'Manager-Bookingoff',views.ManagerBookingViewSet,basename='all_booking')


urlpatterns = [
    path('api/', include(router.urls)),
    path('offres/<slug:slug>/', OffreDetailAPIView.as_view(), name='offre-detail'),
    path('booking-payment/', BookingWithPaymentCreateView.as_view(), name='booking-payment'),
    path('options_extras/<int:booking_id>/', CreateFactureView.as_view(), name='booking-facture'),
    path('serve_facture/<str:file_name>/', SecureFileDownloadView.as_view(), name='serve_facture'),
    path('booking-stats/',booking_stats,name='stats'),
    path('stats-partenaires/', PartenaireStatsView.as_view(), name='partenaire-stats'),
    path('stats-contrats/', ContratStatsView.as_view(), name='contrat-stats'),
    path('stats-factures/', FactureChartData.as_view(), name='facture-stats'),
    path('reservations/', CreateReservationAPIView.as_view(), name='create-reservation'),
    path('statistiques-paiements/',statistiques_paiements, name='stats-payements'),
    path('booking-stats-by-offre/', BookingStatsByOffre.as_view(), name='booking_stats_by_offre'),
    path('offres-par-destination/', OffreParDestinationView.as_view()),
    path('booking-stats-date/', BookingStatsView.as_view(), name='booking-stats-date'),





]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import HotelViewSet, ChambreViewSet, ReservationHotelViewSet, DevisViewSet, FactureViewSet, HotelImageViewSet,create_facture
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'hotels', HotelViewSet)
router.register(r'hotel-images', HotelImageViewSet)
router.register(r'chambers', ChambreViewSet)
router.register(r'reservations', ReservationHotelViewSet)
router.register(r'devis', DevisViewSet)
router.register(r'factures', FactureViewSet)



urlpatterns = [
    path('hot/', include(router.urls)),
    path('hot/facture-create/<int:reservation_id>/',create_facture, name='create-reservation')
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

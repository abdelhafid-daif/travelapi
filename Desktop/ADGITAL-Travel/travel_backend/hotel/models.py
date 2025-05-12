from django.db import models
from travel.models import Destination

class Client(models.Model):
    TYPE_CLIENT_CHOICES = [
        ('particulier', 'Particulier'),
        ('entreprise', 'Entreprise'),
        ('groupe', 'Groupe'),
        ('scolaire', 'Scolaire'),
    ]
    nom = models.CharField(max_length=255)
    type_client = models.CharField(max_length=50, choices=TYPE_CLIENT_CHOICES,default='particulier')
    email = models.EmailField(blank=True, null=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nom


class Hotel(models.Model):
    nom = models.CharField(max_length=255)
    destinations = models.ForeignKey(Destination,  on_delete=models.CASCADE,related_name='hotels')
    adresse = models.TextField()
    etoiles = models.PositiveIntegerField(default=3)
    description = models.TextField(blank=True, null=True)
    prix_init = models.DecimalField(max_digits=8, decimal_places=2,blank=True, null=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.nom


class HotelImage(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='images')
    image_url = models.ImageField(upload_to='hotels/gallery/')
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['ordre']
    def __str__(self):
        return f"Image {self.ordre} de {self.hotel.nom}"

class Chambre(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='chambres')
    numero = models.CharField(max_length=10)
    type_chambre = models.CharField(max_length=50, choices=[
        ('simple', 'Simple'),
        ('double', 'Double'),
        ('suite', 'Suite')
    ])
    prix_par_nuit = models.DecimalField(max_digits=8, decimal_places=2)
    capacite = models.PositiveIntegerField()
    est_disponible = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.hotel.nom} - {self.numero}"


class ReservationHotel(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    chambre = models.ForeignKey(Chambre, on_delete=models.CASCADE)
    date_arrivee = models.DateField()
    date_depart = models.DateField()
    statut = models.CharField(max_length=20, choices=[
        ('en_attente', 'En attente'),
        ('confirmee', 'Confirmée'),
        ('annulee', 'Annulée')
    ], default='en_attente')
    date_reservation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.client.nom} - {self.chambre.hotel.nom}"

    def get_nuits(self):
        return (self.date_depart - self.date_arrivee).days

    def get_total(self):
        return self.get_nuits() * self.chambre.prix_par_nuit


class Devis(models.Model):
    reservation = models.OneToOneField(ReservationHotel, on_delete=models.CASCADE, related_name='devis')
    date_creation = models.DateTimeField(auto_now_add=True)
    montant_estime = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"Devis pour {self.reservation}"


class Facture(models.Model):
    reservation = models.OneToOneField(ReservationHotel, on_delete=models.CASCADE, related_name='facture')
    numero = models.CharField(max_length=100, unique=True)
    date_facture = models.DateTimeField(auto_now_add=True)
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)
    statut_paiement = models.CharField(max_length=20, choices=[
        ('non_payee', 'Non payée'),
        ('payee', 'Payée'),
        ('partiellement_payee', 'Partiellement payée'),
    ], default='non_payee')

    def __str__(self):
        return f"Facture #{self.numero}"


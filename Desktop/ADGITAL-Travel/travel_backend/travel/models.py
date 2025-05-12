from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.conf import settings

class Categorie(models.Model):
    nom = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    ordre = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.nom
class Destination(models.Model):
    ville = models.CharField(max_length=100)
    pays = models.CharField(max_length=100)
    image = models.ImageField(upload_to='offres/destination')
    populaire = models.BooleanField(default=False) 


    def __str__(self):
        return f"{self.ville}, {self.pays}"


class Offre(models.Model):
    titre = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    categorie = models.ForeignKey(Categorie, on_delete=models.SET_NULL, null=True, related_name='offres')
    image_principale = models.ImageField(upload_to='offres/')
    destinations = models.ManyToManyField(Destination, related_name='offres')
    active = models.BooleanField(default=True)
    mise_en_avant = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    populaire = models.BooleanField(default=False) 

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.titre


class DepartDetail(models.Model):
    STATUT_CHOICES = [
        ('ouvert', 'Ouvert'),
        ('ferme', 'Fermé'),
        ('complet', 'Complet'),
    ]

    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='depart_details')
    date_depart = models.DateField()
    date_retour = models.DateField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    places_total = models.PositiveIntegerField()
    places_dispo = models.PositiveIntegerField()
    statut = models.CharField(max_length=10, choices=STATUT_CHOICES, default='ouvert')
    def __str__(self):
        return f"{self.offre.titre} - {self.date_depart} ({self.statut})"


class OptionExtra(models.Model):
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='extras')
    nom = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    prix = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    obligatoire = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nom} ({'Obligatoire' if self.obligatoire else 'Optionnel'})"


class OffreImage(models.Model):
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='images')
    image_url = models.ImageField(upload_to='offres/gallery/')
    ordre = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['ordre']

    def __str__(self):
        return f"Image {self.ordre} de {self.offre.titre}"


class OffrePlanning(models.Model):
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='plannings')
    jour = models.PositiveIntegerField(help_text="Jour de l'activité (ex: 1 pour le premier jour)")
    titre = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='offres/plannings/', blank=True, null=True)

    class Meta:
        ordering = ['jour']

    def __str__(self):
        return f"Jour {self.jour} - {self.titre} ({self.offre.titre})"

class Booking(models.Model):
    offre = models.ForeignKey(Offre, on_delete=models.CASCADE, related_name='bookings')
    nom = models.CharField(max_length=100)
    email = models.EmailField()
    telephone = models.CharField(max_length=20)
    nombre_personnes = models.PositiveIntegerField()
    date_reservation = models.DateTimeField(default=timezone.now)
    message = models.TextField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=[
        ('en_attente', 'En attente'),
        ('confirmee', 'Confirmée'),
        ('annulee', 'Annulée'),
    ], default='en_attente')

    def __str__(self):
        return f"Réservation de {self.nom} pour {self.offre.titre}"

class Payment(models.Model):
    METHODE_CHOIX = [
        ('carte_bancaire', 'Carte Bancaire'),
        ('sur_place', 'Paiement sur place'),
        ('virement_bancaire', 'Virement bancaire'),
        ('cheque', 'Chèque'),
    ]
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    montant = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    avance = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    statut = models.CharField(max_length=20, choices=[
        ('en_attente', 'En attente'),
        ('effectue', 'Effectué'),
        ('echoue', 'Échoué'),
    ], default='en_attente')
    methode = models.CharField(max_length=30, choices=METHODE_CHOIX)
    date_paiement = models.DateTimeField(auto_now_add=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    def __str__(self):
        return f"Paiement de {self.montant} MAD - {self.statut}"

class Partenaire(models.Model):
    TYPE_CHOICES = [
        ('hotel', 'Hôtel'),
        ('transport', 'Transport'),
        ('guide', 'Guide touristique'),
        ('agence_locale', 'Agence locale'),
        ('autre', 'Autre'),
    ]
    nom = models.CharField(max_length=255)
    type_partenaire = models.CharField(max_length=50, choices=TYPE_CHOICES)
    contact_nom = models.CharField(max_length=255)
    contact_email = models.EmailField(blank=True, null=True)
    contact_telephone = models.CharField(max_length=50, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    site_web = models.URLField(blank=True, null=True)
    actif = models.BooleanField(default=True)
    remarque = models.TextField(blank=True, null=True)
    offres_associees = models.TextField(blank=True, null=True)
    commercial_responsable = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='partenaires_gérés')

    def __str__(self):
        return f"{self.nom} ({self.get_type_partenaire_display()})"

class ContratPartenaire(models.Model):
    partenaire = models.ForeignKey(Partenaire, on_delete=models.CASCADE, related_name='contrats')
    titre = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    fichier_contrat = models.FileField(upload_to='contrats_partenaire/', blank=True, null=True)
    date_debut = models.DateField()
    date_fin = models.DateField(blank=True, null=True)
    statut = models.CharField(max_length=50, choices=[
        ('actif', 'Actif'),
        ('expire', 'Expiré'),
        ('resilie', 'Résilié'),
    ], default='actif')
    date_creation = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.titre} ({self.partenaire.nom})"

class Facture(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='factures')
    numero_facture = models.CharField(max_length=100, unique=True)
    date_emission = models.DateField(auto_now_add=True)
    prix_offre = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    montant_total = models.DecimalField(max_digits=10, decimal_places=2)
    statut = models.CharField(max_length=50, choices=[
        ('en_attente', 'En attente'),
        ('payée', 'Payée'),
        ('annulée', 'Annulée'),
    ], default='en_attente')
    options_extras = models.ManyToManyField(OptionExtra, blank=True)

    def __str__(self):
        return f"Facture {self.numero_facture} - {self.booking.nom}"
    
    def validate_options(self):

        valid_options = self.booking.offre.extras.all()  
        for option in self.options_extras.all():
            if option not in valid_options:
                raise ValueError(f"L'option '{option.nom}' n'est pas disponible pour l'offre '{self.booking.offre.titre}'.")

class HistoriquePaiement(models.Model):
    facture = models.ForeignKey(Facture, on_delete=models.CASCADE, related_name='paiements')
    date_paiement = models.DateTimeField(auto_now_add=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    methode = models.CharField(max_length=50, choices=[
        ('carte_bancaire', 'Carte Bancaire'),
        ('virement', 'Virement Bancaire'),
        ('cheque', 'Chèque'),
        ('espèces', 'Espèces'),
    ])
    note = models.TextField(blank=True, null=True)
    comptable = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'profile__is_comptable': True})
    fichier_facture = models.FileField(upload_to='factures/', blank=True, null=True)
    def __str__(self):
        return f"Paiement de {self.montant} MAD le {self.date_paiement.date()} pour {self.facture.numero_facture}"

class HistoriquePaiementHotel(models.Model):
    facture = models.ForeignKey('hotel.Facture', on_delete=models.CASCADE, related_name='paiements_hotel')
    date_paiement = models.DateTimeField(auto_now_add=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    methode = models.CharField(max_length=50, choices=[
        ('carte_bancaire', 'Carte Bancaire'),
        ('virement', 'Virement Bancaire'),
        ('cheque', 'Chèque'),
        ('espèces', 'Espèces'),
    ])
    note = models.TextField(blank=True, null=True)
    comptable = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'profile__is_comptable': True}
    )
    fichier_facture = models.FileField(upload_to='factures_hotel/', blank=True, null=True)

    def __str__(self):
        return f"Paiement de {self.montant} MAD le {self.date_paiement.date()} pour {self.facture}"


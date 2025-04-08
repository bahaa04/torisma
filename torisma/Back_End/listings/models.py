import uuid
import django
from django.db import models
from django.contrib.auth import get_user_model
from django.forms import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

User = get_user_model()

current_year = timezone.now().year

class Car(models.Model):
    CURRENCY_CHOICES = [
        ('DZD', 'Algerian Dinar (DZD)'),
        ('USD', 'US Dollar (USD)'),
        ('EUR', 'Euro (EUR)'),
        ('GBP', 'British Pound (GBP)'),
    ]

    wilayas = [
    ('Adrar', 'Adrar'),
    ('Chlef', 'Chlef'),
    ('Laghouat', 'Laghouat'),
    ('Oum El Bouaghi', 'Oum El Bouaghi'),
    ('Batna', 'Batna'),
    ('Béjaïa', 'Béjaïa'),
    ('Biskra', 'Biskra'),
    ('Béchar', 'Béchar'),
    ('Blida', 'Blida'),
    ('Bouira', 'Bouira'),
    ('Tamanrasset', 'Tamanrasset'),
    ('Tébessa', 'Tébessa'),
    ('Tlemcen', 'Tlemcen'),
    ('Tiaret', 'Tiaret'),
    ('Tizi Ouzou', 'Tizi Ouzou'),
    ('Algiers', 'Algiers'),
    ('Djelfa', 'Djelfa'),
    ('Jijel', 'Jijel'),
    ('Sétif', 'Sétif'),
    ('Saïda', 'Saïda'),
    ('Skikda', 'Skikda'),
    ('Sidi Bel Abbès', 'Sidi Bel Abbès'),
    ('Annaba', 'Annaba'),
    ('Guelma', 'Guelma'),
    ('Constantine', 'Constantine'),
    ('Médéa', 'Médéa'),
    ('Mostaganem', 'Mostaganem'),
    ('MSila', 'MSila'),
    ('Mascara', 'Mascara'),
    ('Ouargla', 'Ouargla'),
    ('Oran', 'Oran'),
    ('El Bayadh', 'El Bayadh'),
    ('Illizi', 'Illizi'),
    ('Bordj Bou Arréridj', 'Bordj Bou Arréridj'),
    ('Boumerdès', 'Boumerdès'),
    ('El Tarf', 'El Tarf'),
    ('Tindouf', 'Tindouf'),
    ('Tissemsilt', 'Tissemsilt'),
    ('El Oued', 'El Oued'),
    ('Khenchela', 'Khenchela'),
    ('Souk Ahras', 'Souk Ahras'),
    ('Tipaza', 'Tipaza'),
    ('Mila', 'Mila'),
    ('Aïn Defla', 'Aïn Defla'),
    ('Naâma', 'Naâma'),
    ('Aïn Témouchent', 'Aïn Témouchent'),
    ('Ghardaïa', 'Ghardaïa'),
    ('Relizane', 'Relizane'),
    ('Timimoun', 'Timimoun'),
    ('Bordj Badji Mokhtar', 'Bordj Badji Mokhtar'),
    ('Ouled Djellal', 'Ouled Djellal'),
    ('Béni Abbès', 'Béni Abbès'),
    ('In Salah', 'In Salah'),
    ('In Guezzam', 'In Guezzam'),
    ('Touggourt', 'Touggourt'),
    ('Djanet', 'Djanet'),
    ('El MGhair', 'El MGhair'),
    ('El Meniaa', 'El Meniaa')
]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='DZD')
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    updated_at = models.DateTimeField(default=django.utils.timezone.now)
    is_active = models.BooleanField(default=True)
    la_wilaya = models.CharField(max_length=100, choices=wilayas)

    fuel_types = [
        ('gasoline', 'Gasoline'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
        ('hybrid', 'Hybrid'),
        ('other', 'Other'),
    ]

    manufacture = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    manufacturing_year = models.IntegerField(
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(current_year)
        ]
    )
    seats = models.IntegerField()
    fuel_type = models.CharField(max_length=50, choices=fuel_types)

    class Meta:
        db_table = 'listings_car'

    def clean(self):
        if self.manufacturing_year is not None and (self.manufacturing_year < 1900 or self.manufacturing_year > current_year):
            raise ValidationError({
                'manufacturing_year': f"Year must be between 1900 and {current_year}."})

    def save(self, *args, **kwargs):
        self.is_active = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.manufacture} {self.model} ({self.manufacturing_year}) in {self.la_wilaya}"

class HouseHotel(models.Model):
    CURRENCY_CHOICES = [
        ('DZD', 'Algerian Dinar (DZD)'),
        ('USD', 'US Dollar (USD)'),
        ('EUR', 'Euro (EUR)'),
        ('GBP', 'British Pound (GBP)'),
    ]

    wilayas = [
    ('Adrar', 'Adrar'),
    ('Chlef', 'Chlef'),
    ('Laghouat', 'Laghouat'),
    ('Oum El Bouaghi', 'Oum El Bouaghi'),
    ('Batna', 'Batna'),
    ('Béjaïa', 'Béjaïa'),
    ('Biskra', 'Biskra'),
    ('Béchar', 'Béchar'),
    ('Blida', 'Blida'),
    ('Bouira', 'Bouira'),
    ('Tamanrasset', 'Tamanrasset'),
    ('Tébessa', 'Tébessa'),
    ('Tlemcen', 'Tlemcen'),
    ('Tiaret', 'Tiaret'),
    ('Tizi Ouzou', 'Tizi Ouzou'),
    ('Algiers', 'Algiers'),
    ('Djelfa', 'Djelfa'),
    ('Jijel', 'Jijel'),
    ('Sétif', 'Sétif'),
    ('Saïda', 'Saïda'),
    ('Skikda', 'Skikda'),
    ('Sidi Bel Abbès', 'Sidi Bel Abbès'),
    ('Annaba', 'Annaba'),
    ('Guelma', 'Guelma'),
    ('Constantine', 'Constantine'),
    ('Médéa', 'Médéa'),
    ('Mostaganem', 'Mostaganem'),
    ('MSila', 'MSila'),
    ('Mascara', 'Mascara'),
    ('Ouargla', 'Ouargla'),
    ('Oran', 'Oran'),
    ('El Bayadh', 'El Bayadh'),
    ('Illizi', 'Illizi'),
    ('Bordj Bou Arréridj', 'Bordj Bou Arréridj'),
    ('Boumerdès', 'Boumerdès'),
    ('El Tarf', 'El Tarf'),
    ('Tindouf', 'Tindouf'),
    ('Tissemsilt', 'Tissemsilt'),
    ('El Oued', 'El Oued'),
    ('Khenchela', 'Khenchela'),
    ('Souk Ahras', 'Souk Ahras'),
    ('Tipaza', 'Tipaza'),
    ('Mila', 'Mila'),
    ('Aïn Defla', 'Aïn Defla'),
    ('Naâma', 'Naâma'),
    ('Aïn Témouchent', 'Aïn Témouchent'),
    ('Ghardaïa', 'Ghardaïa'),
    ('Relizane', 'Relizane'),
    ('Timimoun', 'Timimoun'),
    ('Bordj Badji Mokhtar', 'Bordj Badji Mokhtar'),
    ('Ouled Djellal', 'Ouled Djellal'),
    ('Béni Abbès', 'Béni Abbès'),
    ('In Salah', 'In Salah'),
    ('In Guezzam', 'In Guezzam'),
    ('Touggourt', 'Touggourt'),
    ('Djanet', 'Djanet'),
    ('El MGhair', 'El MGhair'),
    ('El Meniaa', 'El Meniaa')
]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='DZD')
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    la_wilaya = models.CharField(max_length=100, choices=wilayas)

    HOUSE_HOTEL_TYPES = [
        ('house', 'House'),
        ('hotel', 'Hotel'),
    ]

    number_of_rooms = models.IntegerField()
    has_parking = models.BooleanField(default=False)
    has_wifi = models.BooleanField(default=False)
    is_furnished = models.BooleanField(default=True)
    type = models.CharField(max_length=10, choices=HOUSE_HOTEL_TYPES, default='house')
    exact_location = models.CharField(max_length=255)

    class Meta:
        db_table = 'listings_househotel'
        verbose_name = "House/Hotel"
        verbose_name_plural = "Houses/Hotels"

    def save(self, *args, **kwargs):
        self.is_active = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.type} with {self.number_of_rooms} rooms in {self.la_wilaya}, {self.exact_location}"

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    item = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]

    def __str__(self):
        return f"{self.user.username} favorited {self.item}"

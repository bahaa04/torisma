import uuid
import django
from django.db import models
from django.contrib.auth import get_user_model
from django.forms import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_delete
from django.dispatch import receiver

User = get_user_model()

current_year = timezone.now().year

status_choices = [
    ('available', 'Available'),
    ('waiting for confirmation', 'Waiting for confirmation'),
    ('rented', 'Rented'),
    ('disabled', 'Disabled'),
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
        ('El Meniaa', 'El Meniaa'),
    ]

class Wilaya(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        choices=wilayas
    )

    def __str__(self):
        return self.name

class WilayaPhoto(models.Model):
    wilaya = models.ForeignKey(Wilaya, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='wilaya_photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.wilaya} ({self.id})"

class Car(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=django.utils.timezone.now)
    updated_at = models.DateTimeField(default=django.utils.timezone.now)
    la_wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name="cars")
    status = models.CharField(max_length=30, choices=status_choices, default='available')

    fuel_types = [
        ('gasoline', 'Gasoline'),
        ('diesel', 'Diesel'),
        ('electric', 'Electric'),
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
    seats = models.IntegerField(
        validators=[
            MinValueValidator(2),
            MaxValueValidator(9)
        ]
    )
    fuel_type = models.CharField(max_length=50, choices=fuel_types)

    class Meta:
        db_table = 'listings_car'

    def clean(self):
        if self.manufacturing_year is not None and (self.manufacturing_year < 1900 or self.manufacturing_year > current_year):
            raise ValidationError({
                'manufacturing_year': f"Year must be between 1900 and {current_year}."})

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def editable_by(self, user):
        """Check if the given user can edit this car."""
        return self.owner == user

    def __str__(self):
        return f"{self.manufacture} {self.model} ({self.manufacturing_year}) in {self.la_wilaya} - {self.price} DZD"

class House(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    la_wilaya = models.ForeignKey(Wilaya, on_delete=models.CASCADE, related_name="houses")
    status = models.CharField(max_length=30, choices=status_choices, default='available')
    number_of_rooms = models.IntegerField()
    has_parking = models.BooleanField(default=False)
    has_wifi = models.BooleanField(default=False)
    exact_location = models.CharField(max_length=255)

    class Meta:
        db_table = 'listings_house'
        verbose_name = "House"
        verbose_name_plural = "Houses"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def editable_by(self, user):
        """Check if the given user can edit this house."""
        return self.owner == user

    def __str__(self):
        return f"House with {self.number_of_rooms} rooms in {self.la_wilaya}, {self.exact_location} - {self.price} DZD"

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

class CarPhotos(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name="photos")
    photo = models.ImageField(upload_to="car_photos/", validators=[
        FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
    ])

    class Meta:
        db_table = 'listings_car_photos'

    def __str__(self):
        return f"Photo for {self.car}"

class HousePhotos(models.Model):
    house = models.ForeignKey(House, on_delete=models.CASCADE, related_name="photos")
    photo = models.ImageField(upload_to="house_photos/", validators=[
        FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])
    ])

    class Meta:
        db_table = 'listings_house_photos'

    def __str__(self):
        return f"Photo for {self.house}"

class WilayaPhotos(models.Model):
    wilaya_name = models.CharField(choices=wilayas)  # No foreign key to Wilaya
    photo = models.ImageField(
        upload_to="wilaya_photos/",
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'listings_wilaya_photos'

    def __str__(self):
        return f"Photo for {self.wilaya_name}"

@receiver(post_delete, sender=Car)
def delete_wilaya_if_no_cars_or_houses(sender, instance, **kwargs):
    wilaya = instance.la_wilaya
    if wilaya.cars.count() == 0 and wilaya.houses.count() == 0:
        wilaya.delete()

@receiver(post_delete, sender=House)
def delete_wilaya_if_no_cars_or_houses_house(sender, instance, **kwargs):
    wilaya = instance.la_wilaya
    if wilaya.cars.count() == 0 and wilaya.houses.count() == 0:
        wilaya.delete()

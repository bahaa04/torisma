from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Car, House, Favorite, CarPhotos, HousePhotos, Wilaya, WilayaPhotos
import datetime

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

# Car Photos Serializer
class CarPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPhotos
        fields = ['id', 'photo']

# House Photos Serializer
class HousePhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = HousePhotos
        fields = ['id', 'photo']

# Wilaya Photos Serializer
class WilayaPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = WilayaPhotos
        fields = ['id', 'wilaya_name', 'photo', 'uploaded_at']

# Car Serializer
class CarSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    manufacturing_year = serializers.IntegerField()
    photos = CarPhotosSerializer(many=True, read_only=True)  # Include car photos
    la_wilaya = serializers.CharField()  # Accept Wilaya name as input
    price = serializers.DecimalField(max_digits=10, decimal_places=2)  # Use DecimalField for price
    status = serializers.ChoiceField(choices=[
        ('available', 'Available'),
        ('waiting for confirmation', 'Waiting for confirmation'),
        ('rented', 'Rented'),
        ('disabled', 'Disabled'),
    ], default='available')  # Make status writable with choices

    def validate_manufacturing_year(self, value):
        current_year = datetime.datetime.now().year
        if value < 1900 or value > current_year:
            raise serializers.ValidationError(f"Manufacturing year must be between 1900 and {current_year}")
        return value

    def validate_la_wilaya(self, value):
        # Ensure the Wilaya name is valid
        if value not in [w[0] for w in wilayas]:
            raise serializers.ValidationError("Invalid wilaya name")
        return value

    class Meta:
        model = Car
        fields = [
            'id',
            'owner',
            'description',
            'price',
            'la_wilaya',
            'created_at',
            'updated_at',
            'manufacture',
            'model',
            'manufacturing_year',
            'location',
            'seats',
            'fuel_type',
            'photos',
            'status'
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at']

# House Serializer
class HouseSerializer(serializers.ModelSerializer):  # Updated model name
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    is_favorised = serializers.SerializerMethodField()
    photos = HousePhotosSerializer(many=True, read_only=True)  # Include house photos
    la_wilaya = serializers.CharField()  # Accept Wilaya name as input
    price = serializers.DecimalField(max_digits=10, decimal_places=2)  # Use DecimalField for price
    status = serializers.CharField(read_only=True)  # Add status field

    def validate_la_wilaya(self, value):
        # Ensure the Wilaya name is valid
        if value not in dict(wilayas).keys():
            raise serializers.ValidationError("Invalid Wilaya name.")
        return value

    def get_is_favorised(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.favorised_by.filter(user=user).exists()
        return False

    def get_price(self, obj):
        return f"{obj.price} DZD"

    class Meta:
        model = House  # Updated model name
        fields = [
            'id',
            'owner',
            'description',
            'price',
            'la_wilaya',
            'created_at',
            'updated_at',
            'number_of_rooms',
            'has_parking',
            'has_wifi',
            'exact_location',  # Mandatory field
            'photos',  # Include photos
            'status',  # Include status field
            'is_favorised'  # Explicitly include is_favorised
        ]
        read_only_fields = ['owner', 'created_at', 'updated_at', 'status']

# Favorite Serializer
class FavoriteSerializer(serializers.ModelSerializer):
    item_type = serializers.ChoiceField(choices=['car', 'house'], write_only=True)
    item_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'user', 'item_type', 'item_id', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        user = self.context['request'].user
        item_type = validated_data.pop('item_type')
        item_id = validated_data.pop('item_id')

        # Get the correct model based on item_type
        if item_type == 'car':
            model = Car
        else:
            model = House

        # Get the content type
        content_type = ContentType.objects.get_for_model(model)
        
        # Try to get the item
        try:
            item = model.objects.get(id=item_id)
        except model.DoesNotExist:
            raise serializers.ValidationError(f"{item_type} with id {item_id} does not exist")

        # Create the favorite
        favorite = Favorite.objects.create(
            user=user,
            content_type=content_type,
            object_id=item.id
        )
        
        return favorite

# Wilaya Photos Serializer
class WilayaPhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model = WilayaPhotos
        fields = '__all__'

# Wilaya Serializer
class WilayaSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()

    def get_photo(self, obj):
        # Return the URL of the first photo for this wilaya, or None
        first_photo = obj.photos().first()
        if first_photo and first_photo.photo:
            request = self.context.get('request')
            photo_url = first_photo.photo.url
            if request is not None:
                return request.build_absolute_uri(photo_url)
            return photo_url
        return None

    class Meta:
        model = Wilaya
        fields = ['id', 'name', 'photo']
from django.db import models
from django.contrib.auth import get_user_model
from listings.models import Car, House

User = get_user_model()

class UserCarRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'car')

class UserHouseRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'house')

class CarRating(models.Model):
    car_id = models.ForeignKey(
        Car, 
        to_field='id',
        db_column='car_id',
        on_delete=models.CASCADE, 
        related_name='ratings'
    )
    total_score  = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    average      = models.FloatField(default=0.0)
    updated_at   = models.DateTimeField(auto_now=True)

    def add_rating(self, score: float):
        self.total_score += score
        self.rating_count += 1
        self.average      = self.total_score / self.rating_count
        self.save()

    def recalculate_rating(self):
        ratings = UserCarRating.objects.filter(car=self.car_id)
        self.rating_count = ratings.count()
        self.total_score = sum(r.score for r in ratings)
        self.average = self.total_score / self.rating_count if self.rating_count > 0 else 0
        self.save()

    def __str__(self):
        return f"<Car {self.car_id.id}: avg={self.average:.2f}>"

class HouseRating(models.Model):
    house_id = models.ForeignKey(
        House,
        to_field='id',
        db_column='house_id',
        on_delete=models.CASCADE,
        related_name='rating_module_ratings'  # Changed related_name
    )
    total_score  = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    average      = models.FloatField(default=0.0)
    updated_at   = models.DateTimeField(auto_now=True)

    def add_rating(self, score: float):
        self.total_score += score
        self.rating_count += 1
        self.average      = self.total_score / self.rating_count
        self.save()

    def recalculate_rating(self):
        ratings = UserHouseRating.objects.filter(house=self.house_id)
        self.rating_count = ratings.count()
        self.total_score = sum(r.score for r in ratings)
        self.average = self.total_score / self.rating_count if self.rating_count > 0 else 0
        self.save()

    def __str__(self):
        return f"<House {self.house_id.id}: avg={self.average:.2f}>"

from django.db import models

class CarRating(models.Model):
    car_id       = models.CharField(max_length=100, unique=True)
    total_score  = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    average      = models.FloatField(default=0.0)
    updated_at   = models.DateTimeField(auto_now=True)

    def add_rating(self, score: float):
        self.total_score += score
        self.rating_count += 1
        self.average      = self.total_score / self.rating_count
        self.save()

    def __str__(self):
        return f"<Car {self.car_id}: avg={self.average:.2f}>"

class HouseRating(models.Model):
    house_id     = models.CharField(max_length=100, unique=True)
    total_score  = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    average      = models.FloatField(default=0.0)
    updated_at   = models.DateTimeField(auto_now=True)

    def add_rating(self, score: float):
        self.total_score += score
        self.rating_count += 1
        self.average      = self.total_score / self.rating_count
        self.save()

    def __str__(self):
        return f"<House {self.house_id}: avg={self.average:.2f}>"

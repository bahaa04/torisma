from django.db import migrations, models
import django.db.models.deletion

def populate_wilaya_relations(apps, schema_editor):
    Wilaya = apps.get_model('listings', 'Wilaya')
    Car = apps.get_model('listings', 'Car')
    House = apps.get_model('listings', 'House')

    for car in Car.objects.all():
        wilaya = Wilaya.objects.filter(name=car.la_wilaya).first()
        if wilaya:
            car.wilaya = wilaya
            car.save()

    for house in House.objects.all():
        wilaya = Wilaya.objects.filter(name=house.la_wilaya).first()
        if wilaya:
            house.wilaya = wilaya
            house.save()

class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0003_add_wilaya_model'),
    ]

    operations = [
        migrations.RunPython(populate_wilaya_relations),
    ]

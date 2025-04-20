from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='car',
            name='manufacturing_date',
            field=models.IntegerField(null=True, blank=True),
        ),
    ]

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0005_previous_migration'),  # Replace with the actual previous migration name
    ]

    operations = [
        migrations.RemoveField(
            model_name='car',
            name='manufacturing_date',
        ),
        migrations.AddField(
            model_name='car',
            name='manufacturing_date',
            field=models.IntegerField(null=True, blank=True),
        ),
    ]

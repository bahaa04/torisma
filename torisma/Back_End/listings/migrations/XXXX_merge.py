from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0006_auto_fix'),
        ('listings', '0015_remove_car_is_active_remove_house_is_active_and_more'),
    ]

    operations = [
        # Remove any operation that references 'manufacturing_date' if it no longer exists.
        # Example:
        # migrations.RemoveField(
        #     model_name='your_model_name',
        #     name='manufacturing_date',
        # ),
    ]
# Generated by Django 5.2 on 2025-04-15 09:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("listings", "0004_update_wilaya_relations"),
    ]

    operations = [
        migrations.AlterField(
            model_name="car",
            name="la_wilaya",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="cars",
                to="listings.wilaya",
            ),
        ),
        migrations.AlterField(
            model_name="house",
            name="la_wilaya",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="houses",
                to="listings.wilaya",
            ),
        ),
        migrations.AlterField(
            model_name="wilaya",
            name="name",
            field=models.CharField(
                choices=[
                    ("Adrar", "Adrar"),
                    ("Chlef", "Chlef"),
                    ("Laghouat", "Laghouat"),
                    ("Oum El Bouaghi", "Oum El Bouaghi"),
                    ("Batna", "Batna"),
                    ("Béjaïa", "Béjaïa"),
                    ("Biskra", "Biskra"),
                    ("Béchar", "Béchar"),
                    ("Blida", "Blida"),
                    ("Bouira", "Bouira"),
                    ("Tamanrasset", "Tamanrasset"),
                    ("Tébessa", "Tébessa"),
                    ("Tlemcen", "Tlemcen"),
                    ("Tiaret", "Tiaret"),
                    ("Tizi Ouzou", "Tizi Ouzou"),
                    ("Algiers", "Algiers"),
                    ("Djelfa", "Djelfa"),
                    ("Jijel", "Jijel"),
                    ("Sétif", "Sétif"),
                    ("Saïda", "Saïda"),
                    ("Skikda", "Skikda"),
                    ("Sidi Bel Abbès", "Sidi Bel Abbès"),
                    ("Annaba", "Annaba"),
                    ("Guelma", "Guelma"),
                    ("Constantine", "Constantine"),
                    ("Médéa", "Médéa"),
                    ("Mostaganem", "Mostaganem"),
                    ("MSila", "MSila"),
                    ("Mascara", "Mascara"),
                    ("Ouargla", "Ouargla"),
                    ("Oran", "Oran"),
                    ("El Bayadh", "El Bayadh"),
                    ("Illizi", "Illizi"),
                    ("Bordj Bou Arréridj", "Bordj Bou Arréridj"),
                    ("Boumerdès", "Boumerdès"),
                    ("El Tarf", "El Tarf"),
                    ("Tindouf", "Tindouf"),
                    ("Tissemsilt", "Tissemsilt"),
                    ("El Oued", "El Oued"),
                    ("Khenchela", "Khenchela"),
                    ("Souk Ahras", "Souk Ahras"),
                    ("Tipaza", "Tipaza"),
                    ("Mila", "Mila"),
                    ("Aïn Defla", "Aïn Defla"),
                    ("Naâma", "Naâma"),
                    ("Aïn Témouchent", "Aïn Témouchent"),
                    ("Ghardaïa", "Ghardaïa"),
                    ("Relizane", "Relizane"),
                    ("Timimoun", "Timimoun"),
                    ("Bordj Badji Mokhtar", "Bordj Badji Mokhtar"),
                    ("Ouled Djellal", "Ouled Djellal"),
                    ("Béni Abbès", "Béni Abbès"),
                    ("In Salah", "In Salah"),
                    ("In Guezzam", "In Guezzam"),
                    ("Touggourt", "Touggourt"),
                    ("Djanet", "Djanet"),
                    ("El MGhair", "El MGhair"),
                    ("El Meniaa", "El Meniaa"),
                ],
                unique=True,
            ),
        ),
    ]

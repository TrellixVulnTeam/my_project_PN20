# Generated by Django 3.1.2 on 2021-09-29 03:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('general', '0002_lotterystage_moneybalance'),
    ]

    operations = [
        migrations.AddField(
            model_name='lotterystage',
            name='Balance',
            field=models.IntegerField(default=0, verbose_name='余额'),
        ),
    ]
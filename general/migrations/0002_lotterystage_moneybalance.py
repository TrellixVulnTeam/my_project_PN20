# Generated by Django 3.1.2 on 2021-09-28 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('general', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='lotterystage',
            name='MoneyBalance',
            field=models.IntegerField(default=0, verbose_name='金钱差额'),
        ),
    ]

# Generated by Django 3.1.2 on 2021-09-16 02:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('general', '0010_auto_20210916_1018'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lotterystage',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
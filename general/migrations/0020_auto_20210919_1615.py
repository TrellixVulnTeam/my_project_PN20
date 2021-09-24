# Generated by Django 3.1.2 on 2021-09-19 08:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('general', '0019_auto_20210919_1229'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='killnumberrule',
            name='method',
        ),
        migrations.AddField(
            model_name='killnumberrule',
            name='format',
            field=models.CharField(default='', max_length=100, verbose_name='杀号格式'),
        ),
        migrations.AddField(
            model_name='killnumberrule',
            name='param',
            field=models.CharField(default='', max_length=100, verbose_name='杀号参数'),
        ),
        migrations.AlterField(
            model_name='killnumberrule',
            name='ascription',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, related_name='KillNumberRules', to='general.generalprogramme'),
        ),
    ]

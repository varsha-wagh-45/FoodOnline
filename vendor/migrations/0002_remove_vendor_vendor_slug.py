# Generated by Django 5.0.2 on 2024-02-28 04:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vendor', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vendor',
            name='vendor_slug',
        ),
    ]

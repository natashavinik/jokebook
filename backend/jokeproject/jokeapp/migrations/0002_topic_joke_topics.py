# Generated by Django 4.2.13 on 2024-06-25 21:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jokeapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.AddField(
            model_name='joke',
            name='topics',
            field=models.ManyToManyField(related_name='jokes', to='jokeapp.topic'),
        ),
    ]

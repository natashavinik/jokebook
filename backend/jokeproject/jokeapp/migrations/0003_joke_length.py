# Generated by Django 4.2.13 on 2024-07-02 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jokeapp', '0002_topic_joke_topics'),
    ]

    operations = [
        migrations.AddField(
            model_name='joke',
            name='length',
            field=models.PositiveIntegerField(help_text='Length in seconds', null=True),
        ),
    ]

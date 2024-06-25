from django.db import models

# Create your models here.

class Topic(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Joke(models.Model):
    title = models.CharField(max_length=200)
    text = models.TextField()
    topics = models.ManyToManyField(Topic, related_name='jokes')

    def __str__(self):
        return self.title

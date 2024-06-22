from django.db import models

class Joke(models.Model):
    title = models.CharField(max_length=200)
    text = models.TextField()
# Create your models here.

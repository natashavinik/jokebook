import graphene
from graphene_django import DjangoObjectType
from .models import Joke

class JokeType(DjangoObjectType):
    class Meta:
        model = Joke
        fields = ("id", "title", "text")
        
class CreateJokeMutation(graphene.Mutation):
    joke = graphene.Field(JokeType)

    class Arguments:
        title = graphene.String(required=True)
        text = graphene.String(required=True)

    def mutate(self, info, title, text):
        joke = Joke.objects.create(title=title, text=text)
        return CreateJokeMutation(joke=joke)
    
class Query(graphene.ObjectType):
    all_jokes = graphene.List(JokeType)

    def resolve_all_jokes(root, info):
        return Joke.objects.all()

class Mutation(graphene.ObjectType):
    create_joke = CreateJokeMutation.Field()
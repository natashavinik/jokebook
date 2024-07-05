import graphene
from graphene_django import DjangoObjectType
from .models import Joke, Topic

class TopicType(DjangoObjectType):
    class Meta:
        model = Topic
        fields = ("id", "name")

class JokeType(DjangoObjectType):
    class Meta:
        model = Joke
        fields = ("id", "title", "text", "topics", "length")
        
class CreateJokeMutation(graphene.Mutation):
    joke = graphene.Field(JokeType)

    class Arguments:
        title = graphene.String(required=True)
        text = graphene.String(required=True)
        length = graphene.Int()
        new_topics = graphene.List(graphene.String)
        existing_topic_ids = graphene.List(graphene.ID)

    def mutate(self, info, title, text, length, new_topics, existing_topic_ids):
        joke = Joke.objects.create(title=title, text=text, length=length)
        for topic_id in existing_topic_ids:
            topic = Topic.objects.get(id=topic_id)
            joke.topics.add(topic)
        for topic_name in new_topics:
            topic, created = Topic.objects.get_or_create(name=topic_name)
            joke.topics.add(topic)

        return CreateJokeMutation(joke=joke)

class UpdateJokeMutation(graphene.Mutation):
    joke = graphene.Field(JokeType)

    class Arguments:
        id = graphene.ID(required=True)
        text = graphene.String(required=True)
        length = graphene.Int()
        new_topics = graphene.List(graphene.String)
        existing_topic_ids = graphene.List(graphene.ID)
        topics_to_add = graphene.List(graphene.ID)
        topics_to_remove = graphene.List(graphene.ID)

    def mutate(self, info, id, text, length, new_topics, existing_topic_ids, topics_to_add, topics_to_remove):
        try:
            joke = Joke.objects.get(id=id)
            joke.text = text
            joke.length = length
            joke.save()

            # Add existing and other topics
            for topic_id in existing_topic_ids + topics_to_add:
                topic = Topic.objects.get(id=topic_id)
                joke.topics.add(topic)

            # Remove topics
            for topic_id in topics_to_remove:
                topic = Topic.objects.get(id=topic_id)
                joke.topics.remove(topic)
            
            #Add new topics
            for topic_name in new_topics:
                topic, created = Topic.objects.get_or_create(name=topic_name)
                joke.topics.add(topic)

            return UpdateJokeMutation(joke=joke)
        except Exception as e:
            print(f"A bad error occurred: {e}")
            raise e
    
class Query(graphene.ObjectType):
    all_jokes = graphene.List(JokeType)
    all_topics = graphene.List(TopicType)

    def resolve_all_jokes(root, info):
        return Joke.objects.all()
    def resolve_all_topics(root, info):
        return Topic.objects.all()

class Mutation(graphene.ObjectType):
    create_joke = CreateJokeMutation.Field()
    update_joke = UpdateJokeMutation.Field()
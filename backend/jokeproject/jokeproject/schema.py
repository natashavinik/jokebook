import graphene
import jokeapp.schema

class Query(jokeapp.schema.Query, graphene.ObjectType):
    pass

class Mutation(jokeapp.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
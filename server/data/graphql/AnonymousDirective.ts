import { SchemaDirectiveVisitor } from 'apollo-server'
import { GraphQLSchema } from 'graphql'

export class AnonymousDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    details.objectType._fields[field.name].allowAnonymous = true
  }
}

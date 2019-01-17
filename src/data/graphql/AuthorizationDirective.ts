import { SchemaDirectiveVisitor } from 'apollo-server'
import { defaultFieldResolver } from 'graphql';

export class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    this.ensureFieldsWrapped(type)
    type._requiredAuthRole = this.args.requires
  }

  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType)
    field._requiredAuthRole = this.args.requires
  }

  ensureFieldsWrapped (objectType) {
        // Mark the GraphQLObjectType object to avoid re-wrapping:
        if (objectType._authFieldsWrapped) {
          return
        }
        objectType._authFieldsWrapped = true;
    
        const fields = objectType.getFields();
    
        Object.keys(fields).forEach(fieldName => {
          const field = fields[fieldName];
          const resolve = field.resolver || defaultFieldResolver
           
          field.resolve = async function (...args) {
            // Get the required Role from the field first, falling back
            // to the objectType if no Role is required by the field:
            const requiredRole =
              field._requiredAuthRole ||
              objectType._requiredAuthRole;
    
            if (! requiredRole) {
              return resolve.apply(this, args); 
            }
    
            const context = args[2];
            const user = await getUser(context.headers.authToken);
            if (! user.hasRole(requiredRole)) {
              throw new Error("not authorized");
            }
     
            return resolve.apply(this, args);
          };
        });
      }
  }
}

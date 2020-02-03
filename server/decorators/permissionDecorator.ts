import { IQueryOptions } from '../../foundation/models/IQueryOptions'

export function hasPermission(permission: number) {
  /*tslint:disable only-arrow-functions*/
  return function(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...params) => any>) {
    // do i have the permission
    const originalFunction = descriptor.value
    descriptor.value = function(...params) {
      const serviceOptions: IQueryOptions = params[params.length - 1]
      if (!serviceOptions) {
        throw new Error(
          'Invalid method signature.  @hasPermission can only be applied to methods with IQueryOptions as last argument'
        )
      } else {
        if (
          !serviceOptions.userContext ||
          serviceOptions.userContext.permissions === undefined ||
          serviceOptions.userContext.permissions < permission
        ) {
          throw new Error('Not authorized')
        } else {
          return originalFunction!.apply(this, params)
        }
      }
    }
  }
}

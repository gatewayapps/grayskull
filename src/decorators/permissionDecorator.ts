import { Request, Response } from 'express'

export function hasPermission(permission: number) {
  /*tslint:disable only-arrow-functions*/
  return function(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(obj, args, context, info) => any>) {
    // do i have the permission
    const originalFunction = descriptor.value
    descriptor.value = function(obj, args, context, info) {
      if (!context.user || context.user.permissions < permission) {
        throw new Error('Not authorized')
      }
      return originalFunction!.apply(this, [obj, args, context, info])
    }
  }
}

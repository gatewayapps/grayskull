import { Request, Response } from 'express'

export function hasPermission(permissionName: string, modelName?: string, modelId?: any) {
  /*tslint:disable only-arrow-functions*/
  return function(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>) {
    // do i have the permission
    const originalFunction = descriptor.value
    descriptor.value = function(req: Request, res: Response) {
      return originalFunction!.apply(this, [req, res])
    }
  }
}

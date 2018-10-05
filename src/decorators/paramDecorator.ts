import { Request, Response } from 'express'

export function param(...paramNames: string[]) {
  /*tslint:disable only-arrow-functions*/
  return function(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>) {
    // do i have the permission
    const originalFunction = descriptor.value

    descriptor.value = function(req: Request, res: Response) {
      if (paramNames.every((p) => req.params[p])) {
        return originalFunction!.apply(this, [req, res])
      } else {
        res.status(400).send()
      }
    }
  }
}

export function paramMustEqual(paramName: string, value: string) {
  /*tslint:disable only-arrow-functions*/
  return function(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>) {
    // do i have the permission
    const originalFunction = descriptor.value

    descriptor.value = function(req: Request, res: Response) {
      if (req.params[paramName] === value) {
        return originalFunction!.apply(this, [req, res])
      } else {
        res.status(501).send()
      }
    }
  }
}

export function query(...paramNames: string[]) {
  /*tslint:disable only-arrow-functions*/
  return function(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>) {
    // do i have the permission
    const originalFunction = descriptor.value
    descriptor.value = function(req: Request, res: Response) {
      if (paramNames.every((p) => req.query[p])) {
        return originalFunction!.apply(this, [req, res])
      } else {
        res.status(400).send()
      }
    }
  }
}

export function queryMustEqual(paramName: string, value: string) {
  /*tslint:disable only-arrow-functions*/
  return function(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(req: Request, res: Response) => any>) {
    // do i have the permission
    const originalFunction = descriptor.value
    descriptor.value = function(req: Request, res: Response) {
      if (req.query[paramName] === value) {
        return originalFunction!.apply(this, [req, res])
      } else {
        res.status(501).send()
      }
    }
  }
}

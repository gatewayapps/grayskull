import { IClientRequestOptions } from '@data/IClientRequestOptions'
import TokenService from '@services/TokenService'
import { Request, Response } from 'express'
import { access } from 'fs-extra'

export function useScope(scope: string) {
  /*tslint:disable only-arrow-functions*/
  return function(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...params) => any>) {
    // do i have the permission
    const originalFunction = descriptor.value
    descriptor.value = async function(...params) {
      const req: Request = params[0]
      const res: Response = params[1]
      try {
        const auth = req.headers.authorization!
        const authParts = auth.split(' ')
        const accessToken = authParts[1]

        const requestOptions = await TokenService.validateAndDecodeAccessToken(accessToken)

        if (!requestOptions) {
          throw new Error('Invalid access token')
        } else {
          if (requestOptions.accessToken.scopes.includes(scope) === false) {
            res.status(403).send()
            return
          } else {
            params.splice(params.length - 1, 0, requestOptions)
            return originalFunction!.apply(this, params)
          }
        }
      } catch (err) {
        res.status(403).send()
        return
      }
    }
  }
}

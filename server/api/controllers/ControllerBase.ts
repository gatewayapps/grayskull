import { HttpMethod, getRoute } from '../../decorators/routeDecorator'
import { Application as ExpressApplication } from 'express'
import _ from 'lodash'

import { IController } from './IController'

export default abstract class ControllerBase implements IController {
  protected static knownRoutes: string[] = []
  protected next: any
  constructor(_next: any) {
    this.next = _next
  }

  public registerRoutes(server: ExpressApplication) {
    const proto = Object.getPrototypeOf(this)
    const members = Object.getOwnPropertyNames(proto)

    members.forEach((m) => {
      if (typeof proto[m] === 'function') {
        const routeInfo: { method: HttpMethod; endpoint: string } | undefined = getRoute(this, m)
        if (routeInfo) {
          const controllerName = this.constructor.name
          const controllerBaseName = controllerName.replace(/Controller$/, '')

          const routeKey = `${routeInfo.method.toString()}:${routeInfo.endpoint}`
          if (ControllerBase.knownRoutes.includes(routeKey)) {
            throw new Error(`Duplicate route detected: ${routeKey} at ${controllerName}.${m}`)
          } else {
            ControllerBase.knownRoutes.push(routeKey)
            server[routeInfo.method.toString()](routeInfo.endpoint, proto[m].bind(this))
          }
        }
      }
    })
  }
}

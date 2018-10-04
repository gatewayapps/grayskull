import { Application as ExpressApplication } from 'express'
import { Server } from 'next'
import { IController } from './IController'

export default abstract class ControllerBase implements IController {
  protected next: Server
  constructor(_next: Server) {
    this.next = _next
  }

  public abstract registerRoutes(server: ExpressApplication)
}

import { Server } from 'next'
export interface IController {
  registerRoutes(server: Express.Application)
}

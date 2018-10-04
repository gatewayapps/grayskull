import { Application as ExpressApplication } from 'express'
import ClientService from '../services/ClientService'

import ControllerBase from './ControllerBase'

export default class LoginController extends ControllerBase {
  public registerRoutes(server: ExpressApplication) {
    server.get('/login', this.renderLoginPage)

    server.post('/login', this.handleLoginAttempt)
  }

  private async handleLoginAttempt(req, res) {
    // future code
  }

  private async renderLoginPage(req, res) {
    if (req.query.clientId) {
      res.locals.client = await ClientService.getClientByclientId(parseInt(req.query.clientId, 10))
      return this.next.render(req, res, '/login', req.query)
    } else {
      res.statusCode = 404
      res.send()
    }
  }
}

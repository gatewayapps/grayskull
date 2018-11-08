import ConfigurationManager from '@/config/ConfigurationManager'
import { query } from '@decorators/paramDecorator'
import { HttpMethod, route } from '@decorators/routeDecorator'
import AuthenticationService from '@services/AuthenticationService'
import ClientService from '@services/ClientService'
import UserAccountService from '@services/UserAccountService'
import ControllerBase from './ControllerBase'

import { Request, Response } from 'express'

export default class UserController extends ControllerBase {
  @route(HttpMethod.POST, '/user/invite')
  public async inviteUser(req: Request, res: Response) {
    try {
      const client = await ClientService.validateClient(req.body.client_id, req.body.client_secret)
      if (!client) {
        res.status(400).send({ success: false, message: 'Unable to verify client. Check your client_id and client_secret.' })
        return
      }
      await UserAccountService.inviteUser(req.body.emailAddress, client, req.body.invitedBy, req.baseUrl)
      res.send({ success: true })
    } catch (err) {
      res.status(400).send({ success: false, message: err.message })
    }
  }

  @route(HttpMethod.GET, '/register')
  @query('cpt')
  public async getRegisterPage(req: Request, res: Response) {
    return this.renderRegisterPage(req, res)
  }

  @route(HttpMethod.POST, '/register')
  @query('cpt')
  public async registerUser(req: Request, res: Response) {
    if (!UserAccountService.validateCPT(req.query.cpt)) {
      res.status(400).send()
    } else {
      try {
        await AuthenticationService.validatePassword(req.body.password, req.body.confirm)
        const { client } = await UserAccountService.registerUser(req.body, req.body.password, req.query.cpt)
        return res.redirect(`/auth?client_id=${client!.client_id}&response_type=code&redirect_uri=${escape(client!.redirectUri)}`)
      } catch (err) {
        res.locals.error = { message: err.message }
        return this.renderRegisterPage(req, res)
      }
    }
  }

  private async renderRegisterPage(req: Request, res: Response) {
    if (!UserAccountService.validateCPT(req.query.cpt)) {
      res.status(400).send()
    } else {
      // Decode the change password token, and set it's properties to res.locals
      res.locals = await UserAccountService.processCPT(req.query.cpt, false)
      if (!res.locals.client) {
        res.status(400).send()
      } else {
        return this.next.render(req, res, '/register', req.query)
      }
    }
  }
}

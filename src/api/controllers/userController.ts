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
      const newUserAccount = await UserAccountService.inviteUser(req.body.emailAddress, client, req.body.invitedBy, req.baseUrl)
      res.send({ success: true, userAccountId: newUserAccount.userAccountId })
    } catch (err) {
      res.status(400).send({ success: false, message: err.message })
    }
  }

  @route(HttpMethod.GET, '/register')
  @query('cpt')
  public async getRegisterPage(req: Request, res: Response) {
    if (!UserAccountService.validateCPT(req.query.cpt)) {
      res.status(400).send()
    } else {
      // Decode the change password token, and set it's properties to res.locals
      const oldLocals = res.locals
      res.locals = await UserAccountService.processCPT(req.query.cpt, false)
      res.locals = { ...oldLocals, ...res.locals }
      if (!res.locals.client) {
        res.status(400).send()
      } else {
        return this.next.render(req, res, '/register', req.query)
      }
    }
  }
}

import ClientService from '@services/ClientService'

import { HttpMethod, route } from '@decorators/routeDecorator'
import UserAccountService from '@services/UserAccountService'
import ControllerBase from './ControllerBase'

import { query } from '@decorators/paramDecorator'
import AuthenticationService from '@services/AuthenticationService'

import { Request, Response } from 'express'

export default class UserController extends ControllerBase {
  @route(HttpMethod.GET, '/register')
  @query('cpt')
  public async getRegisterPage(req: Request, res: Response) {
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

  @route(HttpMethod.POST, '/register')
  @query('cpt')
  public async registerUser(req: Request, res: Response) {
    if (!UserAccountService.validateCPT(req.query.cpt)) {
      res.status(400).send()
    } else {
      try {
        const isPasswordValid = await AuthenticationService.validatePassword(req.body.password, req.body.confirm)

        const user = await UserAccountService.createUserAccountWithPassword(req.body, req.body.password)
        res.json(user)
      } catch (err) {
        res.locals = await UserAccountService.processCPT(req.query.cpt)
        res.locals.error = { message: err.message }
        return this.next.render(req, res, '/register', req.query)
      }
    }
  }
}

import { query, queryMustEqual } from '@decorators/paramDecorator'
import { HttpMethod, route } from '@decorators/routeDecorator'
import AuthenticationService from '@services/AuthenticationService'
import ClientService from '@services/ClientService'
import UserAccountService from '@services/UserAccountService'
import { Request, Response } from 'express'
import ControllerBase from './ControllerBase'

export default class LoginController extends ControllerBase {
  @route(HttpMethod.POST, '/access_token')
  public async postAccessToken(req: Request, res: Response) {
    try {
      if (!req.body || !req.body.grant_type || !req.body.client_id || !req.body.client_secret) {
        res.status(400).json({ success: false, message: 'Invalid request body' })
        return
      }

      const accessTokenRespnse = await AuthenticationService.getAccessToken(req.body.grant_type, req.body.client_id, req.body.client_secret, req.body.code, req.body.refresh_token)
      res.json(accessTokenRespnse)
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  }

  @route(HttpMethod.GET, '/auth')
  @query('client_id', 'response_type', 'redirect_uri')
  @queryMustEqual('response_type', 'code')
  public async renderLoginPage(req: Request, res: Response) {
    if ((await this.validateLoginRequest(req)) === false) {
      res.status(400).send()
      return
    } else {
      // res.locals.client = await ClientService.getClientByclient_id(parseInt(req.query.client_id, 10))
      return this.next.render(req, res, '/login', req.query)
    }
  }

  @route(HttpMethod.GET, '/resetPassword')
  public async renderResetPassword(req: Request, res: Response) {
    if (req.query.cpt) {
      const decodedToken = await UserAccountService.decodeCPT(req.query.cpt)
      if (decodedToken) {
        res.locals.emailAddress = decodedToken.emailAddress
        return this.next.render(req, res, '/resetPassword/changePassword', req.query)
      }
    }

    return this.next.render(req, res, '/resetPassword', req.query)
  }

  @route(HttpMethod.POST, '/resetPassword')
  public async processResetPasswordRequest(req: Request, res: Response) {
    if (req.query.cpt) {
      const decodedToken = await UserAccountService.decodeCPT(req.query.cpt)
      if (decodedToken) {
        try {
          const validPassword = await AuthenticationService.validatePassword(req.body.password, req.body.confirm)
          if (validPassword) {
            await UserAccountService.changeUserPassword(decodedToken.emailAddress, req.body.password)

            // Processing a CPT removes it from cache and marks it invalid
            // This should prevent someone using old reset password tokens
            await UserAccountService.processCPT(req.query.cpt)

            res.locals.message = `You have succesfully changed your password.  Please sign in using your new login`
            return this.next.render(req, res, '/resetPassword/changePassword', req.query)
          }
        } catch (err) {
          res.locals.error = { message: err.message }
        }
      } else {
        res.locals.error = { message: 'Invalid reset password token' }
      }
      return this.next.render(req, res, '/resetPassword/changePassword', req.query)
    } else {
      const userAccount = await UserAccountService.getUserAccountByemailAddress(req.body.emailAddress)
      if (userAccount) {
        await UserAccountService.sendResetPasswordMessage(req.body.emailAddress, req.baseUrl)
      }
      res.locals = { message: `We have sent instructions on resetting your password to ${req.body.emailAddress}.` }
    }
    return this.next.render(req, res, '/resetPassword', req.query)
  }

  @route(HttpMethod.POST, '/auth')
  @query('client_id', 'response_type', 'redirect_uri')
  @queryMustEqual('response_type', 'code')
  public async processLoginRequest(req: Request, res: Response) {
    if ((await this.validateLoginRequest(req)) === false) {
      res.status(400).send()
      return
    } else if (!req.body.sessionId) {
      console.log('Received auth post without a sessionId')
    } else {
      const authorizationCode = await AuthenticationService.authenticateUser(req.body.emailAddress, req.body.password, req.body.sessionId)
      if (authorizationCode) {
        const queryParts = [`code=${authorizationCode}`]
        if (req.query.state) {
          queryParts.push(`state=${req.query.state}`)
        }
        const queryString = queryParts.join('&')
        return res.redirect(`${req.query.redirect_uri}?${queryString}`)
      }
    }

    res.locals.error = { message: 'Invalid email address/password combination' }
    return this.renderLoginPage(req, res)
  }

  private async validateLoginRequest(req: Request): Promise<boolean> {
    const validated = await AuthenticationService.validateRedirectUri(parseInt(req.query.client_id, 10), req.query.redirect_uri)
    return validated
  }
}

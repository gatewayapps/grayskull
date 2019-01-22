import ConfigurationManager from '@/config/ConfigurationManager'
import { query, queryMustEqual } from '@decorators/paramDecorator'
import { HttpMethod, route } from '@decorators/routeDecorator'
import AuthenticationService from '@services/AuthenticationService'
import UserAccountService from '@services/UserAccountService'
import { Request, Response } from 'express'
import ControllerBase from './ControllerBase'
import { setAuthCookies, decodeState, clearAuthCookies, getAuthCookies } from '@/utils/authentication'
import SessionService from '@services/SessionService'
import '../../middleware/authentication'

export default class LoginController extends ControllerBase {
  @route(HttpMethod.POST, '/access_token')
  public async postAccessToken(req: Request, res: Response) {
    try {
      if (!req.body || !req.body.grant_type || !req.body.client_id || !req.body.client_secret) {
        res.status(400).json({ success: false, message: 'Invalid request body' })
        return
      }

      const accessTokenRespnse = await AuthenticationService.getAccessToken(
        req.body.grant_type,
        req.body.client_id,
        req.body.client_secret,
        req.body.code,
        req.body.refresh_token,
        { userContext: req.user || null }
      )
      res.json(accessTokenRespnse)
    } catch (err) {
      res.status(400).json({ success: false, message: err.message })
    }
  }

  @route(HttpMethod.GET, '/authorize')
  @query('client_id', 'response_type', 'redirect_uri')
  @queryMustEqual('response_type', 'code')
  public async renderLoginPage(req: Request, res: Response) {
    if ((await this.validateLoginRequest(req)) === false) {
      res.status(400).send()
      return
    } else {
      return this.next.render(req, res, '/authorize', req.query)
    }
  }

  @route(HttpMethod.GET, '/logout')
  public async logout(req: Request, res: Response) {
    const { sessionId } = getAuthCookies(req)
    if (sessionId) {
      await SessionService.deleteSession({ sessionId }, { userContext: req.user || null })
    }
    clearAuthCookies(res)
    const redirectUrl = `/login${req.query.state ? `?state=${encodeURIComponent(req.query.state)}` : ''}`
    res.redirect(redirectUrl)
  }

  @route(HttpMethod.GET, '/resetPassword')
  public async renderResetPassword(req: Request, res: Response) {
    if (req.query.cpt) {
      const decodedToken = await UserAccountService.decodeCPT(req.query.cpt, { userContext: req.user || null })
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
      const decodedToken = await UserAccountService.decodeCPT(req.query.cpt, { userContext: req.user || null })
      if (decodedToken) {
        try {
          const validPassword = await AuthenticationService.validatePassword(req.body.password, req.body.confirm, { userContext: req.user || null })
          if (validPassword) {
            await UserAccountService.changeUserPassword(decodedToken.emailAddress, req.body.password, { userContext: req.user || null })

            // Processing a CPT removes it from cache and marks it invalid
            // This should prevent someone using old reset password tokens
            await UserAccountService.processCPT(req.query.cpt, false, { userContext: req.user || null })

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
      const userAccount = await UserAccountService.getUserAccountByEmailAddress(req.body.emailAddress, { userContext: req.user || null })
      if (userAccount) {
        await UserAccountService.sendResetPasswordMessage(req.body.emailAddress, req.baseUrl, { userContext: req.user || null })
      }
      res.locals = { message: `We have sent instructions on resetting your password to ${req.body.emailAddress}.` }
    }
    return this.next.render(req, res, '/resetPassword', req.query)
  }

  @route(HttpMethod.GET, '/signin')
  @query('code')
  public async getSignin(req: Request, res: Response) {
    try {
      // 1. Get accessToken via AuthenticationService
      const accessToken = await AuthenticationService.getAccessToken('authorization_code', 'grayskull', ConfigurationManager.Security!.globalSecret, req.query.code, null, {
        userContext: req.user || null
      })

      if (!accessToken) {
        throw new Error('Unable to create access token')
      }

      // 2. Redirect to returnUrl or home page
      const state = decodeState(req.query.state)
      const returnPath = state && state.returnPath ? state.returnPath : '/home'
      res.redirect(returnPath)
    } catch (err) {
      console.error(err)
      res.locals.error = { message: err.message }
      return this.renderLoginPage(req, res)
    }
  }

  private async validateLoginRequest(req: Request): Promise<boolean> {
    const validated = await AuthenticationService.validateRedirectUri(req.query.client_id, req.query.redirect_uri, { userContext: req.user || null })
    return validated
  }
}

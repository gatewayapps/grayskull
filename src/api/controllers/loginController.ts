import ClientService from '@services/ClientService'

import { hasPermission } from '@decorators/permissionDecorator'
import { HttpMethod, route } from '@decorators/routeDecorator'
import ControllerBase from './ControllerBase'

export default class LoginController extends ControllerBase {
  @route(HttpMethod.GET, '/login')
  @hasPermission('test-permission')
  public async renderLoginPage(req, res) {
    if (req.query.clientId) {
      res.locals.client = await ClientService.getClientByclientId(parseInt(req.query.clientId, 10))
      return this.next.render(req, res, '/login', req.query)
    } else {
      res.statusCode = 404
      res.send()
    }
  }
}

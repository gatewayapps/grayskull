import ClientService from '@services/ClientService'

import { hasPermission } from '@decorators/permissionDecorator'
import { HttpMethod, route } from '@decorators/routeDecorator'
import ControllerBase from './ControllerBase'

export default class UserController extends ControllerBase {}

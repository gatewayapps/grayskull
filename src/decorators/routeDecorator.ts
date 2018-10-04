import 'reflect-metadata'
export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  HEAD = 'head',
  OPTIONS = 'options',
  PATCH = 'patch'
}

export const ROUTE_METADATA_KEY = Symbol('route')
export function route(method: HttpMethod, endpoint: string) {
  if (/^\//.test(endpoint)) {
    return Reflect.metadata(ROUTE_METADATA_KEY, { method, endpoint })
  } else {
    throw new Error(`Invalid route: ${method.toString()}:${endpoint}.  Routes must begin with a /`)
  }
}

export function getRoute(target: any, propertyKey: string) {
  return Reflect.getMetadata(ROUTE_METADATA_KEY, target, propertyKey)
}

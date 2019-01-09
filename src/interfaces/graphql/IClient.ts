export interface IClientMeta {
  count: number
}

export interface IClientFilter {
  or?: [IClientFilter]
  and?: [IClientFilter]
  client_id_in?: [string]
  client_id_equals?: string
  client_id_notEquals?: string
  name_contains?: string
  name_startsWith?: string
  name_endsWith?: string
  name_equals?: string
  name_notEquals?: string
  logoImageUrl_contains?: string
  logoImageUrl_startsWith?: string
  logoImageUrl_endsWith?: string
  logoImageUrl_equals?: string
  logoImageUrl_notEquals?: string
  description_contains?: string
  description_startsWith?: string
  description_endsWith?: string
  description_equals?: string
  description_notEquals?: string
  baseUrl_contains?: string
  baseUrl_startsWith?: string
  baseUrl_endsWith?: string
  baseUrl_equals?: string
  baseUrl_notEquals?: string
  homePageUrl_contains?: string
  homePageUrl_startsWith?: string
  homePageUrl_endsWith?: string
  homePageUrl_equals?: string
  homePageUrl_notEquals?: string
  public_equals?: boolean
  public_notEquals?: boolean
  redirectUri_contains?: string
  redirectUri_startsWith?: string
  redirectUri_endsWith?: string
  redirectUri_equals?: string
  redirectUri_notEquals?: string
  isActive_equals?: boolean
  isActive_notEquals?: boolean
  createdBy_lessThan?: number
  createdBy_greaterThan?: number
  createdBy_equals?: number
  createdBy_notEquals?: number
  createdAt_lessThan?: Date
  createdAt_greaterThan?: Date
  createdAt_equals?: Date
  createdAt_notEquals?: Date
  modifiedBy_lessThan?: number
  modifiedBy_greaterThan?: number
  modifiedBy_equals?: number
  modifiedBy_notEquals?: number
  modifiedAt_lessThan?: Date
  modifiedAt_greaterThan?: Date
  modifiedAt_equals?: Date
  modifiedAt_notEquals?: Date
}

export interface IClientUniqueFilter {
  client_id?: string
}

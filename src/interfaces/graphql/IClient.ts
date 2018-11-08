export interface IClientMeta {
  count: number
}

export interface IClientFilter {
  or?: [IClientFilter]
  and?: [IClientFilter]
  client_id_lessThan?: number
  client_id_greaterThan?: number
  client_id_equals?: number
  client_id_notEquals?: number
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
  url_contains?: string
  url_startsWith?: string
  url_endsWith?: string
  url_equals?: string
  url_notEquals?: string
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
  client_id?: number
}

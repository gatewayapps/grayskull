export interface IClientMeta {
  count: number
}

export interface IClientFilter {
  or?: [IClientFilter]
  and?: [IClientFilter]
  client_id_contains?: string
  client_id_startsWith?: string
  client_id_endsWith?: string
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
  redirectUris_contains?: string
  redirectUris_startsWith?: string
  redirectUris_endsWith?: string
  redirectUris_equals?: string
  redirectUris_notEquals?: string
  scopes_contains?: string
  scopes_startsWith?: string
  scopes_endsWith?: string
  scopes_equals?: string
  scopes_notEquals?: string
  public_equals?: boolean
  public_notEquals?: boolean
  isActive_equals?: boolean
  isActive_notEquals?: boolean
  createdBy_in?: [ string ]
  createdBy_equals?: string
  createdBy_notEquals?: string
  createdAt_lessThan?: Date
  createdAt_greaterThan?: Date
  createdAt_equals?: Date
  createdAt_notEquals?: Date
  updatedBy_in?: [ string ]
  updatedBy_equals?: string
  updatedBy_notEquals?: string
  updatedAt_lessThan?: Date
  updatedAt_greaterThan?: Date
  updatedAt_equals?: Date
  updatedAt_notEquals?: Date
  deletedBy_in?: [ string ]
  deletedBy_equals?: string
  deletedBy_notEquals?: string
  deletedAt_lessThan?: Date
  deletedAt_greaterThan?: Date
  deletedAt_equals?: Date
  deletedAt_notEquals?: Date
}

export interface IClientUniqueFilter {
  client_id?: string
  }

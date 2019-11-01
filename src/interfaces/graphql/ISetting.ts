export interface ISettingMeta {
  count: number
}

export interface ISettingFilter {
  or?: [ISettingFilter]
  and?: [ISettingFilter]
  key_contains?: string
  key_startsWith?: string
  key_endsWith?: string
  key_equals?: string
  key_notEquals?: string
  value_contains?: string
  value_startsWith?: string
  value_endsWith?: string
  value_equals?: string
  value_notEquals?: string
  type_contains?: string
  type_startsWith?: string
  type_endsWith?: string
  type_equals?: string
  type_notEquals?: string
}

export interface ISettingUniqueFilter {
  key?: string
}

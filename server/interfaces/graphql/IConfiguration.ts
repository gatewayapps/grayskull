export interface IConfigurationMeta {
  count: number
}

export interface IConfigurationFilter {
  or?: [IConfigurationFilter]
  and?: [IConfigurationFilter]
}

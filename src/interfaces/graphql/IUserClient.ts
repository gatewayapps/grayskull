export interface IUserClientMeta {
  count: number
}

export interface IUserClientFilter {
  or?: [IUserClientFilter]
  and?: [IUserClientFilter]
}

export interface IUserClientUniqueFilter {
  userAccountId?: number
  client_id?: number
}

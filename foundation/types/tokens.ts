export interface IAccessTokenResponse {
  token_type: 'Bearer'
  id_token?: string
  expires_in: number
  access_token?: string
  refresh_token?: string
  session_id?: string
}
export type GrantType = 'authorization_code' | 'refresh_token'

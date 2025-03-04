import { AxiosRequestConfig } from 'axios'

import { BASIC_AUTH, API_INFO_AUTH } from '@/config/config'
import { AbstractApiAxios } from '@/utils/apiAxios'
import { ResultData, Token } from '@/api/auth/model'

class authAxios extends AbstractApiAxios<any> {
  constructor() {
    super({
      baseURL: API_INFO_AUTH.PREFIX,
    })
  }
}

export const authAxiosInstance = new authAxios()
const http = authAxiosInstance

const config: AxiosRequestConfig = {
  auth: BASIC_AUTH,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
}

export function login(req: Token.Req) {
  return token(req)
}

export function refreshToken(ref: Token.Ref) {
  return token(ref)
}

export function getRsaPublicKey() {
  return http.get<ResultData<string>>('/rsa/key', config)
}

export function checkToken(token: string) {
  // return http.post<ResultData<Token.Check>>('/oauth/check_token', { token }, config)
  return http.post<ResultData<Token.Check>>('/oauth2/introspect', { token }, config)
}

export function token(data: Token.Req | Token.Ref) {
  // return http.post<ResultData<Token.Res>>('/oauth/token', data, config)
  return http.post<ResultData<Token.Res>>('/oauth2/token', data, config)
}

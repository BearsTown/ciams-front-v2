import { AxiosRequestConfig } from 'axios'

import User from '@/api/app/user/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/user'

export function register(user: User.Add) {
  return http.post<ResultData<object>>(`/cmm/signUp`, user)
}

export function changePassword(user: User.PwdChange) {
  return http.put<ResultData<object>>(`${prefix}/${user.loginId}`, user)
}

export const getUsers = (params: User.Find) => {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<User.Users>>(`${prefix}/list`, config)
}

export const getUser = (loginId) => {
  return http.get<ResultData<User.User>>(`${prefix}/${loginId}`)
}

export const getSessionUser = () => {
  return http.get<ResultData<User.User>>(`${prefix}/info/session`)
}

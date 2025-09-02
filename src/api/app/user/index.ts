import User from '@/api/app/user/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/user'

export function register(user: User.Add) {
  return http.post<ResultData<object>>(`${prefix}/signUp`, user)
}

export function changePassword(user: User.PwdChange) {
  return http.put<ResultData<object>>(`${prefix}/${user.loginId}`, user)
}

export const getSessionUser = () => {
  return http.get<ResultData<User.User>>(`${prefix}/info/session`)
}

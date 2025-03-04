import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/user'

export default {
  getList(params: {
    keyword?: string
    roleYn?: 'Y' | 'N'
    lock?: boolean
    size?: number
    pageNo?: number
    page?: boolean
  }) {
    const config = {
      params,
    }
    return http.get<ResultData<any>>(`${prefix}/list`, config)
  },

  initPassword(loginId: string) {
    return http.put<ResultData<any>>(`${prefix}/${loginId}/initPass`)
  },

  updateLock(params: object) {
    return http.put<ResultData<any>>(`${prefix}/lock`, params)
  },

  updateApprove(params: object) {
    return http.put<ResultData<any>>(`${prefix}/approve`, params)
  },

  modifyUser(user: any) {
    return http.put<ResultData<any>>(`${prefix}/${user.loginId}`, user)
  },

  deleteUser(userList: object) {
    return http.delete<ResultData<any>>(`${prefix}?userList=${userList}`)
  },
}

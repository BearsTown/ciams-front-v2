import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { AxiosRequestConfig } from 'axios'

const prefix = '/api/v1/access'

export default {
  getList(
    type: 'user' | 'role',
    params: {
      userId?: string
      roleCode?: string
      menuCode?: string
    },
  ) {
    const config: AxiosRequestConfig = {
      params,
    }
    return http.get<ResultData<any>>(`${prefix}/${type}`, config)
  },

  add(
    type: 'user' | 'role',
    params: {
      roles?: []
      menus?: []
      userId?: string
      roleCode?: string
    },
  ) {
    return http.post<ResultData<object>>(`${prefix}/${type}`, params)
  },

  delete(
    type: 'user' | 'role',
    params: {
      roles?: []
      menus?: []
      userId?: string
      roleCode?: string
    },
  ) {
    return http.put<ResultData<object>>(`${prefix}/${type}`, params)
  },
}

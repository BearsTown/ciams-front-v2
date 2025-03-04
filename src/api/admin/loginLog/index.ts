import { AxiosRequestConfig } from 'axios'

import LoginLog from '@/api/admin/loginLog/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/log'

export function getList(params: LoginLog.Param) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<LoginLog.Result>>(`${prefix}/list`, config)
}

import { AxiosRequestConfig } from 'axios'
import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'

const prefix = '/api/v1/menu-1/sub-1'

export async function getHighTech(params: object) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.post<ResultData<object>>(`${prefix}/tech`, params)
}

export async function getTechLQ(params: object) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.post<ResultData<object>>(`${prefix}/tech/lq`, params)
}

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { AxiosRequestConfig } from 'axios'

const prefix = '/api/v1/access'

export function getMenu() {
  return http.get<ResultData<any>>(`${prefix}/menu/check`)
}

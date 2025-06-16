import { AxiosRequestConfig } from 'axios'

import { Plan } from '@/api/app/menu-1/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/menu-1'

export function getDataGroups(parentId: number) {
  return http.get<ResultData<any[]>>(`${prefix}/group/${parentId}`)
}

export function getDataConfig(dataGroupId: number) {
  return http.get<ResultData<object>>(`${prefix}/config/${dataGroupId}`)
}

export function getOverView(params: Plan.Overview.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<Plan.Overview.Find.Result>>(`${prefix}/step-c/overview`, config)
}

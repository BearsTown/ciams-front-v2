import qs from 'qs'
import { AxiosRequestConfig } from 'axios'

import { Plan } from '@/api/app/menu-1/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/menu-1/step-c'

export function getPlanArea(params: Plan.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<Plan.Search.Result>>(`${prefix}/area/list`, config)
}

export function getOverView(params: Plan.Overview.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<Plan.Overview.Find.Result>>(`${prefix}/overview`, config)
}

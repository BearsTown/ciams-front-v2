import qs from 'qs'
import { AxiosRequestConfig } from 'axios'

import { PlanZone } from '@/api/app/planZone/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/plan/zone'

export function getGisCiamsPlanZoneList(params: PlanZone.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<PlanZone.Search.Result>>(`${prefix}/list`, config)
}

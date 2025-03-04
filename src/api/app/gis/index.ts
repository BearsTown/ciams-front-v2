import { AxiosRequestConfig } from 'axios'

import qs from 'qs'
import { ciamsAxiosInstance as http } from '@/api/app'
import Gis, { CiamsPlan, ciamsF107 } from '@/api/app/gis/model'
import { ResultData } from '@/api/app/model'

const prefix = '/api/v1/plan'

/**
 * 용도지역 그룹
 * @param params
 * @returns
 */
export function getUseGroup(params: Gis.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<Gis.Find.Result>>(`${prefix}/use/getGroup`, config)
}

/**
 * 성장관리계획 운영
 * @param params
 * @returns
 */
export function updatePlan(params: CiamsPlan) {
  return http.put<ResultData<object>>(`${prefix}/gis`, params)
}

export function getF107(params: { planId: string; emdCds: string[] }) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<ciamsF107>>(`${prefix}/intersects/f107`, config)
}

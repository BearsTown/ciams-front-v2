import qs from 'qs'
import { AxiosRequestConfig } from 'axios'

import { CiamsPlanArea, CiamsPlanAreaLink, Incentive, Plan } from '@/api/app/plan/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/plan'

export function getLayers(params: CiamsPlanArea) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<CiamsPlanArea[]>>(`${prefix}/layer/get`, config)
}

export function getLimitLayers(params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<any[]>>(`${prefix}/layer/limit/get`, config)
}

export function getCdnmLimitLayer(params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<any[]>>(`${prefix}/layer/limitCdnm/get`, config)
}

export function getPlanArea(params: Plan.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<Plan.Search.Result>>(`${prefix}/area/list`, config)
}

export function getPlanAreaLink(planAreaId: string) {
  return http.get<ResultData<CiamsPlanAreaLink[]>>(`${prefix}/${planAreaId}/areaLink`)
}

/*export function selectById(planAreaId: string) {
  return http.get<ResultData<Plan.Details.Result>>(`${prefix}/${planAreaId}/area`)
// }*/
//
// export function selectById(params: Plan.Search.Detail) {
//   return http.get<ResultData<Plan.Details.Result>>(
//     `${prefix}/area/get/${params.planId}/${params.planAreaId}`,
//   )
// }

export function getSummary(planId: string) {
  return http.get<ResultData<Plan.AllSummary[]>>(`${prefix}/summary/${planId}/get`)
}

export function getMasterSummary(planId: string) {
  return http.get<ResultData<Plan.MasterSummary[]>>(`${prefix}/mastersummary/${planId}/get`)
}

export function getIncenPlan(params: Incentive.Find.Info) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<Incentive.AreaTypeItems>>(`${prefix}/incen/get`, config)
}

export function getPlanAreaIncenIncrease() {
  return http.get<ResultData<Incentive.AreaIncenIncrease[]>>(`${prefix}/increase/list`)
}

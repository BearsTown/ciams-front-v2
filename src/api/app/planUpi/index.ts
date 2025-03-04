import PlanUpi from '@/api/app/planUpi/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { AxiosRequestConfig } from 'axios/index'
import qs from 'qs'

const prefix = '/api/v1/plan/upi'

export function getUpis(params: object) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<PlanUpi.CiamsPlanUpi[]>>(`${prefix}/get`, config)
}

export function getUpiInfo(no: string) {
  return http.get<ResultData<PlanUpi.CiamsPlanUpi>>(`${prefix}/${no}/info`)
}

export function getIncenCalcInfo(params: PlanUpi.IncenCalc.Find.Info) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<PlanUpi.IncenCalc.IncenInfo>>(`${prefix}/getIncenCalcInfo`, config)
}

// export function addFiles(params: PlanUpi.IncentiveFile.Insert) {
//   const config: AxiosRequestConfig = {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   }
//   return http.post<ResultData<any>>(`${prefix}/incen/file/add`, params, config)
// }

/**
 * 모니터링 - 인센티브 현황 그룹핑
 */
export function selectGroupByNo() {
  return http.get<ResultData<string>>(`${prefix}/incen/groupNo`)
}

/**
 *
 */

export function insertIncenCalc(params: PlanUpi.IncenRecord.Insert) {
  return http.post<ResultData<string>>(`${prefix}/record/insert`, params)
}

// export function updateIncenStateExamine(recordId: string) {
//   return http.get<ResultData<number>>(`${prefix}/record/${recordId}/state/examine`)
// }
//
// export function updateIncenStateFinaliz(recordId: string) {
//   return http.get<ResultData<number>>(`${prefix}/record/${recordId}/state/finaliz`)
// }
//
// export function deleteIncenRecord(recordId: string) {
//   return http.delete<ResultData<number>>(`${prefix}/record/${recordId}/delete`)
// }
//
// export function getPlanIncenRecord(params: PlanUpi.IncenRecord.Search.Params) {
//   const config: AxiosRequestConfig = {
//     params,
//   }
//   return http.get<ResultData<PlanUpi.IncenRecord.Search.Result>>(`${prefix}/record/list`, config)
// }

/**
 *
 */

export function getPurpose(params: {
  planId: string
  startYear: number
  endYear: number
  purpose?: string[]
}) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<PlanUpi.Summary.Purpose[]>>(
    `${prefix}/${params.planId}/getPurpose`,
    config,
  )
}

export function getSummaryYear(params: {
  planId: string
  startYear: number
  endYear: number
  purpose?: string[]
}) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<PlanUpi.Summary.Year[]>>(
    `${prefix}/${params.planId}/getSummaryYear`,
    config,
  )
}

export function getSummaryYearPurpose(planId: string) {
  return http.get<ResultData<PlanUpi.Summary.YearPurpose[]>>(
    `${prefix}/${planId}/getSummaryYearPurpose`,
  )
}

export function getSummaryUseArea(params: {
  planId: string
  startYear: number
  endYear: number
  purpose?: string[]
}) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<PlanUpi.Summary.UseArea[]>>(
    `${prefix}/${params.planId}/getSummaryUseArea`,
    config,
  )
}

export function getJimok(planId: string) {
  return http.get<ResultData<PlanUpi.Summary.Jimok[]>>(`${prefix}/${planId}/getJimok`)
}

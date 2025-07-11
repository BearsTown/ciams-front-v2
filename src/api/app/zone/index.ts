import qs from 'qs'
import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

import { CiamsZoneDTO } from '@/api/app/zone/model'

const prefix = '/api/v1/zone'

export { getCiamsZoneList, getCiamsZoneOverView }

function getCiamsZoneList(params: CiamsZoneDTO.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<CiamsZoneDTO.Search.Result>>(`${prefix}/list`, config)
}

function getCiamsZoneOverView(params: CiamsZoneDTO.Overview.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<CiamsZoneDTO.Overview.Find.Result>>(`${prefix}/overview`, config)
}

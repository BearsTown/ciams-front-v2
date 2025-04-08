import qs from 'qs'
import { AxiosRequestConfig } from 'axios'

import { GisCiamsZoneDTO } from '@/api/app/gis/zone/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/zone'

export function getCiamsZoneList(params: GisCiamsZoneDTO.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<GisCiamsZoneDTO.Search.Result>>(`${prefix}/list`, config)
}

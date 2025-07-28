import qs from 'qs'
import { AxiosRequestConfig } from 'axios'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'

const prefix = '/api/v1/dist'

export function getCiamsDistList(params: GisCiamsDistDTO.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'comma' })
    },
  }
  return http.get<ResultData<GisCiamsDistDTO.Search.Result>>(`${prefix}/list`, config)
}

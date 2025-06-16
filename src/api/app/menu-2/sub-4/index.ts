import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { CiamsMenu2Sub4DetailsDto, Info } from '@/api/app/menu-2/sub-4/model'

const prefix = '/api/v1/menu-2/sub-4'

export function getMenu2Sub4OverView(params: CiamsMenu2Sub4DetailsDto.Overview.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<CiamsMenu2Sub4DetailsDto.Overview.Find.Result>>(
    `${prefix}/overview`,
    config,
  )
}

export function getMenu2Sub4Info(zoneNo: string) {
  return http.get<ResultData<Info>>(`${prefix}/info/${zoneNo}`)
}

export function getImage(id: number) {
  const config: AxiosRequestConfig = {
    responseType: 'blob',
  }
  return http.get<ResultData<BlobPart>>(`${prefix}/image/${id}`, config)
}

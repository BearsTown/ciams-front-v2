import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'

import Kgeo from '@/models/api/app/kgeo'
// import Kgeo from '@/models/api/app/kgeo/build'

const prefix = '/api/v1/openapi/kgeo/'

export async function getKgeoServiceData(service: string, params: object) {
  return http.post<ResultData<Kgeo.Response>>(`${prefix}/${service}`, params)
}

export async function getKgeoLandData(pnu: string) {
  return http.get<ResultData<Kgeo.LandInfo>>(`${prefix}/${pnu}`, {})
}

export async function getKgeoBuildInfo(pnu: string) {
  return http.get<ResultData<Kgeo.BuildInfo[]>>(`${prefix}/build/list/${pnu}`, {})
}


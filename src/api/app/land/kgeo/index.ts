import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'
import Kgeo from '@/api/app/land/kgeo/model'

const prefix = '/api/v1/openapi/kgeo/'

export async function getKgeoServiceData(service: string, params: object) {
  return http.post<ResultData<Kgeo.Response>>(`${prefix}/${service}`, params)
}

export async function getKgeoUnionData(pnu: string) {
  return http.get<ResultData<Kgeo.UnionMap>>(`${prefix}/${pnu}`, {})
}

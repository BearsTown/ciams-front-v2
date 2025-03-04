import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '../model'
import { AxiosRequestConfig } from 'axios'
import qs from 'qs'

const prefix = '/api/v1/address'

// 읍면동 리스트 조회
export function getAddressEmdList() {
  return http.get<ResultData<PNU.Search.Result[]>>(`${prefix}/emd/list`)
}

// 리 리스트 조회
export function getAddressRiList(params: PNU.Search.Params.RI) {
  return http.get<ResultData<PNU.Search.Result[]>>(`${prefix}/ri/list?${qs.stringify(params)}`)
}

// PNU 주소 변환
export function getPnuInfo(pnu: string) {
  return http.get<ResultData<PNU.Info>>(`${prefix}/info/${pnu}`)
}

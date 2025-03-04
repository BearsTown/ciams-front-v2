import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '../model'
import { BdReg, BdEtc } from './model'

const prefix = '/api/v1/plan/bd'

interface Params {
  pnu: string
}

// 건축물 대장정보 조회
export function getBdReg(params: Params) {
  return http.get<ResultData<BdReg>>(`${prefix}/reg/get`, { params })
}

export function getBdEtc(params: Params) {
  return http.get<ResultData<BdEtc>>(`${prefix}/etc/get`, { params })
}

import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import Config from '@/api/admin/config/model'

const prefix = '/api/v1'

export function getCode(code: string) {
  return http.get<ResultData<any[]>>(`${prefix}/codes/${code}`)
}

export function getCodeSublist(params: object) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<any[]>>(`${prefix}/codes/sub`, config)
}

export function getCodeList(parentCode: string) {
  return http.get<ResultData<any>>(`${prefix}/codes/${parentCode}/child`)
}

/**
 * 시스템 설정정보 조회
 * @param typeCode : 설정 구분 코드값
 */
export function getSystemConfig(typeCode: string) {
  return http.get<ResultData<Config.Result[]>>(`/cmm/config/${typeCode}`)
}

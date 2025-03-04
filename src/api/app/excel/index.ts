import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import Incen from '@/api/app/incen/model'

const prefix = '/api/v1/excel'

export function excel(params: Incen.Find.Incentive) {
  const config: AxiosRequestConfig = {
    params,
    responseType: 'blob',
  }
  return http.get<ResultData<BlobPart>>(`${prefix}/incen/download`, config)
}


import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import CiamsReportDto from '@/api/app/report/model'

const prefix = '/api/v1/report'

export function downLoadReport(params: CiamsReportDto.Create.Params) {
  const config: AxiosRequestConfig = {
    responseType: 'blob',
  }
  return http.post<ResultData<BlobPart>>(`${prefix}`, params, config)
}

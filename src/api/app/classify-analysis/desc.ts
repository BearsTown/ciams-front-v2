import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

import { AxiosRequestConfig } from 'axios'
import { ClassifyAnalysisDto } from '@/models/api/app/classify-analysis/ciams-analysis'

const prefix = '/api/v1/class'

export function getClassDescs(params: ClassifyAnalysisDto.Desc.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<ClassifyAnalysisDto.Desc.Find.Result[]>>(`${prefix}/desc`, config)
}

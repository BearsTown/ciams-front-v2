import { SourceGroupDTO } from '@/api/app/source/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/source'

export function getSources(params: SourceGroupDTO.Find.Params) {
  return http.post<ResultData<SourceGroupDTO.Find.Result[]>>(`${prefix}/list`, params)
}

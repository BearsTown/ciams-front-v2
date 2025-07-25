import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

import { ClassItaDto } from '@/models/api/app/classify-analysis/ita'

const prefix = '/api/v1/class/ita'

export function getItaResultDataById(zoneNo: string) {
  return http.get<ResultData<ClassItaDto.ItaResultData[]>>(`${prefix}/${zoneNo}/ita`)
}

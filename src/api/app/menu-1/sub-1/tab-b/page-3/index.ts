import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'
import { DensityInfo } from '@/api/app/menu-1/sub-1/tab-b/model'

const prefix = '/api/v1/1-1-2'

export function getDensityInfos(type: 'ALL' | 'TYPE1') {
  return http.get<ResultData<DensityInfo>>(`${prefix}/density/${type}`)
}

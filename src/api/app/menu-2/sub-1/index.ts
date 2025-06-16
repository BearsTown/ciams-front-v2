import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { Menu2Sub1DetailsDto } from '@/api/app/menu-2/sub-1/model'

const prefix = '/api/v1/menu-2/sub-1'

export function getByZoneNoItaResultDatas(zoneNo: string) {
  return http.get<ResultData<Menu2Sub1DetailsDto.ItaResultData[]>>(`${prefix}/ita/${zoneNo}`)
}

import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { Menu2ZoneDetailsDto } from '@/api/app/menu-2/model'

const prefix = '/api/v1/menu-2'

export function getMenu2ZoneOverView(params: Menu2ZoneDetailsDto.Overview.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<Menu2ZoneDetailsDto.Overview.Find.Result>>(
    `${prefix}/overview`,
    config,
  )
}

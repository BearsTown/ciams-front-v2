import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { CiamsMenu2Sub1DetailsDto } from '@/api/app/menu-2/sub-1/model'

const prefix = '/api/v1/menu-2/sub-1'

export function getMenu2Sub1OverView(params: CiamsMenu2Sub1DetailsDto.Overview.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<CiamsMenu2Sub1DetailsDto.Overview.Find.Result>>(
    `${prefix}/overview`,
    config,
  )
}

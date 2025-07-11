import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { CiamsMenu3Sub1DetailsDto } from '@/api/app/menu-3/sub-1/model'

const prefix = '/api/v1/menu-3/sub-1'

export { getImage, getMenu3Sub1Info }

function getMenu3Sub1Info(params: CiamsMenu3Sub1DetailsDto.Info.Find.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<CiamsMenu3Sub1DetailsDto.Info.Find.Result>>(
    `${prefix}/info`,
    config,
  )
}

function getImage(id: number) {
  const config: AxiosRequestConfig = {
    responseType: 'blob',
  }
  return http.get<ResultData<BlobPart>>(`${prefix}/image/${id}`, config)
}

import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

import { ConceptDto } from '@/models/api/app/plan/concept'

const prefix = '/api/v1/plan/concept'

export { getMenu3Sub1Info, getImage }

function getMenu3Sub1Info(zoneNo: string) {
  return http.get<ResultData<ConceptDto.Info.Find.Result>>(`${prefix}/${zoneNo}/info`)
}

function getImage(id: number) {
  const config: AxiosRequestConfig = {
    responseType: 'blob',
  }
  return http.get<ResultData<BlobPart>>(`${prefix}/image/${id}`, config)
}

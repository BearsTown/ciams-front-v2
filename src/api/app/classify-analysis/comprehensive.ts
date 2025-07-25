import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

import { ClassComprehensiveDto } from '@/models/api/app/classify-analysis/comprehensive'

const prefix = '/api/v1/class/comprehensive'

export {
  getComprehensiveInfo,
  getImage,
  //
}

function getComprehensiveInfo(zoneNo: string) {
  return http.get<ResultData<ClassComprehensiveDto.Info>>(`${prefix}/${zoneNo}/info`)
}

function getImage(id: number) {
  const config: AxiosRequestConfig = {
    responseType: 'blob',
  }
  return http.get<ResultData<BlobPart>>(`${prefix}/image/${id}`, config)
}

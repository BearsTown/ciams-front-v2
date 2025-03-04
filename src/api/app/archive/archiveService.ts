import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'
import Archive from './model'
import { AxiosRequestConfig } from 'axios'
const archivePrefix = 'api/v1/archive'

export default {
  getCategory() {
    const url = 'api/v1/category'
    return http.get<ResultData<Archive.ArchiveCategory>>(`${url}`)
  },

  getArchive(params: object) {
    const config: AxiosRequestConfig = {
      params,
    }
    return http.get<ResultData<Archive.ArchiveData>>(`${archivePrefix}?hidden=false`, config)
  },

  getArchiveDetail(archiveId: string) {
    return http.get<ResultData<Archive.Archive>>(`${archivePrefix}/${archiveId}`)
  },
}

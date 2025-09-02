import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'
import { AxiosRequestConfig } from 'axios'
import Archive from './model'

const prefix = '/api/v1/admin/archive'
const categoryPrefix = '/api/v1/admin/category'

export default {
  addCategory(params: Archive.ModifyCategory) {
    return http.post<ResultData<any>>(`${categoryPrefix}/add`, params)
  },

  modifyCategory(params: Archive.ModifyCategory) {
    return http.put<ResultData<any>>(`${categoryPrefix}/modify`, params)
  },

  getCategory() {
    return http.get<ResultData<any>>(`${categoryPrefix}`)
  },

  deleteCategory(categoryId: string) {
    return http.delete(`${categoryPrefix}/${categoryId}`)
  },

  getArchive(params: Archive.FindArchive) {
    const config: AxiosRequestConfig = {
      params,
    }
    return http.get<ResultData<any>>(`${prefix}`, config)
  },

  getArchiveDetail(archiveId: string) {
    return http.get<ResultData<Archive.ArchiveDetail>>(`${prefix}/${archiveId}`)
  },

  addArchive(params: Archive.ModifyArchive) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return http.post<ResultData<any>>(`${prefix}`, params, config)
  },

  modifyArchive(params: Archive.ModifyArchive) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return http.put<ResultData<any>>(`${prefix}/${params.archiveId}`, params, config)
  },

  modifyHidden(params: { ids: []; hidden: boolean }) {
    return http.put<ResultData<any>>(`${prefix}`, params)
  },

  deleteArchive(ids: string[]) {
    return http.delete(`${prefix}?ids=${ids}`)
  },
}

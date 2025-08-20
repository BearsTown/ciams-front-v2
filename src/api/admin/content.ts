import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app/index'

import { ContentDto } from '@/models/api/admin/content'

const prefix = '/api/v1/admin/content'

export {
  getContentList,
  getContent,
  addContent,
  updateContent,
  deleteContent,
  updatePriority,
  //
}

function getContentList(menuId: number) {
  return http.get<ResultData<ContentDto.Find.Result[]>>(`${prefix}/${menuId}/list`)
}

function getContent(id: number) {
  return http.get<ResultData<ContentDto.Find.Result>>(`${prefix}/${id}/info`)
}

function addContent(params: ContentDto.Add) {
  return http.post<ResultData<any>>(`${prefix}/add`, params)
}

function updateContent(params: ContentDto.Update) {
  return http.put<ResultData<any>>(`${prefix}/update`, params)
}

function deleteContent(id: number) {
  return http.delete<ResultData<any>>(`${prefix}/${id}/delete`)
}

function updatePriority(params: ContentDto.Priority) {
  return http.put<ResultData<any>>(`${prefix}/priority`, params)
}

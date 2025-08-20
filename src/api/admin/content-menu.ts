import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app/index'

import { ContentMenu, ContentMenuDto } from '@/models/api/admin/content-menu'

const prefix = '/api/v1/admin/content/menu'

export {
  getContentMenuGroupList,
  getContentMenuList,
  getContentMenu,
  addContentMenu,
  updateContentMenu,
  deleteContentMenu,
}

function getContentMenuGroupList() {
  return http.get<ResultData<ContentMenu[]>>(`${prefix}/group`)
}

function getContentMenuList(parentId: number) {
  return http.get<ResultData<ContentMenu[]>>(`${prefix}/${parentId}/list`)
}

function getContentMenu(id: number) {
  return http.get<ResultData<ContentMenu>>(`${prefix}/${id}/info`)
}

function addContentMenu(params: ContentMenuDto.Add) {
  return http.post<ResultData<any>>(`${prefix}/add`, params)
}

function updateContentMenu(params: ContentMenuDto.Update) {
  return http.put<ResultData<any>>(`${prefix}/update`, params)
}

function deleteContentMenu(id: number) {
  return http.delete<ResultData<any>>(`${prefix}/${id}/delete`)
}

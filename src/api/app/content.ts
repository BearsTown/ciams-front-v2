import { ciamsAxiosInstance as http } from '@/api/app/index'

import { ResultData } from '@/api/app/model'
import { ContentMenuDto } from '@/models/api/app/content-menu'
import { ContentDto } from '@/models/api/app/content'

const prefix = '/api/v1/content'

export {
  // getContentMenuGroupList,
  getContentMenuList,
  getContentList,
  //
}

// function getContentMenuGroupList() {
//   return http.get<ResultData<any[]>>(`${prefix}/menu/group`)
// }

function getContentMenuList(parentId: number) {
  return http.get<ResultData<ContentMenuDto.Find.Result[]>>(`${prefix}/menu/${parentId}/list`)
}

function getContentList(menuId: number) {
  return http.get<ResultData<ContentDto.Find.Result[]>>(`${prefix}/${menuId}/list`)
}

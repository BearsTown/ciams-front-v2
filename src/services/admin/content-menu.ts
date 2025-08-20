import { ContentMenu } from '@/models/services/admin/content-menu'

import CommonUtil from '@/utils/commonUtil'

import { getContentMenuList as getContentMenuListApi } from '@/api/admin/content-menu'

export {
  getContentMenuList,
  //
}

async function getContentMenuList(parentId: number): Promise<ContentMenu[]> {
  const { data } = await getContentMenuListApi(parentId)
  return data.map((menu) => ({
    ...menu,
    key: CommonUtil.generateUUID(true),
  })) as ContentMenu[]
}

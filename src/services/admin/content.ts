import CommonUtil from '@/utils/commonUtil'

import { Content } from '@/models/services/admin/content'

import { getContentList as getContentListApi } from '@/api/admin/content'

export {
  getContentList,
  //
}

async function getContentList(parentId: number): Promise<Content[]> {
  const { data } = await getContentListApi(parentId)

  return data.map((menu) => ({
    ...menu,
    key: CommonUtil.generateUUID(true),
  })) as Content[]
}

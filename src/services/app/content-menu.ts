import { ContentMenu } from '@/models/services/app/content-menu'

import { getContentMenuList as getContentMenuListApi } from '@/api/app/content'

export {
  getContentMenuList,
  //
}

async function getContentMenuList(parentId: number): Promise<ContentMenu[]> {
  const { data } = await getContentMenuListApi(parentId)
  return data.map((menu) => ({
    ...menu,
    isActive: false,
  })) as ContentMenu[]
}

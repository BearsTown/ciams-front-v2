import { ContentMenu as ContentMenuApi } from '@/models/api/admin/content-menu'

export interface ContentMenu extends ContentMenuApi {
  key: string
  children: ContentMenu[]
}

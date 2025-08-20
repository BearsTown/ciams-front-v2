import { ContentMenu as ContentMenuApi } from '@/models/api/app/content-menu'

export interface ContentMenu extends ContentMenuApi {
  isActive: boolean
  children: ContentMenu[]
}

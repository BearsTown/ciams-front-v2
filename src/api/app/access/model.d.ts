import { File } from '@/api/app/file/model'

namespace Archive {
  export interface Archive {
    archiveId: string
    title: string
    contents: string
    numOfRead: number
    categoryId: string
    hidden: boolean
    regUser: string
    regDate: string
    chgUser: string
    chgDate: string
  }

  export interface ArchiveDetail {
    archiveId: string
    title: string
    contents: string
    numOfRead: number
    categoryId: string
    hidden: boolean
    regUser: string
    regDate: string
    chgUser: string
    chgDate: string
    archiveFiles: File[]
  }

  export interface ArchiveCategory {
    categoryId: string
    name: string
    sortSn: number
    regUser: string
    chgDate: string
    chgUser: string
    regDate: string
    isLink: boolean
    linkUrl: string
  }

  export interface ModifyCategory {
    categoryId: string
    name: string
    sortSn?: number
    isLink?: boolean
    linkUrl?: string
  }

  export interface FindArchive extends PageInfo {
    categoryId?: string
    typeCode?: string
    title?: string
    hidden?: boolean | null
  }

  export interface ModifyArchive {
    archiveId?: string
    title: string
    categoryId: string
    contents?: string
    imgFile?: MultipartFile
    attachFiles?: MultipartFile[]
  }
}

export default Archive

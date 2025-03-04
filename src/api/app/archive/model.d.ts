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

  export interface ArchiveFile {
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
    imgFileId: string
    archiveFiles: [
      {
        createUser: string
        id: string
        linkId: string
        orgName: string
        newName: string
        path: string
        ext: string
        size: number
        typeCode: string
        sortSn: number
        createDate: string
      },
    ]
  }

  export interface ArchiveCategory {
    categoryId: string
    name: string
    isLink: boolean
    linkUrl: boolean
    chgUser: string
    chgDate: string
    regUser: string
    regDate: string
    sortSn: number
  }

  export interface SearchParam {
    title: string
    categoryId: string
    hidden: boolean
    size: number
    pageNo: number
    isPage: boolean
  }

  export interface File {
    createDate: string
    createUser: string
    ext: string
    id: string
    linkId: string
    newName: string
    orgName: string
    path: stiring
    size: number
    sortSn: number
    typeCode: string
  }

  export interface ArchiveData {
    archiveId: string
    categoryId: string
    chgDate: string
    chgUser: string
    hidden: boolean
    imgFileId: string
    numOfRead: number
    regDate: string
    regUser: stinrg
    title: string
    archiveFiles: File[]
  }
}

export default Archive

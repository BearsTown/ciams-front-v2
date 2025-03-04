import { PageReq, PageRes } from '@/api/app/model'

namespace FileDto {
  namespace Search {
    export interface Params extends PageReq {
      linkId: string | null
      keyword?: string
      typeCode?: string
    }

    export interface Row extends File {
      num?: number
    }

    export interface Result {
      page: PageRes
      list: Row[]
    }
  }

  namespace Delete {
    export interface Params {
      fileIds: number[]
    }
  }

  export interface TempFile {
    size: number
    ext: string
    orgName: string
    newName: string
    typeCode: string
  }
}

export interface File {
  id: Nullable<string>
  linkId?: string
  createUser?: string
  orgName: string
  newName: string
  path?: string
  ext: string
  size: number
  typeCode: string
  createDate?: string
}

export default FileDto

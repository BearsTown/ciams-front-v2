import { PageReq, PageRes } from '@/api/app/model'

namespace GisCiamsDistDTO {
  namespace Search {
    export interface Params extends PageReq {
      keyword?: string
    }

    export interface Row {
      rn: number
      distNo: string
      distName: string
      distArea: number
    }

    export interface Result {
      page: PageRes
      list: Row[]
    }
  }
}

export interface GisCiamsDist {
  distNo: string
  distName: string
  distArea: string
}

export { GisCiamsDistDTO }

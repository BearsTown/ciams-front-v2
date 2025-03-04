import { PageReq, PageRes } from '@/api/app/model'

namespace Plan {
  namespace Search {
    export interface Detail {
      planId: string
      planAreaId: string
    }

    export interface Params extends PageReq {
      planId: string
      name?: string
      remark?: string
    }

    export interface Row {
      rn: number
      mnum: string
      alias: string
      remark: string
      name: string
      csC: number
      area: number
    }

    export interface Result {
      page: PageRes
      list: Row[]
    }
  }

  namespace Overview {
    namespace Find {
      export interface Params {
        planId: string
        name: string
      }

      export interface Result extends CiamsPlanArea {
        temp: string
      }
    }
  }
}

export interface CiamsPlanArea {
  mnum: string
  alias: string
  remark: string
  name: string
  csC: number
  area: number
}

export { Plan }

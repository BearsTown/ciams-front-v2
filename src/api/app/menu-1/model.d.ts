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
      zoneNo: string
      zoneName: string
      useDist: string
      baseCsC: number
      zoneArea: number
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
        zoneNo: string
      }

      export interface Result extends CiamsPlanArea {
        temp: string
      }
    }
  }
}

export interface CiamsPlanArea {
  zoneNo: string
  zoneName: string
  useDist: string
  baseCsC: number
  zoneArea: number
}

export { Plan }

import { PageReq, PageRes } from '@/api/app/model'

namespace PlanZone {
  namespace Search {
    // export interface Detail {
    //   planId: string
    //   planAreaId: string
    // }

    export interface Params extends PageReq {
      zoneName?: string
      mngType?: string
    }

    export interface Row {
      rn: number
      zoneNo: string
      zoneName: string
      mngType: string
    }

    export interface Result {
      page: PageRes
      list: Row[]
    }
  }

  namespace Details {
    export interface Overview extends GisCiamsPlanZone {
      temp: string
    }
  }

  namespace Overview {
    namespace Find {
      export interface Params {
        incentiveId: string
      }

      export interface Result extends Incentive {
        incentiveLocId: string
        pnu: string
        loc: string
        jimok: string
        areaUseCds: object[]
      }
    }
  }

}

export interface GisCiamsPlanZone {
  zoneNo: string
  zoneName: string
  mngType: string
}


export { PlanZone }

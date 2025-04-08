import { PageReq, PageRes } from '@/api/app/model'

namespace Plan {
  namespace Search {
    export interface Detail {
      planId: string
      planAreaId: string
    }

    export interface Params extends PageReq {
      // planId: string
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

  namespace Details {
    export interface Overview extends CiamsPlanArea {
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

    export interface AllSummary {
    gubun: string
    zoneNm: string
    totalAr: string
    developAr: string
    ratio: string
    totalCo: string
    totalRt: string
    indstCo: string
    indstRt: string
    edcSctyCo: string
    edcSctyRt: string
    etcCo: string
    etcRt: string
    comCo: string
    comRt: string
    rsdCo: string
    rsdRt: string
  }

  export interface MasterSummary {
    planId: string
    useArea: string
    useAreaArea: string
    planAreaArea: string
    planAreaType1Cnt: string
    planAreaType2Cnt: string
    planAreaType3Cnt: string
    planAreaType4Cnt: string
    planAreaCnt: number
    planAreaCatagory1: number
    planAreaCatagory2: number
    planAreaRate: number
  }
}

export interface CiamsPlanAreaLink {
  planAreaId: string
  ver: string
  planIncenId: string
  planIncenLimitId: string
  memo: string
  regDate: string
  chgDate: string
  useYn: string
  planContentLinkId: string
}

export interface CiamsPlanArea {
  mnum: string
  alias: string
  remark: string
  name: string
  csC: number
  area: number
  // planAreaId: string
  // plan?: string
  // planType: string
  // planTypeReason?: string
  // planGroup?: string
  // planAreaCode?: string
  // planAreaName: string
  // planAreaTypeCd: string
  // planAreaLeng?: string
  // planAreaArea: string
  // planAreaDesc?: string
  // planAreaUse?: string
  // planAreaLoc?: string
}

namespace Incentive {
  namespace Find {
    export interface Info {
      planId: string
    }

    export interface Incentive {
      incentiveId: string
      regNo: string
      licBuilding: string
      licDevelop: string
      status: string
    }
  }

  export interface AreaTypeItems {
    bcrItems: AreaIncen[]
    farItems: AreaIncen[]
  }

  export interface AreaIncen {
    areaUseCd: string
    areaUseNm: string
    limit: number
    standard: number
    incentiveItems: IncenItem[]
  }

  export interface IncenItem {
    gcategoryNm?: string
    mcategoryNm?: string
    scategoryNm?: string
    formulaNm?: string
    increaseNm?: string
  }

  export interface AreaIncenIncrease {
    areaUseCd: string
    areaUseNm: string
    scategory: string
    scategoryNm: string
    title: string
    applyYn: boolean
    targetCategory: string
    targetCategoryNm: string
  }

  export interface Incentive {
    incentiveId: string
    regNo: string
    licBuilding: string
    licDevelop: string
    status: string
    area: string
    struc: string
    planId: string
    planArea_id: string
    xy: string
    regDate: string
    regUser: string
    delYn: string
    areaUseCd: string
    areaUseNm: string
    incentiveLocs: IncentiveLoc[]
  }

  export interface IncentiveLoc {
    incentiveLocId: string
    incentiveId: string
    pnu: string
    loc: string
    jimok: string
    area: number
    rep: string
    xy: string
  }
}

// export default Plan

export { Plan, Incentive }

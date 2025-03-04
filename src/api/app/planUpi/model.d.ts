import { CodeVal } from '@/services/devActivitiesStatus/incentiveCalculate/model'

namespace PlanUpi {
  namespace IncenCalc {
    namespace Find {
      export interface Info {
        // areaUseNm: string
        incentiveId: string
      }
    }

    export interface Item {
      mcategoryNm: string
      scategoryNm: string
      calc: number
      formulaNm: string
      $2?: {
        name: string
        value: number
      }
      $3?: {
        name: string
        value: number
      }
    }

    export interface Prop {
      code: string
      name: string
      value: number
    }

    export interface IncenItem {
      fieldName: string
      gcategoryNm: string
      mcategoryNm: string
      scategoryNm: string
      useFormula: boolean
      formulaBcr?: string
      formulaFar?: string
      formulaBcrParams: { [key: string]: string }
      formulaFarParams: { [key: string]: string }
    }

    export interface AreaIncen {
      ciamsPlanUpiId: string
      areaUseCd: string
      areaUseNm: string
      planIncenLimitId: string
      planStandardBcr?: number
      planStandardFar?: number
      planLimitBcr?: number
      planLimitFar?: number
      incenItems: IncenItem[]
    }

    export interface IncenInfo {
      props: Prop[]
      areaIncen: AreaIncen
    }
  }

  namespace IncenRecord {
    export interface Insert {
      ciamsPlanUpiId: string
      memo: string
      incentives: string // json
      summary: string // json
    }

    namespace Search {
      export interface Params {
        ciamsPlanUpiId: string
      }

      export interface Row extends CiamsPlanIncenRecord {
        _: string
      }

      export interface Result {
        list: Row[]
      }
    }
  }

  namespace IncentiveFile {
    export interface Insert {
      ciamsPlanUpiId: string
      files: MultipartFile[]
    }
  }

  namespace Summary {
    export interface Year {
      area: number
      cnt: number
      year: number
    }

    export interface Purpose {
      area: number
      cnt: number
      purpose: string
    }

    export interface UseArea {
      area: number
      cnt: number
      useArea: string
    }

    export interface YearPurpose extends Purpose {
      year: number
    }

    export interface Jimok {
      area: number
      cnt: number
      jimok: string
    }
  }

  export interface CiamsPlanUpi {
    // ciamsPlanUpiId: string
    no: string
    pnu: string
    useArea: string
    loc?: string
    jimok?: string
    area?: number
    purpose?: string
    note?: string
    year?: number
    planId: string
    planName: string
    planType: string
  }

  export interface CiamsPlanIncenRecord {
    incenCalcRecordId: string
    ciamsPlanUpiId: string
    incenCalcName: string
    memo: string
    state: number
    createDate: string
    incentives: object
    summary: object
  }
}

interface Category {
  name: string
  value: string
}

export default PlanUpi

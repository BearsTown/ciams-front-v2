namespace Gis {
  namespace Find {
    export interface Params {
      planId: string
    }

    export type Result = Array<UseGroup>
  }
}

export interface UseGroup {
  planId: string
  key: string
  value: string
  cd: string
}

export interface CiamsPlan {
  areaId: number
  areaType?: string
  areaTypeCd?: string
  areaName?: string
  areaLeng?: number
  areaArea?: number
  areaCause?: string
  devComArea?: string
  devComArea1?: string
  planId: string
  areaLoc?: string
}

export interface ciamsF107 {
  year: string
  jimok: string
  area: number
  type1: string
  type2: string
  type3: string
  type4: string
  type5: string
  type6: string
}

export default Gis

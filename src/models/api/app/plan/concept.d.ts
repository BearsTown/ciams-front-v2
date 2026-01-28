import { CiamsAnalysisDescription } from '@/models/api/app/classify-analysis/ciams-analysis'

export namespace ConceptDto {
  namespace Info {
    namespace Find {
      export interface Params {
        zoneNo: string
      }

      export interface Result {
        zoneNo: string
        zoneName: string
        mngCd: string
        mngType: string

        baseDescs: BaseDescDTO[]
        zoneDescs: ZoneDescDTO[]
        zoneImages: ZoneImageDTO[]
        zoneIndustries: ZoneIndustryDTO[]
      }
    }
  }
}

interface CiamsPlanZoneIndustry {
  id: number
  zoneNo: string
  category: string
  industryCode: string
  industryName: string
}

interface CiamsPlanZoneImage {
  id: number
  zoneNo: string
  category: string
  title: string
  path: string
  name: string
}

interface BaseDescDTO {
  category: string
  list: CiamsAnalysisDescription[]
}

interface ZoneDescDTO {
  category: string
  list: string[]
}

interface ZoneIndustryDTO {
  category: string
  list: CiamsPlanZoneIndustry[]
}

interface ZoneImageDTO {
  category: string
  list: CiamsPlanZoneImage[]
}

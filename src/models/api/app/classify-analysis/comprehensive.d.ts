export namespace ClassComprehensiveDto {
  namespace Overview {
    namespace Find {
      interface Params {
        zoneNo: string
      }

      interface Result extends CiamsAnalysis {
        _: unknown
      }
    }
  }

  interface Info {
    zoneNo: string
    zoneName: string
    descs: BaseDescDTO[]
    images: ImageDTO[]
    industries: IndustryDTO[]
  }
}

interface BaseDescDTO {
  category: string
  list: string[]
}

interface IndustryDTO {
  category: string
  list: CiamsPlanZoneIndustry[]
}

interface ImageDTO {
  category: string
  list: CiamsPlanZoneImage[]
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

interface CiamsAnalysis {
  zoneNo: string
  zoneName: string
  useDist: string
  zoneArea: string
  dvsType: string
  dvsCd: string
  mngType: string
  mngCd: string
  localArea: string
  localCs: string
  baseCsC: string
  density: string
  densityRe: string
  pastCsC: string
  variation: string
  variaRe: string
  sssC: string
  sssRate: string
  sssRe: string
  itaResult: string
  csB: string
  csB20: string
  deterio: string
  deterioRe: string
  roadA: string
  roadRate: string
  roadRe: string
  locResult: string
  division: string
  baseYear: string
  pastYear: string
}

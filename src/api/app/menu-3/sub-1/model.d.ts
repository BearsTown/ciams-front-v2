namespace CiamsMenu3Sub1DetailsDto {
  namespace Info {
    namespace Find {
      export interface Params {
        zoneNo: string
      }

      export interface Result extends CiamsPlanZone {
        baseDescs: BaseDescDTO[]
        zoneDescs: ZoneDescDTO[]
        zoneImages: ZoneImageDTO[]
        zoneIndustries: ZoneIndustryDTO[]
      }
    }
  }
}

interface CiamsPlanZone {
  zoneNo: string
  zoneName: string
  mngCd: string
  mngType: string
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
  list: string[]
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

export { CiamsMenu3Sub1DetailsDto }

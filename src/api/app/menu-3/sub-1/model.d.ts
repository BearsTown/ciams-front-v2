namespace CiamsMenu3Sub1DetailsDto {
  namespace Overview {
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

export interface CiamsPlanZone {
  zoneNo: string
  zoneName: string
  mngType: string
}

export interface CiamsPlanZoneIndustry {
  id: number
  zoneNo: string
  category: string
  industryCode: string
  industryName: string
}

export interface CiamsPlanZoneImage {
  id: number
  zoneNo: string
  category: string
  title: string
  path: string
  name: string
}


export interface BaseDescDTO {
  category: string
  list: string[]
}

export interface ZoneDescDTO {
  category: string
  list: string[]
}

export interface ZoneIndustryDTO {
  category: string
  list: CiamsPlanZoneIndustry[]
}

export interface ZoneImageDTO {
  category: string
  list: CiamsPlanZoneImage[]
}

export { CiamsMenu3Sub1DetailsDto }

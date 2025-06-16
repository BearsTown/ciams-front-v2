import { CiamsAnalysis } from '@/api/app/menu-2/model'
import { ZoneImageDTO, ZoneIndustryDTO } from '@/api/app/menu-3/sub-1/model'

namespace CiamsMenu2Sub4DetailsDto {
  namespace Overview {
    namespace Find {
      export interface Params {
        planId?: string
        zoneNo: string
      }

      export interface Result extends CiamsAnalysis {
        temp: string
      }
    }
  }
}

export interface Info {
  zoneNo: string
  zoneName: string

  descs: BaseDescDTO[]
  images: ZoneImageDTO[]
  industries: ZoneIndustryDTO[]
}

export { CiamsMenu2Sub4DetailsDto }

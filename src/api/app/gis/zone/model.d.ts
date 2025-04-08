import { PageReq, PageRes } from '@/api/app/model'

namespace GisCiamsZoneDTO {
  namespace Search {
    export interface Params extends PageReq {
      keyword?: string
      mngType?: string
    }

    export interface Row {
      rn: number
      zoneNo: string
      zoneName: string
      mngType: string
      useDist: string
      baseCsC: string
      zoneArea: number
      itaResult: string
      locResult: string
    }

    export interface Result {
      page: PageRes
      list: Row[]
    }
  }
}

export interface GisCiamsZone {
  zoneNo: string
  zoneName: string
  mngType: string
  // ...
}

export { GisCiamsZoneDTO }

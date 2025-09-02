import { PageReq, PageRes } from '@/api/app/model'

export { CiamsZoneDTO, CiamsZone }

namespace CiamsZoneDTO {
  namespace Search {
    interface Params extends PageReq {
      keyword?: string
      itaResult?: string // 산업기반분석
      locResult?: string // 지역여건분석
      dvsNo?: string // 관리유형구분
      mngNo?: string // 관리유형설정
    }

    interface Row {
      rn: number
      zoneNo: string
      zoneName: string
      useDist: string
      zoneArea: number
      dvsType: string
      dvsCd: string
      mngType: string
      mngCd: string
      baseCsC: number
      itaResult: string
      itaReCd: string
      locResult: string
      locReCd: string
    }

    interface Result {
      page: PageRes
      list: Row[]
    }
  }

  namespace Overview {
    namespace Find {
      interface Params {
        zoneNo: string
      }

      interface Result extends CiamsZone {
        _: unknown
      }
    }
  }
}

interface CiamsZone {
  zoneNo: string
  zoneName: string
  useDist: string
  zoneArea: number
  dvsType: string
  dvsCd: string
  mngType: string
  mngCd: string
  localArea: number
  localCs: number
  baseCsC: number
  density: number
  densityRe: string
  pastCsC: number
  variation: number
  variaRe: string
  sssC: number
  sssRate: number
  sssRe: string
  itaResult: string
  itaReCd: string
  csB: number
  csB20: number
  deterio: number
  deterioRe: string
  roadA: number
  roadRate: number
  roadRe: string
  locResult: string
  locReCd: string
  division: string
  baseYear: string
  pastYear: string
}

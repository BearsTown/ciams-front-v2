import type { SV0000000136 } from '@/models/api/app/kgeo/SV0000000136'
import type { SV0000000155 } from '@/models/api/app/kgeo/SV0000000155'
import type { SV0000000167 } from '@/models/api/app/kgeo/SV0000000167'

declare namespace Kgeo {
  export interface Response {
    code: number
    message: string
    result: object
  }

  export type LandInfo = {
    SV0000000136: SV0000000136.Result
    SV0000000155: SV0000000155.Result
    SV0000000167: SV0000000167.Result
  }

  export type BuildInfo = {
    // blddongl: SV0000000152.Bulddong
    // sv148: SV0000000148.Result
    // sv150: SV0000000150.Result
    buldKndNm?: string // 대장종류명
    ldgrKindCdNm?: string // 대장종류코드명
    ldgrKindCd?: string // 대장종류코드
    bldgNm?: string // 건물명
    dngNm?: string // 동명

    gfa?: string // 연면적
    bdrgSn?: bigint // 건축물대장일련번호_pk
    siar?: string // 대지면적
    bdar?: string // 건축면적
    bdcvrt?: string // 건폐율
    fart?: string // 용적률
    fartCmpttnGfa?: string // 용적률산정연면적
    mnUsgCdNm?: string // 주용도코드명
    etcUsgCn?: string // 기타용도내용
    fmlCnt?: number // 가구수
    hhCnt?: number // 세대수
    hoCnt?: number // 호수
    mbldCnt?: number // 주건축물수
    anxBdstCnt?: number // 부속건축물수
    tpkctCnt?: number // 주차수
    prmsnYmd?: string // 허가일자
    bgncstYmd?: string // 착공일자
    useAprvYmd?: string // 사용승인일자

    manxSeCdNm?: string // 주부속구분코드명
    strctCdNm?: string // 구조코드명
    etcStrctInfo?: string // 기타구조
    roofCdNm?: string // 지붕코드명
    etcRoofNm?: string // 기타지붕명
    hg?: number // 높이
    anxBldgArea?: number // 부속건축물면적
    anxBdstArea?: number // 부속건축물면적

    floorInfo?: SV0000000148.FloorInfo[] // 층별현황
  }

  export {
    SV0000000136, //
    SV0000000155, //
    SV0000000167, //
  }
}

export default Kgeo

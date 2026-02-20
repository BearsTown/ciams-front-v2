export namespace SV0000000148 {
  export interface Result {
    gnrlBild: GnrlBild
    floorInfo: FloorInfo[]
    chgData: ChgData[]
    relationJibuns: RelationJibuns[]
  }

  export interface GnrlBild {
    bdrgSn: string // 건물식별번호
    spareaNm: string // 특수지명
    blckNo: string // 블록번호
    ltNo: string // 로트번호
    bldgNm: string // 건물명
    lglztnYn: string // 양성화여부
    byltCnt: number // 외필지수
    etcStateMttr: string // 기타기재사항
    dngNm: string // 동명
    manxSeCd: string // 주부속구분코드
    manxSeCdNm: string // 주부속구분코드명
    manxSn: number // 주부속일련번호
    strctCd: string // 구조코드
    strctCdNm: string // 구조코드명
    etcStrctInfo: string // 기타구조
    roofCd: string // 지붕코드
    roofCdNm: string // 지붕코드명
    etcRoofNm: string // 기타지붕명
    siar: number // 대지면적
    fmlCnt: number // 가구수
    hhCnt: number // 세대수
    hoCnt: number // 호수
    bdar: number // 건축면적
    mnUsgCd: string // 주용도코드
    mnUsgCdNm: string // 주용도코드명
    etcUsgCn: string // 기타용도내용
    gfa: number // 연면적
    tolDngGfa: number // 총동연면적
    dngBdcvrt: number // 동건폐율
    fartCmpttnGfa: number // 용적률산정연면적
    fart: number // 용적률
    hg: number // 높이
    anxBdstCnt: number // 부속건축물수
    anxBdstArea: number // 부속건축물면적
    ldgrKindCd: string // 대장종류코드
    ldgrKindCdNm: string // 대장종류코드명
    bdcvrt: number // 건폐율
    prmsnYmd: string // 허가일자
    bgncstYmd: string // 착공일자
    useAprvYmd: string // 사용승인일자
  }

  export interface FloorInfo {
    flrNoNm: string // 층번호명
    strctCd: string // 구조코드
    strctCdNm: string // 구조코드명
    etcStrctInfo: string // 기타구조
    mnUsgCd: string // 주용도코드
    mnUsgCdNm: string // 주용도코드명
    etcUsgCn: string // 기타용도내용
    area: number // 면적
    flrSeCd: string // 층구분코드
    flrSeCdNm: string // 층구분코드명
    manxSeCd: string // 주부속구분코드
    manxSeCdNm: string // 주부속구분코드명
    manxSn: string // 주부속일련번호
  }

  export interface ChgData {
    chgCausCd: string // 변경원인코드
    chgCausCdNm: string // 변경원인코드명
    chgDsc: string // 변경내역
    chgYmd: string // 변경일자
    arngmtYmd: string // 정리일자
  }

  export interface RelationJibuns {
    relLandLocCd: string // 관련소재지코드
    mnLotno: string // 본번
    subLotno: string // 부번
    spareaNm: string // 특수지명
    etcLotnoNm: string // 기타지번명
  }
}

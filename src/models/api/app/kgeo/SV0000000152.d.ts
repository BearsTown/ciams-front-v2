export namespace SV0000000152 {
  export interface Result {
    bulddongList: Bulddong[]
  }

  export interface Bulddong {
    ldgrKindCdNm: string // 대장종류코드명
    ldgrKindCd: string // 대장종류코드
    bldgNm: string // 건물명
    dngNm: string // 동명
    gfa: number // 연면적
    bdrgSn: string // 건축물대장일련번호_pk
    sggCd: string // 시군구코드
    stdgCd: string // 법정동코드
    plotSeCd: string // 대지구분코드
    mnLotno: string // 주지번
    subLotno: string // 부지번
  }
}

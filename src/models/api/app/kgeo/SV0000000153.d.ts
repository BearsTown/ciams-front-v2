export namespace SV0000000153 {
  export interface Result {
    bdhList: BdhList[]
  }

  export interface BdhList {
    bdrgSn: number // 건물식별번호
    ldgrKindCd: string // 대장종류코드
    ldgrKindCdNm: string // 대장종류코드명
    upBdrgSn: number // 상위건물식별번호
    dngNm: string // 동명
    hoNm: string // 호명
    sggCd: string // 시군구코드
    stdgCd: string // 법정동코드
    plotSeCd: string // 대지구분코드
    mnLotno: string // 본번
    subLotno: string // 부번
    dngNo: number // 동번호
    hoNo: number // 호번호
  }
}

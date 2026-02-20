export namespace SV0000000150 {
  export interface Result {
    burgTotldr: BurgTotldr
  }

  export interface BurgTotldr {
    sggCd: string // 행정구역코드
    stdgCd: string // 소재지코드
    plotSeCd: string // 대지구분코드
    mnLotno: string // 본번
    subLotno: string // 부번
    bdrgSn: string // 건물식별번호
    bldgNm: string // 건물명
    byltCnt: number // 외필지수
    etcStateMttr: string // 기타기재사항
    upBdrgSn: string // 상위건물식별번호
    spareaNm: string // 특수지명
    blckNo: string // 블록번호
    ltNo: string // 로트번호
    spcmtCn: string // 특이사항내용
    siar: string // 대지면적
    bdar: string // 건축면적
    bdcvrt: string // 건폐율
    gfa: string // 연면적
    fart: string // 용적률
    fartCmpttnGfa: string // 용적률산정연면적
    mnUsgCd: string // 주용도코드
    mnUsgCdNm: string // 주용도코드명
    etcUsgCn: string // 기타용도내용
    fmlCnt: number // 가구수
    hhCnt: number // 세대수
    hoCnt: number // 호수
    mbldCnt: number // 주건축물수
    anxBdstCnt: number // 부속건축물수
    anxBdstArea: number // 부속건축물면적
    tpkctCnt: number // 주차수
    prmsnYmd: string // 허가일자
    bgncstYmd: string // 착공일자
    useAprvYmd: string // 사용승인일자
    permymdnum: string // 허가번호
    untyClsfCd: string // 통합분류코드
  }
}

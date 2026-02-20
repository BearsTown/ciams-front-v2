export namespace SV0000000155 {
  export interface Request {
    crtrMm?: string
    strYear?: string
    endYear?: string
  }

  export interface ResultNode {
    crtrYear?: number // 기준년도
    crtrMm?: number // 기준월
    indivOalp?: number // 개별공시지가
    pblntfYmd?: string // 공시일자
    etcCn?: string // 기타내용
  }

  export type Result = ResultNode[]
}

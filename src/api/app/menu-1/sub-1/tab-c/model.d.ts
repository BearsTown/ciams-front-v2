export interface ItaData extends ItaResultData {
  sggCd: string
  sggNm: string
  category: string
}

export interface IndustryArea {
  sggCd: string
  sggNm: string
}

export interface ItaResultData {
  insNm: string
  tcode: string
  clsCode: string
  lqValue: number
  lqClass: string
  grValue: number
  grClass: string
  rsValue: number
  rsClass: string
  itaRec: string
  lqRec: string
  corpCnt: number
  workerCnt: number
}

namespace IndustryStatus {
  namespace Find {
    export interface Params {
      type: '선도산업' | '신흥산업' | '쇠퇴산업' | '초기반산업'
    }

    export interface Result {
      industryStatusDatas: IndustryStatusData[]
      industryReps: IndustryRep[]
    }
  }

  export interface IndustryStatusData {
    insNm: string
    tcode: string
    clsCode: string
    lqValue: number
    grValue: number
    rsValue: number
    itaRec: string
    lqRec: string
    corpCnt: number
    workerCnt: number
  }

  export interface IndustryRep {
    tcode: string
    clsCode: string
    insNm: string
    itaRec: string
    lqRec: string
    corpName: string
    location: string
    workerCnt: number
  }
}

export { IndustryStatus }

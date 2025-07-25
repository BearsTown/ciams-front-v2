import { PageReq, PageRes } from '@/api/app/model'

export namespace CharResultDto {
  namespace Char {
    namespace Search {
      export interface Params extends PageReq {
        sggCd: string
      }

      export interface Row extends CharResultData {
        rn?: number
      }

      export interface Result {
        page: PageRes
        list: Row[]
      }
    }
  }

  export interface CharResultData {
    tCode: string
    clsCode: string
    codeNm: string
    insNm: string
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
}

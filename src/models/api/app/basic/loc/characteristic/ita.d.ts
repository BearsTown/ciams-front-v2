import { SourceGroupDTO } from '@/api/app/source/model'
import { PageReq, PageRes } from '@/api/app/model'

export namespace ItaDto {
  namespace Info {
    namespace Find {
      export interface Params {
        type: string
      }

      export interface Result {
        // notes
        sources: SourceGroupDTO.Find.Result[]
      }
    }
  }

  namespace Data {
    namespace Search {
      export interface Params extends PageReq {
        type?: string
      }

      export interface Row extends ItaData {
        rn?: number
      }

      export interface Result {
        page: PageRes
        list: Row[]
      }
    }
  }

  export interface ItaData extends ItaResultData {
    sggCd: string
    sggNm: string
    category: string
  }

  export interface ItaResultData {
    insNm: string
    tCode: string
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

  export interface Adjacent {
    sggCd: string
    sggNm: string
  }
}

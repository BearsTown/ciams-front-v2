import { SourceGroupDTO } from '@/api/app/source/model'
import { PageReq, PageRes } from '@/api/app/model'
import { OrderBy } from '@/models/api/app/basic/loc/characteristic/char-result'

export namespace ItaDto {
  namespace Info {
    namespace Find {
      export interface Params {
        type: string
      }

      export interface Result {
        sources: SourceGroupDTO.Find.Result[]
        descriptions: CiamsBasicLocDescription[]
      }
    }
  }

  namespace Data {
    namespace Search {
      export interface Params extends PageReq {
        type?: string
        orderByList?: OrderBy[]
      }

      export interface Row extends ItaData {
        rn?: number
      }

      export interface Result {
        page: PageRes
        list: Row[]
      }

      export interface OrderBy {
        column: string
        direction: 'ASC' | 'DESC'
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
    isTopCorp: boolean
    isTopWorker: boolean
  }

  export interface Adjacent {
    sggCd: string
    sggNm: string
  }
}

import { SourceGroupDTO } from '@/api/app/source/model'

export namespace StatusDto {
  namespace IndustryStatus {
    namespace Find {
      export interface Params {
        // type: string
        type: '선도산업' | '신흥산업' | '쇠퇴산업' | '초기반산업'
      }

      export interface Result {
        // image
        industryReps: IndustryRep[]
        sources: SourceGroupDTO.Find.Result[]
        descriptions: CiamsBasicLocDescription[]
      }
    }
  }

  export interface IndustryRep {
    insNm: string
    tcode: string
    clsCode: string
    itaRec: string
    lqRec: string
    corpName: string
    location: string
    workerCnt: number
    sales: number
  }
}

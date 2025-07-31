import { CiamsBasicLocDescription } from '@/models/api/app/basic/loc/ciams-basic-loc-description'
import { SourceGroupDTO } from '@/api/app/source/model'

export namespace IndustrialDto {
  namespace Find {
    export interface Params {
      type: string
      category: string
    }
  }

  export interface Info {
    statuses: Status[]
    densities: Density[]
    sources: SourceGroupDTO.Find.Result[]
    descriptions: CiamsBasicLocDescription[]
  }

  export interface Density {
    name: string
    area: number
    corpCnt: number
    workerCnt: number
    corpDensity: number
    workerDensity: number
    priority: number
  }

  export interface Status {
    code: string
    codeName: string
    corpCnt1: number
    corpCnt2: number
    corpCnt3: number
    workerCnt1: number
    workerCnt2: number
    workerCnt3: number
  }
}

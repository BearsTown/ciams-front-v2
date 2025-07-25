export namespace IndustrialDto {
  namespace Find {
    export interface Params {
      category: string
    }
  }

  export interface Info {
    notes: string[]
    statuses: Status[]
    densities: Density[]
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

export namespace ManufacturingDto {
  namespace Find {
    export interface Params {
      category: string
    }
  }

  export interface Info {
    notes: string[]
    statuses: Status[]
    densities: Density[]
    increases: Increase[]
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

  export interface Increase {
    code: string
    codeName: string
    corpIncrease: number
    workerIncrease: number
  }

  /**
   *
   */

  namespace CategoryStatus {
    export interface Info {
      statuses: CategoryStatus.Status[]
      categoryGroups: CategoryStatus.CategoryGroup[]
    }

    export interface Status {
      groupCode: string
      groupName: string
      corpCnt1Sum: number
      corpCnt2Sum: number
      corpCnt3Sum: number
      workerCnt1Sum: number
      workerCnt2Sum: number
      workerCnt3Sum: number
    }

    export interface CategoryGroup {
      groupCode: string
      groupName: string
      categories: CategoryStatus.Category[]
    }

    export interface Category {
      code: string
      codeName: string
    }
  }
}

export namespace TechLQDto {
  namespace HighTech {
    namespace Find {
      export interface Params {
        parentTechCd: string
      }

      export interface Result {
        parentTechCd: string
        parentTechNm: string
        techs: Tech[]
      }

      export interface Tech {
        techCd: string
        techNm: string
        corpLq: number
        workerLq: number
        corpQualified: boolean
        workerQualified: boolean
      }
    }
  }

  /**
   *
   */

  namespace TechLQ {
    namespace Find {
      export interface Params {
        techCd: string
      }

      export interface Result extends CiamsTechLQ {
        _: unknown
      }
    }
  }
}

export interface CiamsTechLQ {
  techCd: string
  sggCd: string
  sggNm: string
  corpLq: number
  workerLq: number
}

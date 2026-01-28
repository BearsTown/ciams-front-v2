export namespace ClassifyAnalysisDto {
  namespace Desc {
    namespace Find {
      interface Params {
        zoneNo: string
        category: string
      }

      interface Result extends DescDTO {
        _: unknown
      }
    }
  }
}

export interface DescDTO {
  category: string
  list: CiamsAnalysisDescription[]
}

export interface CiamsAnalysisDescription {
  id: number
  zoneNo: string
  category: string
  type: string
  description: string
  priority: number
}

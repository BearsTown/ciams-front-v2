export namespace CiamsBasicUrbanDto {
  namespace Info {
    namespace Find {
      export interface Params {
        dataGroupId: number
        targetId: string
      }

      export interface Result {
        descriptions: CiamsBasicUrbanDescription[]
      }
    }
  }
}

export interface CiamsBasicUrbanDescription {
  id: number
  category: string
  dataGroupId: string
  targetId: string
  description: string
  priority: number
}

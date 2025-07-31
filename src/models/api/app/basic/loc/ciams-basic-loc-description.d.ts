export namespace CiamsBasicLocDescriptionDto {
  namespace Find {
    export interface Params {
      type: string
      category: string
    }
  }
}

export interface CiamsBasicLocDescription {
  id: number
  category: string
  type: string
  typeDesc: string
  description: string
  priority: number
}

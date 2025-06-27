namespace SourceGroupDTO {
  namespace Find {
    export interface Params {
      category: string
      targetId?: string | number
    }

    export interface Result {
      category: string
      targetId: string
      targetDesc: string
      sources: SourceDTO[]
    }
  }

  export interface SourceDTO {
    sourceId: number
    timePoint: string
    priority: number
    source: Source
  }
}

export interface Source {
  id: number
  sourceOrgan: string
  sourceService: string
  title: string
  sub: string
}

export { SourceGroupDTO, SourceDTO }

export namespace ContentMenuDto {
  namespace Find {
    export interface Params {
      parentId: number
    }

    export interface Result extends ContentMenu {
      children: Result[]
    }
  }

  export interface Add {
    parentId?: number
    title: string
    useYn: boolean
  }

  export interface Update extends Add {
    id?: number
  }
}

export interface ContentMenu {
  id: number
  parentId: number
  level: number
  title: string
  useYn: boolean
  priority: number
}

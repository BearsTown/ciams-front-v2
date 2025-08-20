export namespace ContentDto {
  namespace Find {
    export interface Params {
      id: number
      menuId: number
    }

    export interface Result extends Content {
      //
    }
  }

  export interface Add {
    // id: number
    menuId: number
    title: string
    useYn: boolean
    useCollapse: boolean
    content: string
    imageFileIds: string[]
  }

  export interface Update extends Add {
    id: number
    //
  }

  export interface Priority {
    menuId: number
    ids: number[]
  }
}

export interface Content {
  id: number
  menuId: number
  title: string
  useYn: boolean
  useCollapse: boolean
  priority: number
  content: string
  createDate: string
  updateDate: string
}

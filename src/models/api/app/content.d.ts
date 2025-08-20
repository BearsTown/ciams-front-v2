export namespace ContentDto {
  namespace Find {
    export interface Params {
      menuId: number
    }

    export interface Result extends Content {
      //
    }
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

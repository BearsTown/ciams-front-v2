export namespace ScopeDto {
  export interface Data {
    category: string
    categoryItems: CategoryItem[]
  }

  export interface CategoryItem {
    code: string
    codeNm: string
    children: Code[]
  }

  export interface Code {
    code: string
    codeNm: string
  }
}

export enum IncentiveGroupType {
  BCR = '건폐율 인센티브',
  FAR = '용적률 인센티브',
}

export interface CodeVal {
  name: string
  value: number
}

export interface IncentiveGroup {
  type: IncentiveGroupType
  areaItems?: AreaItem[]
}

export interface AreaItem {
  // areaUse: string
  areaUseCd: string
  areaUseName: string
  limit?: number
  standard?: number
  incentiveItems: IncentiveItem[]
}

export interface IncentiveItem {
  gcategoryNm: string
  incentiveSubItems: IncentiveSubItem[]
}

export interface IncentiveSubItem {
  formulaNm?: string
  increaseNm: string | null | undefined
  mcategoryNm: string
  scategoryNm: string
}

export interface IncentiveCheckList {
  id: string
  title: string
  createDate: string
  contents: {
    title: string
    location: string
    area: string
    target: string
    build: string
    items: {
      ITEM_1: {
        A: boolean
        B: boolean
        C: boolean
        D: boolean
        E: boolean
      }
      ITEM_2: {
        A: boolean
        B: boolean
      }
      ITEM_3: {
        A: boolean
      }
      ITEM_4: {
        A: boolean
      }
      ITEM_5: {
        A: boolean
        B: boolean
      }
      ITEM_6: {
        A: boolean
        B: boolean
        C: boolean
      }
      ITEM_7: {
        A: boolean
      }
      ITEM_8: {
        A: boolean
        B: boolean
        C: boolean
      }
      ITEM_9: {
        A: boolean
        B: boolean
        C: boolean
        D: boolean
        E: boolean
        F: boolean
        G: boolean
      }
      ITEM_10: {
        A: boolean
        B: boolean
      }
      ITEM_11: {
        A: boolean
      }
      ITEM_12: {
        A: boolean
        B: boolean
      }
      ITEM_13: {
        A: boolean
        B: boolean
        C: boolean
      }
    }
  }
}

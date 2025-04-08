export interface Attribute {
  name: string
  label: string
  unit: string
  useRatio: boolean
}

export interface DataItem {
  [key: string]: number
}

export interface Item {
  name: string
  label: string
  useRange?: boolean
  start?: number
  end?: number
  color?: string
  data: DataItem
  ratio?: Record<string, number>
}

export interface RatioOptions {
  round?: number // 소수점 자리수 (기본값: 1)
}

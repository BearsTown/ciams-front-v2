export interface Attribute {
  id: number
  name: string
  label: string
  unit: string
  useRatio: boolean
  aggType: string
  dataType: string
  seriesType: string
  priority: number
}

export interface DataItem {
  [key: string]: number
}

export interface Item {
  id: number
  name: string
  label: string
  shorts: string
  useRange: boolean
  start: string
  end: string
  color: string
  priority: number
  data: DataItem
  ratio?: Record<string, number>
}

export interface RatioOptions {
  round?: number // 소수점 자리수 (기본값: 1)
}

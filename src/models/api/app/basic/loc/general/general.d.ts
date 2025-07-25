import { SourceGroupDTO } from '@/api/app/source/model'

export namespace GeneralDataDto {
  export interface DataItem {
    id: number
    parentId?: number
    title: string
    priority?: number
    children: DataItem[]
  }

  export interface DataGroupInfo {
    groups: DataGroup[]
    sources: SourceGroupDTO.Find.Result[]
  }

  export interface DataGroup {
    statusGroupId: number
    statusId: number
    dataId: number
    title: string
    view: string
    chartAxis: string
    priority: number
  }

  export interface DataDetailInfo {
    chartInfo: ChartInfo
    dataTable: DataTable
    columns: DataColumn[]
    pivotColumns: PivotColumn[]
    data: { [key: string]: any }[]
  }

  export interface DataTable {
    dataName: string
    pivot: boolean
  }

  export interface DataColumn {
    name: string
    label: string
    useCode: boolean
    useAxis: boolean
    dataType: string
    unit: string
    seriesType: string
  }

  export interface Pivot {
    rColumn: string
    cColumn: string
    vColumn: string
  }

  export interface PivotParams {
    dataId: number
    pivot: Pivot
    dataName: boolean
    columns: string[]
  }

  export interface PivotColumn {
    name: string
    label: string
    useAxis: boolean
    dataType: string
  }

  export interface ChartInfo {
    legend: string[]
    categories: string[]
  }
}

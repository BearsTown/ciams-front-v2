import { CiamsData, CiamsDataAttribute, CiamsDataColumn } from '@/models/api/app/basic/urban'

export namespace UrbanIndustryDto {
  export interface MetaData {
    years: CiamsData[]
    columns: CiamsDataColumn[]
    attributes: CiamsDataAttribute[]
  }
}

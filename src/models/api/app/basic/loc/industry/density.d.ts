import { SourceGroupDTO } from '@/api/app/source/model'
import { CiamsBasicLocDescription } from '@/models/api/app/basic/loc/ciams-basic-loc-description'

export namespace DensityDto {
  export interface Density {
    type: string
    year: string
    image: string
    priority: number
  }

  export interface DensityInfo {
    densities: Density[]
    sources: SourceGroupDTO.Find.Result[]
    descriptions: CiamsBasicLocDescription[]
  }
}

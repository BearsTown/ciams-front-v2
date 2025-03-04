namespace CiamsMenu2Sub1DetailsDto {
  namespace Overview {
    namespace Find {
      export interface Params {
        planId?: string
        name: string
      }

      export interface Result extends CiamsAnalysis {
        temp: string
      }
    }
  }
}

export interface CiamsAnalysis {
  mnum: string
  alias: string
  remark: string
  name: string
  csC: number
  area: number
  density: number
  densityRe: string
  variation: number
  variaRe: string
  sssC: number
  sssRate: number
  sssRe: string
  itaResult: string
  csB: string
  csB20: string
  deterio: number
  deterioRe: string
  roadA: number
  roadRate: number
  roadRe: string
  locala: string
  fresult: string
}

// export interface CiamsImage {
//   title: string
//   path: string
//   name: string
// }

export { CiamsMenu2Sub1DetailsDto }

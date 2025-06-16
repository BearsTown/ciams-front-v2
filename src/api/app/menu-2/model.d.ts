namespace Menu2ZoneDetailsDto {
  namespace Overview {
    namespace Find {
      export interface Params {
        planId?: string
        zoneNo: string
      }

      export interface Result extends CiamsAnalysis {
        temp: string
      }
    }
  }
}

export interface CiamsAnalysis {
  zoneNo: string
  zoneName: string
  useDist: string
  zoneArea: number
  dvsType: string
  dvsNo: string
  mngType: string
  mngNo: string
  localArea: number
  localCs: number
  baseCsC: number
  density: number
  densityRe: string
  pastCsC: number
  variation: number
  variaRe: string
  sssC: number
  sssRate: number
  sssRe: string
  itaResult: string
  csB: number
  csB20: number
  deterio: number
  deterioRe: string
  roadA: number
  roadRate: number
  roadRe: string
  locResult: string
  division: string
  baseYear: number
  pastYear: number
  crtDate: string
}

// export interface CiamsImage {
//   title: string
//   path: string
//   name: string
// }

export { Menu2ZoneDetailsDto }

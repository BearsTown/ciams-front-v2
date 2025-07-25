export namespace DensityDto {
  export interface Density {
    year: string
    image: string
    priority: number
  }

  export interface DensityInfo {
    type: string
    notes: string[]
    densities: Density[]
  }
}

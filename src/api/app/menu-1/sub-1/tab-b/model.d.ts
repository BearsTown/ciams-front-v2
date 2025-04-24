export interface Density {
  year: string
  image: string
  priority: number
}

export interface DensityInfo {
  type: string
  notes: string[]
  infos: Density[]
}

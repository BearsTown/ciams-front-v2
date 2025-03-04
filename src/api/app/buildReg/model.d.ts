export interface BdReg {
  data: BdRegData[]
  success: boolean
}

export interface BdEtc {
  data: BdEtcData[]
  success: boolean
}

interface BdRegData {
  bdRegId: string
  regTypeNm: string
  pnu: string
  sidoNm: string
  sggNm: string
  umdNm: string
  dongNm: string
  landTypeNm: string
  jibunJu: string
  jibunBu: string
  address: string
  subParcel: string
  flArea: string
  grFlArea: string
  landArea: string
  perDate: string
  conDate: string
  appuseDate: string
  addresRoad: string
  mainPurposeNm: string
  etcPurposeNm: string
  roofNm: string
  etcRoofNm: string
  floor: string
  basement: string
}

interface BdEtcData {
  binjip: int
  wiban: int
}

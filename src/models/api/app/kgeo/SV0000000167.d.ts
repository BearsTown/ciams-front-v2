export namespace SV0000000167 {
  export interface Request {
    legendHeight?: string // 범례이미지 세로길이
    legendWidth?: string // 범례이미지 가로길이
    mapHeight?: string // 맵이미지 세로길이
    mapWidth?: string // 맵이미지 가로길이
    issScale?: string // 축척
  }

  export interface Header {
    code?: string
    message?: string
  }

  export interface Base {
    confmTyCode?: string // 승인유형코드
    ladLocplcCodeNm?: string // 토지소재지코드명
    lnm?: string // 지번
    lndpclAr?: string // 필지면적
    lndcgrCode?: string // 지목코드
    lndcgrCodeNm?: string // 지목코드명
    ladUsePlanLawA?: string // 국토의 계획 및 이용
    ladUsePlanLawB?: string // 타법령에 따른 지역/지구
    ladUsePlanLawC?: string // 추가기재확인
    ladUsePlanLawD?: string // 토지이용규제
    scCode?: string // 축척코드
    drwImage?: string // 도면이미지
  }

  export interface Legend {
    lgdNm?: string // 범례명
    lgdImage?: string // 범례이미지
  }

  export interface Result {
    header?: Header
    base?: Base
    legend?: Legend[]
  }
}

declare namespace PublicData {
  namespace LandCharacteristicsService {
    interface Params {
      pnu: string
      numOfRows: number
      pageNo: number
      format: 'json' | 'xml'
      domain: string
      key: string
    }
    interface ResultData {
      landCharacteristicss: LandCharacteristicsList
    }
  }
  namespace LadgrdService {
    interface Params {
      pnu: string
      numOfRows: number
      pageNo: number
      format: 'xml'
      domain: string
      key: string
    }
    interface ResultData {
      ladgrdVOList: LadgrdVOList
    }
  }
  namespace LadfrlService {
    interface Params {
      pnu: string
      numOfRows: number
      pageNo: number
      format: 'xml'
      domain: string
      key: string
    }
    interface ResultData {
      ladfrlVOList: LadfrlVOList
    }
  }
  namespace LandUseService {
    interface Params {
      pnu: string
      numOfRows: number
      pageNo: number
      format: 'json' | 'xml'
      domain: string
      key: string
    }
    interface ResultData {
      landUses: LandUseAttrList
    }
  }
  namespace LuLawnmmService {
    interface Params {
      spcfcuCdNm: string
      serviceKey: string
      format: 'json' | 'xml'
    }
    interface ResultData {
      luLawnmms: LuLawnmmList
    }
  }
  namespace LandMoveService {
    interface Params {
      pnu: string
      numOfRows: number
      pageNo: number
      format: 'json' | 'xml'
      domain: string
      key: string
    }
    interface ResultData {
      landMoves: LandMoveList
    }
  }
}
export interface LandCharacteristics {
  regstrSeCode: string
  pnu: string
  ldCode: string
  ldCodeNm: string
  mnnmSlno: string
  regstrSeCodeNm: string
  lndcgrCode: string
  prposArea1: string
  prposArea2: string
  ladUseSittn: string
  ladUseSittnNm: string
  tpgrphHgCode: string
  tpgrphHgCodeNm: string
  tpgrphFrmCode: string
  tpgrphFrmCodeNm: string
  roadSideCode: string
  roadSideCodeNm: string
  lndpclAr: string
  lastUpdtDt: string
  stdrYear: string
  stdrMt: string
  pblntfPclnd: string
  lndcgrCodeNm: string
  ladSn: string
  prposArea1Nm: string
  prposArea2Nm: string
}
export interface LandUseAttr {
  regstrSeCode: string
  pnu: string
  ldCode: string
  ldCodeNm: string
  mnnmSlno: string
  regstrSeCodeNm: string
  lastUpdtDt: string
  prposAreaDstrcCodeNm: string
  manageNo: string
  cnflcAt: string
  cnflcAtNm: string
  prposAreaDstrcCode: string
  registDt: string
}
interface PublicDataResult<T> {
  totalCount: string
  numOfRows: string
  pageNo: string
  resultCode: Nullable<string>
  resultMsg: Nullable<string>
  field: Array<T>
}
interface PublicDataResultXML<T, K> {
  fields: Record<K, Array<T>> & {
    numOfRows: string
    pageNo: string
    totalCount: string
  }
}

interface LuLawnmm {
  spcfcuCd: Nullable<string>
  spcfcuCdNm: string
  spcfcuSe: string
  lawNm: string
  actionLmttSe: Nullable<string>
  cdNm: Nullable<string>
  orgNm: string
  joNo: string
  joAttlistSe: string
  prvsnSj: string
  joOpertnDe: string
  prmlgtDe: string
  hanghoNo: string
  joSubCns: string
  joSubAttlistSe: Nullable<string>
  joSubOpertnDe: string
}
interface LandMove {
  regstrSeCode: string
  pnu: string
  ldCode: string
  ldCodeNm: string
  mnnmSlno: string
  regstrSeCodeNm: string
  lndcgrCode: string
  lndpclAr: string
  lastUpdtDt: string
  lndcgrCodeNm: string
  ladMvmnDe: string
  ladMvmnErsrDe: string
  ladHistSn: string
  ladMvmnHistSn: string
  clsSn: string
  ladMvmnPrvonshCode: string
  ladMvmnPrvonshCodeNm: string
}
interface LadgrdVO {
  ladGrad: string
  ladGradChangeDe: string
  ladGradSeCode: string
  ladGradSeCodeNm: string
  lastUpdtDt: string
  liCode: string
  liCodeNm: string
  mnnmSlno: string
  pnu: string
  regstrSeCode: string
  regstrSeCodeNm: string
}
interface LadfrlVO {
  cnrsPsnCo: string
  ladFrtlSc: string
  ladFrtlScNm: string
  lastUpdtDt: string
  ldCode: string
  ldCodeNm: string
  lndcgrCode: string
  lndcgrCodeNm: string
  lndpclAr: string
  mnnmSlno: string
  pnu: string
  posesnSeCode: string
  posesnSeCodeNm: string
  regstrSeCode: string
  regstrSeCodeNm: string
}
export type LandCharacteristicsList = PublicDataResult<LandCharacteristics>

export type LandUseAttrList = PublicDataResult<LandUseAttr>

export type LuLawnmmList = PublicDataResult<LuLawnmm>

export type LandMoveList = PublicDataResult<LandMove>

export type LadgrdVOList = PublicDataResultXML<LadgrdVO, 'ladgrdVOList'>

export type LadfrlVOList = PublicDataResultXML<LadfrlVO, 'ladfrlVOList'>

export default PublicData

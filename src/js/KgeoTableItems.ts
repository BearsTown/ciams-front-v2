import CommonUtil from '@/utils/commonUtil'
import Kgeo from '@/models/api/app/kgeo'

export const kGeoBuildInfoLabels_1: {
  label: string
  formatter: (row: Kgeo.BuildInfo) => string | number
}[] = [
  {
    label: '총호수',
    formatter: (row) => {
      return `${row.hhCnt || 0} 세대 / ${row.fmlCnt || 0} 가구 / ${row.hoCnt || 0} 호`
    },
  },
  {
    label: '주용도',
    formatter: (row) => {
      return `${row.mnUsgCdNm || '-'}`
    },
  },
  {
    label: '기타용도',
    formatter: (row) => {
      return `${row.etcUsgCn || '-'}`
    },
  },
  {
    label: '주건축물수',
    formatter: (row) => {
      return row.mbldCnt || '-'
    },
  },
  {
    label: '부속건축물',
    formatter: (row) => {
      return row.anxBdstCnt || '-'
    },
  },
  {
    label: '부속건축물면적',
    formatter: (row) => {
      return CommonUtil.comma(row.anxBdstArea) + '㎡'
    },
  },
  {
    label: '대지면적',
    formatter: (row) => {
      return row.siar + '㎡'
    },
  },
  {
    label: '건축면적',
    formatter: (row) => {
      return row.bdar + '㎡'
    },
  },
  {
    label: '연면적',
    formatter: (row) => {
      return row.gfa + '㎡'
    },
  },
  {
    label: '용적률산정연면적',
    formatter: (row) => {
      return row.fartCmpttnGfa + '㎡'
    },
  },
  {
    label: '건폐율',
    formatter: (row) => {
      return row.bdcvrt + '%'
    },
  },
  {
    label: '용적률',
    formatter: (row) => {
      return row.fart + '%'
    },
  },
  {
    label: '허가일자',
    formatter: (row) => {
      return row.prmsnYmd || '-'
    },
  },
  {
    label: '착공일자',
    formatter: (row) => {
      return row.bgncstYmd || '-'
    },
  },
  {
    label: '사용승인일자',
    formatter: (row) => {
      return row.useAprvYmd || '-'
    },
  },
  {
    label: '주차수',
    formatter: (row) => {
      return row.tpkctCnt || '-'
    },
  },
]

export const kGeoBuildInfoLabels_2: {
  label: string
  formatter: (row: Kgeo.BuildInfo) => string | number
}[] = [
  {
    label: '총호수',
    formatter: (row) => {
      return `${row.hhCnt || 0} 세대 / ${row.hoCnt || 0} 호 / ${row.fmlCnt || 0} 가구`
    },
  },
  {
    label: '주용도',
    formatter: (row) => {
      return `${row.mnUsgCdNm || '-'}`
    },
  },
  {
    label: '기타용도',
    formatter: (row) => {
      return `${row.etcUsgCn || '-'}`
    },
  },
  {
    label: '주구조',
    formatter: (row) => {
      return row.strctCdNm || '-'
    },
  },
  {
    label: '지붕구조',
    formatter: (row) => {
      return row.roofCdNm || '-'
    },
  },
  {
    label: '부속건축물면적',
    formatter: (row) => {
      return CommonUtil.comma(row.anxBdstArea) + '㎡'
    },
  },
  {
    label: '건축면적',
    formatter: (row) => {
      return CommonUtil.comma(row.bdar) + '㎡'
    },
  },
  {
    label: '부속건축물수',
    formatter: (row) => {
      return row.anxBdstCnt || '-'
    },
  },
  {
    label: '대지면적',
    formatter: (row) => {
      return row.siar + '㎡'
    },
  },
  {
    label: '건축면적',
    formatter: (row) => {
      return CommonUtil.comma(row.bdar) + '㎡'
    },
  },
  {
    label: '연면적',
    formatter: (row) => {
      return CommonUtil.comma(row.gfa) + '㎡'
    },
  },
  {
    label: '용적률산정연면적',
    formatter: (row) => {
      return `${CommonUtil.comma(row.fartCmpttnGfa)}㎡`
    },
  },
  {
    label: '높이',
    formatter: (row) => {
      return row.hg + 'm'
    },
  },
  {
    label: '건폐율',
    formatter: (row) => {
      return row.bdcvrt + '%'
    },
  },
  {
    label: '용적률',
    formatter: (row) => {
      return row.fart + '%'
    },
  },
  {
    label: '허가일자',
    formatter: (row) => {
      return row.prmsnYmd || '-'
    },
  },
  {
    label: '착공일자',
    formatter: (row) => {
      return row.bgncstYmd || '-'
    },
  },
  {
    label: '사용승인일자',
    formatter: (row) => {
      return row.useAprvYmd || '-'
    },
  },
]

export const recapTitleLabels = [
  {
    label: '총호수',
    formatter: (row) => {
      return `${row.hhldCnt || 0} 세대 / ${row.fmlyCnt || 0} 가구 / ${row.hoCnt || 0} 호`
    },
  },
  {
    label: '주용도',
    formatter: (row) => {
      return `${row.mainUse || '-'} (${row.etcPurpsNm || '-'})`
    },
  },
  {
    label: '주건축물수',
    formatter: (row) => {
      return row.mainBldCnt || '-'
    },
  },
  {
    label: '부속건축물',
    formatter: (row) => {
      return row.atchBldCnt || '-'
    },
  },
  {
    label: '대지면적',
    formatter: (row) => {
      return numberWithComma(row.siteArea) + '㎡'
    },
  },
  {
    label: '건축면적',
    formatter: (row) => {
      return numberWithComma(row.bldgArea) + '㎡'
    },
  },
  {
    label: '연면적',
    formatter: (row) => {
      return numberWithComma(row.grossFloorArea) + '㎡'
    },
  },
  {
    label: '용적률산정용연면적',
    formatter: (row) => {
      return numberWithComma(row.vlRatEstmTotArea) + '㎡'
    },
  },
  {
    label: '건폐율',
    formatter: (row) => {
      return numberWithComma(row.bldgLandRatio) + '%'
    },
  },
  {
    label: '용적률',
    formatter: (row) => {
      return numberWithComma(row.floorAreaRatio) + '%'
    },
  },
  {
    label: '허가일자',
    formatter: (row) => {
      return setDateFormat(row.pmsDay)
    },
  },
  {
    label: '착공일자',
    formatter: (row) => {
      return setDateFormat(row.stcnsDay)
    },
  },
  {
    label: '사용승인일자',
    formatter: (row) => {
      return setDateFormat(row.useAprvDate)
    },
  },
  {
    label: '주차수',
    formatter: (row) => {
      return numberWithComma(row.totPkngCnt) || '-'
    },
  },
]

export const titleLabels = [
  {
    label: '총호수',
    formatter: (row) => {
      return `${row.hhldCnt || 0} 세대 / ${row.fmlyCnt || 0} 가구 / ${row.hoCnt || 0} 호`
    },
  },
  {
    label: '주용도',
    formatter: (row) => {
      return `${row.mainUse || '-'} (${row.etcPurpsNm || '-'})`
    },
  },
  {
    label: '주구조',
    formatter: (row) => {
      return row.strctCdNm || '-'
    },
  },
  {
    label: '지붕구조',
    formatter: (row) => {
      return row.roofCdNm || '-'
    },
  },
  {
    label: '부속건축물면적',
    formatter: (row) => {
      return numberWithComma(row.atchBldArea) + '㎡'
    },
  },
  {
    label: '부속건축물',
    formatter: (row) => {
      return numberWithComma(row.atchBldCnt) || '-'
    },
  },
  {
    label: '대지면적',
    formatter: (row) => {
      return numberWithComma(row.siteArea) + '㎡'
    },
  },
  {
    label: '건축면적',
    formatter: (row) => {
      return numberWithComma(row.bldgArea) + '㎡'
    },
  },
  {
    label: '연면적',
    formatter: (row) => {
      return numberWithComma(row.grossFloorArea) + '㎡'
    },
  },
  {
    label: '용적률산정용연면적',
    formatter: (row) => {
      return numberWithComma(row.vlRatEstmTotArea) + '㎡'
    },
  },
  {
    label: '층수',
    formatter: (row) => {
      return `지상 ${row.grndFlrCnt || '-'}층, 지하 ${row.ugrndFlrCnt || '-'}층`
    },
  },
  {
    label: '높이',
    formatter: (row) => {
      return numberWithComma(row.heit) + 'm'
    },
  },
  {
    label: '건폐율',
    formatter: (row) => {
      return numberWithComma(row.bldgLandRatio) + '%'
    },
  },
  {
    label: '용적률',
    formatter: (row) => {
      return numberWithComma(row.floorAreaRatio) + '%'
    },
  },
  {
    label: '허가일자',
    formatter: (row) => {
      return setDateFormat(row.pmsDay)
    },
  },
  {
    label: '착공일자',
    formatter: (row) => {
      return setDateFormat(row.stcnsDay)
    },
  },
  {
    label: '사용승인일자',
    formatter: (row) => {
      return setDateFormat(row.useAprvDate)
    },
  },
  {
    label: '주차수',
    formatter: (row) => {
      return numberWithComma(row.totPkngCnt) || '-'
    },
  },
]

export const floorLabels = [
  {
    label: '층구분',
    prop: 'flrGbCdNm',
    formatter: (row) => {
      return row.flrGbCdNm || '-'
    },
    width: '10%',
  },
  {
    label: '층수',
    prop: 'flrNo',
    formatter: (row) => {
      return row.flrNo || '-'
    },
    width: '10%',
  },
  {
    label: '동명',
    prop: 'dongNm',
    formatter: (row) => {
      return row.dongNm || '-'
    },
    width: '15%',
  },
  {
    label: '구조',
    prop: 'structure',
    formatter: (row) => {
      return row.structure || '-'
    },
    width: '15%',
  },
  {
    label: '용도',
    prop: 'use',
    formatter: (row) => {
      return row.use || '-'
    },
    width: '15%',
  },
  {
    label: '연면적(㎡)',
    prop: 'grossFloorArea',
    formatter: (row) => {
      return numberWithComma(row.grossFloorArea)
    },

    width: '20%',
  },
  {
    label: '주부속구분',
    prop: 'mainSubDiv',
    formatter: (row) => {
      return row.mainSubDiv || '-'
    },
  },
]

export const hoLabels = [
  {
    label: '층구분',
    prop: 'flrGbCdNm',
    formatter: (row) => {
      return row.flrGbCdNm || '-'
    },
    width: '10%',
  },
  {
    label: '층수',
    prop: 'flrNo',
    formatter: (row) => {
      return row.flrNo || '-'
    },
    width: '10%',
  },
  {
    label: '동명',
    prop: 'dongNm',
    formatter: (row) => {
      return row.dongNm || '-'
    },
    width: '15%',
  },
  {
    label: '호수',
    prop: 'hoNm',
    formatter: (row) => {
      return row.hoNm || '-'
    },
    width: '15%',
  },
  {
    label: '면적(㎡)',
    prop: 'area',
    formatter: (row) => {
      return numberWithComma(row.area)
    },
  },
  {
    label: '전유면적(㎡)',
    prop: 'exposArea',
    formatter: (row) => {
      return numberWithComma(row.exposArea)
    },
  },
  {
    label: '공용면적(㎡)',
    prop: 'publicUseArea',
    formatter: (row) => {
      return numberWithComma(row.publicUseArea)
    },
  },
]

export const regionalLabels = [
  {
    label: '구분',
    prop: 'jijiguGbCdNm',
    formatter: (row) => {
      return row.jijiguGbCdNm || '-'
    },
    width: '25%',
  },
  {
    label: '용도지역지구구역명',
    prop: 'jijiguCdNm',
    formatter: (row) => {
      return row.jijiguCdNm || '-'
    },
    width: '25%',
  },
  {
    label: '기타지역지구구역명',
    prop: 'etcJijigu',
    formatter: (row) => {
      return row.etcJijigu || '-'
    },
    width: '25%',
  },
  {
    label: '생성일자',
    prop: 'crtnDay',
    formatter: (row) => {
      return setDateFormat(row.crtnDay)
    },
    width: '25%',
  },
]

export const sewageLabels = [
  {
    label: '오수정화시설 형식',
    prop: 'modeCdNm',
    formatter: (row) => {
      return row.modeCdNm || '-'
    },
    width: '30%',
  },
  {
    label: '오수정화시설 단위',
    prop: 'unitGbCdNm',
    formatter: (row) => {
      return row.unitGbCdNm || '-'
    },
    width: '25%',
  },
  {
    label: '용량(인용)',
    prop: 'capaPsper',
    formatter: (row) => {
      return numberWithComma(row.capaPsper)
    },
    width: '20%',
  },
  {
    label: '용량(루베)',
    prop: 'capaLube',
    formatter: (row) => {
      return numberWithComma(row.capaLube)
    },
    width: '25%',
  },
]

export const krasBuildInfoLabels = [
  {
    label: '건물명',
    prop: 'bldgNm',
    formatter: (row) => {
      return row?.bldgNm || '-'
    },
  },
  {
    label: '동명',
    prop: 'dongNm',
    formatter: (row) => {
      return row?.dongNm || '-'
    },
    width: '15%',
  },
  {
    label: '주용도',
    prop: 'mainUse',
    formatter: (row) => {
      return row?.mainUse || '-'
    },
    width: '15%',
  },
  {
    label: '연면적(㎡)',
    prop: 'grossFloorArea',
    formatter: (row) => {
      return row?.grossFloorArea
    },

    width: '20%',
  },
  {
    label: '승인일자',
    prop: 'useAprvDate',
    formatter: (row) => {
      return row?.useAprvDate
    },
    width: '20%',
  },
]

export const krasTitleLabels = [
  {
    label: '주용도',
    formatter: (row) => {
      return `${row?.mainUse || '-'}`
    },
  },
  {
    label: '대지면적',
    formatter: (row) => {
      return row?.siteArea + '㎡'
    },
  },
  {
    label: '건축면적',
    formatter: (row) => {
      return row?.bldgArea + '㎡'
    },
  },
  {
    label: '연면적',
    formatter: (row) => {
      return row?.grossFloorArea + '㎡'
    },
  },
  {
    label: '건폐율',
    formatter: (row) => {
      if (row?.bldgLandRatio) {
        const ratio = Math.floor(Number(row?.bldgLandRatio) * 100) / 100
        return ratio + '%'
      } else {
        return '-'
      }
    },
  },
  {
    label: '용적률',
    formatter: (row) => {
      if (row?.floorAreaRatio) {
        const ratio = Math.floor(Number(row?.floorAreaRatio) * 100) / 100
        return ratio + '%'
      } else {
        return '-'
      }
    },
  },
  {
    label: '사용승인일자',
    formatter: (row) => {
      return row?.useAprvDate
    },
  },
]

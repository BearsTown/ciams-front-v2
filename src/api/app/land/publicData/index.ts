import axios from 'axios'
import PublicData from '@/api/app/land/publicData/model'
import { API_INFO_PUBLIC } from '@/config/config'
import { API_INFO_VWORLD } from '@/config/config'

const prefix = API_INFO_VWORLD.PREFIX //API_INFO_PUBLIC.PREFIX + '1611000/nsdi'
const serviceKey =
  'oXqSf30bDoj6teptfSxCbtPWyAVGGZo0z53p+MSE1QLAzpK99E3LjQEsNaf5OQ4TAxLU1PUn0WFkRvLzTiD9OQ=='

const dm = window.location.origin
// const { VWORLD_KEY } = computed(() => useMapConfig().state).value
//토지특성속성조회

export type PublicDataParam = {
  pnu: string
  key: string
  domain: string
}

export async function fetchLandCharacteristics(param: PublicDataParam) {
  const { pnu, key, domain } = param
  const params: PublicData.LandCharacteristicsService.Params = {
    format: 'json',
    numOfRows: 100,
    pageNo: 1,
    pnu: pnu,
    domain,
    key,
  }
  return axios.get<PublicData.LandCharacteristicsService.ResultData>(
    `${prefix}/ned/data/getLandCharacteristics`,
    { headers: { Accept: '*/*' }, params },
  )
}
//토지등급목록조회
export async function fetchLadgrd(param: PublicDataParam) {
  const { pnu, key, domain } = param
  const params: PublicData.LadgrdService.Params = {
    format: 'xml',
    numOfRows: 100,
    pageNo: 1,
    pnu,
    domain,
    key,
  }
  return axios.get<PublicData.LadgrdService.ResultData>(`${prefix}/ned/data/ladgrdList`, {
    headers: { Accept: '*/*' },
    params,
  })
}
//토지임야정보
export async function fetchLadfrl(param: PublicDataParam) {
  const { pnu, key, domain } = param
  const params: PublicData.LadfrlService.Params = {
    format: 'xml',
    numOfRows: 100,
    pageNo: 1,
    pnu,
    domain,
    key,
  }
  // return axios.get<PublicData.LadfrlService.ResultData>(`${prefix}/ned/data/ladfrlList`, {
  //   headers: { Accept: '*/*' },
  //   params,
  // })
  return fetch(
    `${prefix}/ned/data/ladfrlList?format=xml&numOfRows=100&pageNo=1&pnu=${pnu}&domain=${domain}&key=${key}`,
    {
      headers: { Accept: '*/*' },
    },
  )
}
//토지이용계획속성조회
export async function fetchLandUse(param: PublicDataParam) {
  const { pnu, key, domain } = param
  const params: PublicData.LandUseService.Params = {
    format: 'json',
    numOfRows: 100,
    pageNo: 1,
    pnu,
    domain,
    key,
  }
  return axios.get<PublicData.LandUseService.ResultData>(`${prefix}/ned/data/getLandUseAttr`, {
    headers: { Accept: '*/*' },
    params,
  })
}
//규제정보
export async function fetchLuLawnmm(spcfcuCdNm: string) {
  const params: PublicData.LuLawnmmService.Params = {
    format: 'json',
    serviceKey,
    spcfcuCdNm,
  }
  return axios.get<PublicData.LuLawnmmService.ResultData>(
    `${API_INFO_PUBLIC.PREFIX}1611000/LuLawnmmService/attr/getLuLawnmmAttrList`,
    { headers: { Accept: '*/*' }, params },
  )
}
//*토지이동이력속성조회
export async function fetchLandMove(param: PublicDataParam) {
  const { pnu, key, domain } = param
  const params: PublicData.LandMoveService.Params = {
    format: 'json',
    numOfRows: 100,
    pageNo: 1,
    pnu,
    domain,
    key,
  }
  return axios.get<PublicData.LandMoveService.ResultData>(`${prefix}/ned/data/getLandMoveAttr`, {
    headers: { Accept: '*/*' },
    params,
  })
}

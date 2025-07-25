import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

import { DensityDto } from '@/models/api/app/basic/loc/industry/density'
import { IndustrialDto } from '@/models/api/app/basic/loc/industry/industrial'
import { ManufacturingDto } from '@/models/api/app/basic/loc/industry/manufacturing'
import { TechLQDto } from '@/models/api/app/basic/loc/industry/techLq'
import { ScopeDto } from '@/models/api/app/basic/loc/industry/scope'

const prefix = '/api/v1/basic/loc/ind-status'

export {
  getScopes,
  getDensityInfo,
  getIndustrialInfo,
  getManufacturingInfo,
  getCategoryStatusInfo,
  getHighTech,
  getTechLQs,
  //
}

/**
 * 산업의 범위 목록
 */
function getScopes() {
  return http.get<ResultData<ScopeDto.Data[]>>(`${prefix}/scope`)
}

/**
 * 사업체 밀도변화 정보
 *
 * @param type
 */
function getDensityInfo(type: string) {
  return http.get<ResultData<DensityDto.DensityInfo>>(`${prefix}/density/${type}`)
}

/**
 * 산업별 사업체수/종사자수 정보
 *
 * @param params
 */
function getIndustrialInfo(params: IndustrialDto.Find.Params) {
  return http.post<ResultData<IndustrialDto.Info>>(`${prefix}/industrial`, params)
}

/**
 * 제조업별 사업체수/종사자수 정보
 *
 * @param params
 */
function getManufacturingInfo(params: ManufacturingDto.Find.Params) {
  return http.post<ResultData<ManufacturingDto.Info>>(`${prefix}/mfg/mfg-info`, params)
}

/**
 * 제조업 유형별 현황 정보
 *
 * @param params
 */
function getCategoryStatusInfo() {
  return http.get<ResultData<ManufacturingDto.CategoryStatus.Info>>(`${prefix}/mfg/cls-info`)
}

/**
 * 집적도 높은 기술
 *
 * @param params
 */
function getHighTech(params: TechLQDto.HighTech.Find.Params) {
  return http.post<ResultData<TechLQDto.HighTech.Find.Result>>(`${prefix}/tech`, params)
}

/**
 * 기술업종목록
 *
 * @param params
 */
function getTechLQs(params: TechLQDto.TechLQ.Find.Params) {
  return http.post<ResultData<TechLQDto.TechLQ.Find.Result[]>>(`${prefix}/tech/lq`, params)
}

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

import { CiamsDataGroup } from '@/models/api/app/basic/urban'
import { UrbanIndustryDto } from '@/models/api/app/basic/urban/industry'

const prefix = '/api/v1/basic/urban/data'

export {
  getDataGroups,
  getMetaData,
  //
}

/**
 * 도시공업지역 현황 데이터 그룹 목z록
 *
 * @param parentId
 */
function getDataGroups(parentId: number) {
  return http.get<ResultData<CiamsDataGroup[]>>(`${prefix}/${parentId}/group`)
}

/**
 * 도시공업지역 현황 데이터 메타데이터
 *
 * @param dataGroupId
 */
function getMetaData(dataGroupId: number) {
  return http.get<ResultData<UrbanIndustryDto.MetaData>>(`${prefix}/${dataGroupId}/metadata`)
}

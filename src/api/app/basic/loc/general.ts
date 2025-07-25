import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { GeneralDataDto } from '@/models/api/app/basic/loc/general/general'

const prefix = '/api/v1/basic/loc/general'

export {
  getGeneralDataItems,
  getDataGroupInfo,
  getDataDetailInfo,
  //
}

/**
 * 일반현황 데이터 Item 목록
 */
function getGeneralDataItems() {
  return http.get<ResultData<GeneralDataDto.DataItem[]>>(`${prefix}/data/items`)
}

/**
 * 데이터 그룹 정보
 *
 * @param itemId
 */
function getDataGroupInfo(itemId: number) {
  return http.get<ResultData<GeneralDataDto.DataGroupInfo>>(`${prefix}/data/${itemId}/group`)
}

/**
 * 데이터 상세 정보
 *
 * @param dataId
 */
function getDataDetailInfo(dataId: number) {
  return http.get<ResultData<GeneralDataDto.DataDetailInfo>>(`${prefix}/data/${dataId}/info`)
}

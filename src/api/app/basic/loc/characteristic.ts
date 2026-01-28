import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'

import { ItaDto } from '@/models/api/app/basic/loc/characteristic/ita'
import { StatusDto } from '@/models/api/app/basic/loc/characteristic/status'
import { CharResultDto } from '@/models/api/app/basic/loc/characteristic/char-result'

const prefix = '/api/v1/basic/loc/ind-char'

export {
  getItaInfo,
  getItaData,
  getIndustryStatus,
  getItaResultDataList,
  getAdjacent,
  getIndustryStatusTemp,
  //
}

/**
 * 산업기반분석
 */
function getItaInfo() {
  return http.post<ResultData<ItaDto.Info.Find.Result>>(`${prefix}/ita`)
}

/**
 * 산업기반분석 업종
 *
 * @param params
 */
function getItaData(params: ItaDto.Data.Search.Params) {
  return http.post<ResultData<ItaDto.Data.Search.Result>>(`${prefix}/ita/data`, params)
}

/**
 * 산업 현황
 *
 * @param params
 */
function getIndustryStatus(params: StatusDto.IndustryStatus.Find.Params) {
  return http.post<ResultData<StatusDto.IndustryStatus.Find.Result>>(`${prefix}/ita/status`, params)
}

/**
 * 산업특성분석 결과
 *
 * @param params
 */
function getItaResultDataList(params: CharResultDto.Char.Search.Params) {
  // const config: AxiosRequestConfig = {
  //   params,
  //   paramsSerializer: (params) => {
  //     return qs.stringify(params, { arrayFormat: 'comma' })
  //   },
  // }
  // return http.get<ResultData<CharResultDto.Char.Search.Result>>(`${prefix}/ita/result`, config)
  return http.post<ResultData<CharResultDto.Char.Search.Result>>(`${prefix}/ita/result`, params)
}

/**
 * 인접 지자체 목록
 */
function getAdjacent() {
  return http.get<ResultData<ItaDto.Adjacent[]>>(`${prefix}/adjacent`)
}

function getIndustryStatusTemp(params: any): Promise<object> {
  return new Promise<object>((resolve) => {
    setTimeout(() => {
      switch (params.type) {
        case '선도산업':
          resolve({
            image: 'BASIC_LOC_CHAR_DENSITY_1',
          })
          break
        case '신흥산업':
          resolve({
            image: 'BASIC_LOC_CHAR_DENSITY_2',
          })
          break
        case '쇠퇴산업':
          resolve({
            image: 'BASIC_LOC_CHAR_DENSITY_3',
          })
          break
        case '초기반산업':
          resolve({
            image: 'BASIC_LOC_CHAR_DENSITY_4',
          })
          break
      }
    }, 10)
  })
}

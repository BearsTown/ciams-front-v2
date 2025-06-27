import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'
import {
  IndustryArea,
  IndustryStatus,
  ItaData,
  ItaResultData,
} from '@/api/app/menu-1/sub-1/tab-c/model'

const prefix = '/api/v1/1-1-3'

export function getItaDatas(sggCd: string) {
  return http.get<ResultData<ItaData[]>>(`${prefix}/ita/${sggCd}`)
}

export function getIndustryAreas() {
  return http.get<ResultData<IndustryArea[]>>(`${prefix}/areas`)
}

export function getItaResultDatas(sggCd: string) {
  return http.get<ResultData<ItaResultData[]>>(`${prefix}/ita/result/${sggCd}`)
}

export function getIndustryStatus(params: IndustryStatus.Find.Params) {
  return http.post<ResultData<IndustryStatus.Find.Result>>(`${prefix}/ita/status`, params)
}

export function getIndustryStatusTemp(params: IndustryStatus.Find.Params): Promise<object> {
  return new Promise<object>((resolve) => {
    setTimeout(() => {
      switch (params.type) {
        case '선도산업':
          resolve({
            image: '55f9be97-cc9a-4e66-9896-52d2d84c5251',
            memo: [
              '김천시의 선도산업은 전체 38개 중 제조업이 23개이며, 제조업 관련 서비스업이 15개 업종으로 합성고무  및 플라스틱 물질 제조업, 플라스틱제품 제조업, 전구 및 조명장치 제조업, 전기업은 전반적으로 지수가 높고, 종사자수가 많은 업종으로 확인됨',
              '종사자수가 많은 제조업 선도산업은 현대모비스, 코오롱인더스트리,  두산전자 등이 있으며, 제조업 관련 서비스업에는 한국도로공사, 아모레퍼시픽 물류센터가 있음',
            ],
          })
          break
        case '신흥산업':
          resolve({
            image: 'ce6de25a-1183-4993-b8bb-6075aa84ffff',
            memo: [
              '김천시의 신흥산업은 전체 44개 중 제조업이 17개이며, 제조업 관련 서비스업이 27개 업종이며, 고용성장률과 지역할당 효과가 높은 제조업종은 직물직조 및 직물제품 제조업, 1차 비철금속 제조업, 구조용 금속제품, 탱크 및 증기발생기 제조업, 기타 금속 가공제품 제조업, 반도체 제조업 등 이며, ',
              '종사자수가 많은 제조업 신흥산업은 제조업에 오리온테크놀리지, 위드시스템, 지텍 등이 있으며, 제조업 관련 서비스업에는 삼성웰스토리FS, 대한법률구조공단 등이 있음',
            ],
          })
          break
        case '쇠퇴산업':
          resolve({
            image: '425cb4e2-4be5-4f44-b9f6-6166c9cd4a6c',
            memo: [
              '김천시의 쇠퇴산업은 전체 34개 중 제조업이 21개이며, 제조업 관련 서비스업이 13개 업종이며, 고용성장률과 지역할당효과가 낮은 업종에는 방적 및 가공사 제조업, 가죽, 가방 및 유사제품 제조업, 비료, 농약 및 살균, 살충제 제조업, 컴퓨터 및 주변장치 제조업, 측정, 시험, 항해, 제어 및 기타 정밀기기 제조업 등 이며,',
              '종사자수가 많은 쇠퇴산업은 한국오웬스코닝, 케이티앤지김천공장, 코오롱생명과학 김천2공장 등이 있음',
            ],
          })
          break
        case '초기반산업':
          resolve({
            image: '69566077-c24e-4c53-84d2-96a49505e97d',
            memo: [
              '김천시의 초기반산업은 전체 23개 중 제조업 20개, 제조업 관련 서비스업이 3개 업종이며, LQ지수가 높은 업종에는 담배제조업, 화학섬유 제조업, 철도장비 제조업, 전구 및 조명장치 제조업 등이 있으며, 현재 김천시 산업을 이끌어가고 있는 주요 업종임',
              '종사자수가 많은 제조업 초기반산업은 현대모비스, 유한킴벌리, 에스에이테크, 코오롱인더스트리 등이 있으며, 제조업 관련 서비스업에는 한국도로공사가 있음',
            ],
          })
          break
      }
    }, 100)
  })
}

import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { Menu2ZoneDetailsDto } from '@/api/app/menu-2/model'

const prefix = '/api/v1/menu-2/sub-1'

export function getMenu1_2_3(params: object) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<Menu2ZoneDetailsDto.Overview.Find.Result>>(
    `${prefix}/todo`,
    config,
  )
}

// export function getDataGroups(parentId: number) {
//   return http.get<ResultData<any[]>>(`${prefix}/group/${parentId}`)
// }

export async function test_getMenu1_2_3(parentId: number): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 11,
          name: '업종별',
          priority: 1,
          // years: ['2011', '2016', '2021'],

          groupColumn: 'CLS1',
          useNoneColumn: false,
          chartAxis: 'X',
        },
        {
          id: 12,
          name: '종자사 규모별',
          priority: 2,
          // years: ['2011', '2021'],

          groupColumn: 'EMP',
          useNoneColumn: true,
          chartAxis: 'X',
        },
        {
          id: '제조업 및 관련 서비스업 현황',
          name: '제조업 및 관련 서비스업',
          priority: 3,
          // years: ['2011', '2016', '2021'],

          // active: false,
        },
      ])
    }, 100)
  })
}

// export function getDataConfig(dataGroupId: number) {
//   return http.get<ResultData<object>>(`${prefix}/config/${dataGroupId}`)
// }

export async function test_getAttributes(parentId: number): Promise<object> {
  // return new Promise<any[]>((resolve) => {
  return new Promise<object>((resolve) => {
    setTimeout(() => {
      resolve({
        attributes: [
          {
            name: 'CLS1',
            label: '사업체',
            unit: '개소',
            useRatio: true,
            aggType: 'COUNT',
            seriesType: 'bar',
          },
          {
            name: 'EMP',
            label: '종사자',
            unit: '명',
            useRatio: true,
            aggType: 'SUM',
            seriesType: 'line',
          },
        ],
        years: [
          {
            year: '2011',
            priority: 1,
            layerName: 'CIAMS_INDUSTRY_2011',
          },
          {
            year: '2016',
            priority: 2,
            layerName: 'CIAMS_INDUSTRY_2016',
          },
          {
            year: '2021',
            priority: 3,
            layerName: 'CIAMS_INDUSTRY_2021',
          },
        ],
        columns: [
          {
            name: 'C',
            shorts: 'C',
            label: '제조업',
            color: '#7bc142',
          },
          {
            name: 'G',
            shorts: 'G',
            label: '도매 및 소매업',
            color: '#faaa1c',
          },
          {
            name: 'H',
            shorts: 'H',
            label: '운수 및 창고업',
            color: '#7b88c2',
          },
          {
            name: 'F',
            shorts: 'F',
            label: '건설업',
            color: '#d6cfcc',
          },
          {
            name: 'N',
            shorts: 'N',
            label: '사업시설 관리, 사업 지원 및 임대 서비스업',
            color: '#d6cfcc',
          },
          {
            name: 'S',
            shorts: 'S',
            label: '협회 및 단체, 수리 및 기타 개인 서비스업',
            color: '#d6cfcc',
          },
          {
            name: 'other',
            shorts: '기타',
            label: '기타',
            color: '#d6cfcc',
          },
        ],
      })

      // resolve([
      //   {
      //     name: 'CLS1',
      //     label: '사업체',
      //     unit: '개소',
      //     useRatio: true,
      //     aggType: 'COUNT',
      //     seriesType: 'bar',
      //   },
      //   {
      //     name: 'EMP',
      //     label: '종사자',
      //     unit: '명',
      //     useRatio: true,
      //     aggType: 'SUM',
      //     seriesType: 'line',
      //   },
      // ])
    }, 100)
  })
}

export async function test_getMenu1_2_3Data(id: number): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (id === 11) {
        resolve([
          {
            name: 'C',
            shorts: 'C',
            label: '제조업',
            color: '#7bc142',
          },
          {
            name: 'G',
            shorts: 'G',
            label: '도매 및 소매업',
            color: '#faaa1c',
          },
          {
            name: 'H',
            shorts: 'H',
            label: '운수 및 창고업',
            color: '#7b88c2',
          },
          {
            name: 'F',
            shorts: 'F',
            label: '건설업',
            color: '#d6cfcc',
          },
          {
            name: 'N',
            shorts: 'N',
            label: '사업시설 관리, 사업 지원 및 임대 서비스업',
            color: '#d6cfcc',
          },
          {
            name: 'S',
            shorts: 'S',
            label: '협회 및 단체, 수리 및 기타 개인 서비스업',
            color: '#d6cfcc',
          },
          {
            name: 'other',
            shorts: '기타',
            label: '기타',
            color: '#d6cfcc',
          },
        ])
      } else if (id === 12) {
        resolve([
          {
            name: '5명 미만',
            shorts: '5명 미만',
            label: '5명 미만',
            color: '#7bc142',
            start: 0,
            end: 4,
            useRange: true,
          },
          {
            name: '5~9명',
            shorts: '5~9명',
            label: '5~9명',
            color: '#d6cfcc',
            start: 5,
            end: 9,
            useRange: true,
          },
          {
            name: '10~19명',
            shorts: '10~19명',
            label: '10~19명',
            color: '#d6cfcc',
            start: 10,
            end: 19,
            useRange: true,
          },
          {
            name: '20~99명',
            shorts: '20~99명',
            label: '20~99명',
            color: '#d6cfcc',
            start: 20,
            end: 99,
            useRange: true,
          },
          {
            name: '100~299명',
            shorts: '100~299명',
            label: '100~299명',
            color: '#d6cfcc',
            start: 100,
            end: 299,
            useRange: true,
          },
          {
            name: '300명 이상',
            shorts: '300명 이상',
            label: '300명 이상',
            color: '#d6cfcc',
            start: 300,
            end: 100000,
            useRange: true,
          },
        ])
      }
    }, 100)
  })
}

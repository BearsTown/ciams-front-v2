import { ResultData } from '@/api/app/model'
import { AxiosHeaders } from 'axios'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/status'

export async function test_getMenu1_1_1Data(): Promise<ResultData<any[]>> {
  return new Promise<ResultData<any[]>>((resolve) => {
    setTimeout(() => {
      const data: ResultData<any[]> = {
        data: [
          {
            id: 1,
            parentId: null,
            title: '토지',
            priority: 1,
            children: [
              {
                id: 5,
                parentId: 1,
                title: '공업지역 면적',
                priority: 1,
              },
            ],
          },
          {
            id: 2,
            parentId: null,
            title: '인구',
            priority: 2,
            children: [
              {
                id: 6,
                parentId: 2,
                title: '읍면동별 인구',
                priority: 1,
              },
              {
                id: 7,
                parentId: 2,
                title: '읍면동별 세대수',
                priority: 2,
              },
              {
                id: 8,
                parentId: 2,
                title: '구성원별 가구',
                priority: 3,
              },
            ],
          },
          {
            id: 3,
            parentId: null,
            title: '경제',
            priority: 3,
            children: [
              {
                id: 9,
                parentId: 3,
                title: '경제활동인구',
                priority: 1,
              },
              {
                id: 10,
                parentId: 3,
                title: '지역총생산',
                priority: 2,
              },
              {
                id: 11,
                parentId: 3,
                title: '업종별 부가가치',
                priority: 3,
              },
              {
                id: 12,
                parentId: 3,
                title: '업종별 출하액',
                priority: 4,
              },
            ],
          },
          {
            id: 4,
            parentId: null,
            title: '산업',
            priority: 4,
            children: [
              {
                id: 13,
                parentId: 4,
                title: '읍면동별 사업체',
                priority: 1,
              },
              {
                id: 14,
                parentId: 4,
                title: '읍면동별 종사자',
                priority: 2,
              },
              {
                id: 15,
                parentId: 4,
                title: '산업별 사업체',
                priority: 3,
              },
              {
                id: 16,
                parentId: 4,
                title: '산업별 종사자',
                priority: 4,
              },
              {
                id: 17,
                parentId: 4,
                title: '종사자 규모별 사업체',
                priority: 5,
              },
              {
                id: 18,
                parentId: 4,
                title: '종사자 규모별 종사자',
                priority: 6,
              },
            ],
          },
        ],
        msg: '',
        status: '',
        headers: {} as AxiosHeaders,
      }
      resolve(data)
    }, 100)
  })
}

export async function test_getMenu1_1_1Data2(): Promise<ResultData<any[]>> {
  return new Promise<ResultData<any[]>>((resolve) => {
    setTimeout(() => {
      const data: ResultData<any[]> = {
        data: [
          {
            id: 1,
            parentId: null,
            title: '토지',
            priority: 1,
            children: [
              {
                id: 5,
                parentId: 1,
                title: '공업지역 면적',
                priority: 1,
              },
            ],
          },
          {
            id: 2,
            parentId: null,
            title: '인구',
            priority: 2,
            children: [
              {
                id: 6,
                parentId: 2,
                title: '읍면동별 인구',
                priority: 1,
              },
              {
                id: 7,
                parentId: 2,
                title: '읍면동별 세대수',
                priority: 2,
              },
            ],
          },
        ],
        msg: '',
        status: '',
        headers: {} as AxiosHeaders,
      }
      resolve(data)
    }, 100)
  })
}

export function getStatusTree() {
  return http.get<ResultData<any[]>>(`${prefix}/tree`)
}

// export function getStatusGroups(statusId: number) {
//   return http.get<ResultData<any[]>>(`${prefix}/group/${statusId}`)
// }

export function getStatusInfo(statusId: number) {
  return http.get<ResultData<any>>(`${prefix}/group/${statusId}`)
}

export function getDataInfo(dataId: number) {
  return http.get<ResultData<object>>(`${prefix}/${dataId}/info`)
}

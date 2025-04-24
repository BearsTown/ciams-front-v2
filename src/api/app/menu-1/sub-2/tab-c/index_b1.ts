import { AxiosRequestConfig } from 'axios'

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { CiamsMenu2Sub1DetailsDto } from '@/api/app/menu-2/sub-1/model'

const prefix = '/api/v1/menu-2/sub-1'

export function getMenu1_2_3(params: object) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<CiamsMenu2Sub1DetailsDto.Overview.Find.Result>>(
    `${prefix}/todo`,
    config,
  )
}

export async function test_getAttributes(): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: 'attr1',
          label: '사업체',
          unit: '개소',
          useRatio: true,
        },
        {
          name: 'attr2',
          label: '종사자',
          unit: '명',
          useRatio: true,
        },
      ])
    }, 100)
  })
}

export async function test_getAttributes2(): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: 'attr1',
          label: '면적',
          unit: 'm2',
          useRatio: true,
        },
        {
          name: 'attr2',
          label: '필지',
          unit: '개',
          useRatio: true,
        },
      ])
    }, 300)
  })
}

export async function test_getMenu1_2_3(): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '업종별 현황',
          title: '업종별',
          priority: 1,
          years: ['2011', '2016', '2021'],

          active: false,
        },
        {
          id: '종자사 규모별 현황',
          title: '종자사 규모별',
          priority: 2,
          years: ['2011', '2021'],

          active: false,
        },
        {
          id: '제조업 및 관련 서비스업 현황',
          title: '제조업 및 관련 서비스업',
          priority: 3,
          years: ['2011', '2016', '2021'],

          active: false,
        },
      ])
    }, 300)
  })
}

export async function test_getMenu1_2_3Data(): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: 'C',
          label: '제조업',
          color: '#7bc142',
          data: {
            attr1: 181,
            attr2: 7717,
          },
        },
        {
          name: 'G',
          label: '도매 및 소매업',
          color: '#faaa1c',
          data: {
            attr1: 69,
            attr2: 227,
          },
        },
        {
          name: 'H',
          label: '운수 및 창고업',
          color: '#7b88c2',
          data: {
            attr1: 51,
            attr2: 499,
          },
        },
        {
          name: 'N',
          label: '테스트업',
          color: '#7b88c2',
          data: {
            attr1: 13,
            attr2: 377,
          },
        },
        {
          name: '기타',
          label: '기타',
          color: '#d6cfcc',
          data: {
            attr1: 25,
            attr2: 95,
          },
        },
      ])
    }, 300)
  })
}

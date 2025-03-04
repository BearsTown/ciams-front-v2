import { AxiosRequestConfig } from 'axios'

import type PlanContentLink from '@/api/app/planContentLink/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/plan/contentLink'

export function planContentLinkSelect(obj: PlanContentLink.Select) {
  return http.get<ResultData<PlanContentLink.Model[]>>(`${prefix}`, {
    params: obj,
  })
}

export function planContentLinkAdd(obj: PlanContentLink.Add) {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return http.post<ResultData<object>>(`${prefix}`, JSON.stringify(obj), config)
}

export function planContentLinkAddArea(planContentId: string) {
  return http.post<ResultData<object>>(`${prefix}/addArea/${planContentId}`)
}

export function planContentLinkDelete(planContentLinkId: string, planContentId: string) {
  return http.delete<ResultData<object>>(`${prefix}/${planContentLinkId}/${planContentId}`)
}

export function changePriority(obj: PlanContentLink.Model[]) {
  return http.put<ResultData<object>>(`${prefix}`, obj)
}

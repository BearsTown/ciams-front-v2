import { AxiosRequestConfig } from 'axios'

import type PlanContent from '@/api/app/planContent/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'

const prefix = '/api/v1/plan/content'

export function planContentList(params: PlanContent.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<PlanContent.Search.Row[]>>(`${prefix}/list`, config)
}

export function planContentAreaList(params: PlanContent.Search.Params) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<PlanContent.Search.Row[]>>(`${prefix}/area/list`, config)
}

export function planContentAdd(obj: PlanContent.Add) {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
  return http.post<ResultData<object>>(`${prefix}/detail`, obj, config)
}

export function planContentModify(obj: PlanContent.Mod) {

  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }
  return http.put<ResultData<object>>(`${prefix}/`, obj, config)
}

export function planContentDelete(type: 'all' | 'planContent' | 'planContentDetail', id?: string) {
  return http.delete<ResultData<object>>(`${prefix}/${type}/${id}`)
}

export function changePriority(obj: PlanContent.Priority[]) {
  return http.put<ResultData<object>>(`${prefix}/priority`, obj)
}

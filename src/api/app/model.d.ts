import { AxiosHeaders } from 'axios/index'

export interface PageReq {
  size?: number
  pageNo?: number
}

export interface PageRes extends PageReq {
  start: number
  end: number
  totalCount: number
}

export interface ResultData<T> {
  data: T
  msg: string
  status: string
  headers: AxiosHeaders
}

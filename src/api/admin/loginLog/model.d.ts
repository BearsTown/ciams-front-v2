import { PageReq, PageRes } from '@/api/app/model'

namespace LoginLog {
  export interface Param {
    startDate: string
    endDate: string
    pageInfo?: PageRes
  }
  export interface Row {
    rn: number
    loginId: string
    ip: string
    loginDate: string
  }
  export interface Group {
    day: string
    cnt: number
  }
  export interface Result {
    page: PageRes
    list: Row[]
    group: Group[]
  }
}

export default LoginLog

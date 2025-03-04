import { PageReq, PageRes } from '@/api/app/model'
import { FileDto } from '@/api/app/file/model'

namespace PlanContetLink {
  export interface Model {
    // 성장관리계획 운영 컨텐츠 링크_고유번호
    planContentLinkId?: string
    // 성장관리계획 운영 컨텐츠_고유번호
    planContentId: string
    // 정렬순번
    sortSn: number
  }

  export interface Add {
    sortSn: number
    planContentLinkId?: string
    planContentIds: string[]
    //ciams_plan_area_link Update 용도
    planAreaId: string
    ver: string
  }

  export interface Select {
    // 성장관리계획 운영 컨텐츠 링크_고유번호
    planContentLinkId?: string
    // 성장관리계획 운영 컨텐츠_고유번호
    planContentId?: string
  }
}

export default PlanContetLink

import { PageReq, PageRes } from '@/api/app/model'
import { FileDto } from '@/api/app/file/model'

namespace PlanContent {
  export interface PlanContetDetailModel {
    // 성장관리계획 운영 컨텐츠 디테일_고유번호
    planContentDetailId?: string
    // 성장관리계획 운영 컨텐츠_고유번호
    planContentId: string
    // 타입분류 (권장용도, 허용용도, 불허용도)
    typeName: string
    // 내용
    contents: string
    // 정렬순번
    sortSn: number
  }

  export interface PlanContentModel {
    planContentId?: string
    // 탭분류 (INFRA - 기반시설계획, BUILDINGUSE - 건축물 용도계획, ENVIRONMENT - 환경관리계획)
    category: 'INFRA' | 'BUILDINGUSE' | 'ENVIRONMENT' | string
    // 제목
    title: string
    // 펼침 여부
    isOpen: boolean
    // 도로계획 여부
    isRoadPlan: boolean
    // 용도종류선택 여부
    isType: boolean
  }

  export interface Add extends PlanContentModel {
    detailList?: PlanContetDetailModel | { newFileList: FileDto.file[] }[]
  }

  export interface Mod extends PlanContentModel {
    detailList?: PlanContetDetailModel | { newFileList: FileDto.file[]; delFileList: string[] }[]
  }

  export interface Delete {
    planContentId?: string
    planContentDetailId?: string
  }

  namespace Search {
    export interface Params {
      // planContentLinkId?: string
      planId?: string
      planAreaId?: string
      category?: string
    }

    export interface Row extends PlanContentModel {
      planContentLinkId?: string
      // 성장관리구역고유번호
      planAreaId: string

      detailList: PlanContetDetailModel | { fileList: FileDto.file[] }[]
    }

    export interface Result {
      list: Row[]
    }
  }

  export interface Priority {
    planContentLinkId: string
    planContentId: string
    sortSn: number
  }
}

export default PlanContent

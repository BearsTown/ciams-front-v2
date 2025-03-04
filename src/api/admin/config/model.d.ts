import { File } from '@/api/app/file/model'

namespace Config {
  export interface Result {
    id: string
    confName: string
    confValue: string
    confType: string
    used: boolean
    confValueType: string
    confDesc: string
    regDate: string
    chgDate: string

    attachFile: File
  }
}

export default Config

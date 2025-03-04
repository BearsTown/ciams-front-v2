import { File } from '@/api/app/file/model'

namespace Config {
  export interface Find {
    id?: string
    confName?: string
    confType: string
    used?: boolean
  }

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

    attachFile?: File
  }
}

export default Config

// export type ConfigObject = Omit<Result, 'id'>
export type ConfigObject = { [key: string]: Omit<Result, 'id'> }

import { PageReq, PageRes } from '@/api/app/model'

namespace User {
  export interface Add {
    id: string
    name: string
    email: string
    password: string
  }

  export interface PwdChange {
    loginId: string
    curPassword: string
    newPassword: string
  }

  export interface Find extends PageReq {
    keyword?: string
    roleYn?: string
    lock?: boolean
  }

  export interface User {
    userId: string
    userName: string
    userRole: string
    roleYn: boolean
    lock: boolean
    // etc...
  }

  export interface Users {
    list: User[]
    page: PageRes
  }
}

export default User

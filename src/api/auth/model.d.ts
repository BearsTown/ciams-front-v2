namespace Token {
  export interface Req {
    username: string
    password: string | false
    grant_type: string
  }

  export interface Res {
    token_type: string
    access_token: string
    refresh_token: string
  }

  export interface Ref {
    grant_type: string
    refresh_token: string | null
  }

  export interface Check {
    user_name: string
    authorities: { authority: string }[]
  }
}

export interface ResultData<T> {
  data: T
  msg: string
  status: string
}

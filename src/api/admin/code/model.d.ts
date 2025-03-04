namespace CiamsCode {
  export interface Code {
    code: string
    parentCode: string | null
    codeName: string
    sortSn: number
    codeVal: string
    codeDesc: string
    useYn: 'Y' | 'N'
  }

  export interface Find extends Code {
    leaf: boolean
    children?: Code[]
  }
}

export default CiamsCode

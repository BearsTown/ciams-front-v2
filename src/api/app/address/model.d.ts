namespace PNU {
  export interface Info {
    pnu: string
    address1: string
    address2: string
    address3: string
    attribute: Attribute[]
  }

  export interface Attribute extends Address {
    sidoCd: string
    sidoNm: string
    bonbun: string
    bubun: string
    parcelType: string
    parcelName: string
  }

  export interface Address {
    sggCd: string
    sggNm: string
    emdCd: string
    emdNm: string
    riCd: string
    riNm: string
  }

  namespace Search {
    namespace Params {
      export interface RI {
        emdCd: string
      }
    }

    export interface Result {
      codeName: string
      codeValue: string
    }
  }
}

declare namespace Kgeo {
  export interface Response {
    code: number
    message: string
    result: object
  }

  export type UnionMap = {
    SV0000000136: Result.SV0000000136
    SV0000000155: Result.SV0000000155
    SV0000000167: Result.SV0000000167
  }

  namespace Result {
    export interface SV0000000136 {
      administzoneCode: string // 행정구역코드
      ladLocplcCode: string // 토지소재지코드
      regstrSeCode: string // 대장구분코드
      lnmMnnm: string // 지번본번
      lnmSlno: string // 지번부번
      lndcgrCode: string // 지목코드
      lndcgrCodeNm: string // 지목코드명
      lndpclAr: number // 필지면적
      gradCode: string // 토지등급
      gradChangeDe: string // 등급변동일자
      ladMvmnDe: string // 토지이동일자
      ladMvmnResnCode: string // 토지이동사유코드
      ladMvmnResnCodeNm: string // 토지이동사유코드명
      regstrCmprsnSeCode: string // 대장대조구분코드
      bsefSttemntSeCode: string // 사업시행신고구분
      bsefSttemntSeCodeNm: string // 사업시행신고구분명
      drwSeCode: string // 도해/수치구분
      ladLastHistSn: string // 토지최종연혁순번
      ownshipLastHistSn: string // 소유권최종연혁순번
      ownerNm: string // 소유자명
      ownerRegno: string // 소유자등록번호
      posesnTyCode: string // 소유유형구분코드
      posesnTyCodeNm: string // 소유유형구분코드명
      pblonsipNmprCo: number // 공유인원수
      ownerAdres: string // 소유자주소
      ownshipChgcsCode: string // 소유권변동원인코드
      ownshipChgcsCodeNm: string // 소유권변동원인코드명
      ownshipChangeDe: string // 소유권변동일자
      scCode: string // 축척코드
      scCodeNm: string // 축척코드명
      mno: string // 도호
      stdrYearMt: string // 공시지가기준년월
      indvdlzPblntfPclnd: number // 개별공시지가
      lastLnm: string // 최종지번
      msbrRegstrLastSlno: string // 본번의최종부번
      lastLnmMnnm: string // 최종지번의본번
      lastLnmSlno: string // 최종지번의부번
      ladMvmnChargerId: string // 토지이동담당자ID
      ownshipChangerId: string // 소유권변경자ID
      buldIdno: string // 건물식별번호
      relateLnm: string // 관련지번
    }

    export type SV0000000155 = SV0000000155Node[]

    interface SV0000000155Node {
      crtrYear: number // 기준년도
      crtrMm: number // 기준월
      indivOalp: number // 개별공시지가
      pblntfYmd: string // 공시일자
      etcCn: string // 기타내용
    }

    export interface SV0000000167 {
      header: Header
      base: Base
      legend: Legend[]
    }

    interface Header {
      code: string
      message: string
    }

    interface Base {
      confmTyCode: string // 승인유형코드
      ladLocplcCodeNm: string // 토지소재지코드명
      lnm: string // 지번
      lndpclAr: string // 필지면적
      lndcgrCode: string // 지목코드
      lndcgrCodeNm: string // 지목코드명
      ladUsePlanLawA: string // 국토의 계획 및 이용
      ladUsePlanLawB: string // 타법령에 따른 지역/지구
      ladUsePlanLawC: string // 추가기재확인
      ladUsePlanLawD: string // 토지이용규제
      scCode: string // 축척코드
      drwImage: string // 도면이미지
    }

    interface Legend {
      lgdNm: string // 범례명
      lgdImage: string // 범례이미지
    }
  }
}

export default Kgeo

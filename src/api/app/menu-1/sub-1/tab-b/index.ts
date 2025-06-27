const prefix = '/api/v1/menu-1/sub-1'

export async function test_getMenu1_1_2_4(type: number): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (type === 1) {
        resolve([
          {
            code: 'C',
            codeName: '제조업',
            corpCnt1: 1278,
            corpCnt2: 202,
            corpCnt3: 69,
          },
          {
            code: 'D',
            codeName: '전기, 가스, 증기 및 공기조절 공급업',
            corpCnt1: 1110,
            corpCnt2: 8,
            corpCnt3: 1,
          },
          {
            code: 'E',
            codeName: '수도, 하수 및 폐기물 처리, 원료 재생업',
            corpCnt1: 38,
            corpCnt2: 1,
            corpCnt3: 1,
          },
          {
            code: 'F',
            codeName: '건설업',
            corpCnt1: 191,
            corpCnt2: 4,
            corpCnt3: 2,
          },
          {
            code: 'G',
            codeName: '도매 및 소매업',
            corpCnt1: 3475,
            corpCnt2: 75,
            corpCnt3: 41,
          },
          {
            code: 'H',
            codeName: '운수 및 창고업',
            corpCnt1: 1169,
            corpCnt2: 54,
            corpCnt3: 20,
          },
          {
            code: 'J',
            codeName: '정보통신업',
            corpCnt1: 56,
          },
          {
            code: 'M',
            codeName: '전문, 과학 및 기술 서비스업',
            corpCnt1: 137,
            corpCnt2: 4,
          },
          {
            code: 'N',
            codeName: '사업시설 관리, 사업 지원 및 임대 서비스업',
            corpCnt1: 162,
            corpCnt2: 14,
            corpCnt3: 7,
          },
          {
            code: 'P',
            codeName: '교육 서비스업',
            corpCnt1: 32,
          },
          {
            code: 'Q',
            codeName: '보건업 및 사회복지 서비스업',
            corpCnt1: 138,
          },
          {
            code: 'S',
            codeName: '협회 및 단체, 수리 및 기타 개인 서비스업',
            corpCnt1: 221,
            corpCnt2: 13,
            corpCnt3: 11,
          },
        ])
      } else if (type === 2) {
        resolve([
          {
            code: 'C',
            codeName: '제조업',
            workerCnt1: 13986,
            workerCnt2: 8045,
            workerCnt3: 4555,
          },
          {
            code: 'D',
            codeName: '전기, 가스, 증기 및 공기조절 공급업',
            workerCnt1: 1241,
            workerCnt2: 20,
            workerCnt3: 13,
          },
          {
            code: 'E',
            codeName: '수도, 하수 및 폐기물 처리, 원료 재생업',
            workerCnt1: 228,
            workerCnt2: 9,
            workerCnt3: 9,
          },
          {
            code: 'F',
            codeName: '건설업',
            workerCnt1: 1058,
            workerCnt2: 14,
            workerCnt3: 3,
          },
          {
            code: 'G',
            codeName: '도매 및 소매업',
            workerCnt1: 7066,
            workerCnt2: 239,
            workerCnt3: 152,
          },
          {
            code: 'H',
            codeName: '운수 및 창고업',
            workerCnt1: 3396,
            workerCnt2: 502,
            workerCnt3: 124,
          },
          {
            code: 'J',
            codeName: '정보통신업',
            workerCnt1: 239,
          },
          {
            code: 'M',
            codeName: '전문, 과학 및 기술 서비스업',
            workerCnt1: 537,
            workerCnt2: 24,
          },
          {
            code: 'N',
            codeName: '사업시설 관리, 사업 지원 및 임대 서비스업',
            workerCnt1: 1078,
            workerCnt2: 378,
            workerCnt3: 67,
          },
          {
            code: 'P',
            codeName: '교육 서비스업',
            workerCnt1: 86,
          },
          {
            code: 'Q',
            codeName: '보건업 및 사회복지 서비스업',
            workerCnt1: 1989,
          },
          {
            code: 'S',
            codeName: '협회 및 단체, 수리 및 기타 개인 서비스업',
            workerCnt1: 452,
            workerCnt2: 58,
            workerCnt3: 55,
          },
        ])
      }
    }, 100)
  })
}

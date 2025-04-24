const prefix = '/api/v1/menu-1/sub-1'

export async function test_getMenu1_2_5Data(type: number): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (type === 1) {
        resolve([
          {
            name: '김천시',
            area: 1005.43,
            corpCnt: 1278,
            empCnt: 13986,
            density: 0.14,
          },
          {
            name: '공업지역',
            area: 6.43,
            corpCnt: 202,
            empCnt: 8045,
            density: 12.51,
          },
          {
            name: '도시공업지역',
            area: 2.64,
            corpCnt: 69,
            empCnt: 4555,
            density: 17.26,
          },
        ])
      } else if (type === 2) {
        resolve([])
      }
    }, 100)
  })
}

export async function test_getMenu1_1_2_5(type: number): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (type === 1) {
        resolve([
          {
            code: 'C10',
            codeName: '식료품',
            corpCnt1: 1599,
            corpCnt2: 657,
            corpCnt3: 359,
          },
          {
            code: 'C11',
            codeName: '음료',
            corpCnt1: 25,
          },
          {
            code: 'C12',
            codeName: '담배',
            corpCnt1: 159,
            corpCnt2: 159,
            corpCnt3: 159,
          },
          {
            code: 'C13',
            codeName: '섬유제품(의복 제외)',
            corpCnt1: 352,
            corpCnt2: 134,
          },
          {
            code: 'C14',
            codeName: '의복, 의복액세서리 및 모피제품',
            corpCnt1: 144,
            corpCnt2: 59,
          },
          {
            code: 'C15',
            codeName: '가죽, 가방 및 신발',
            corpCnt1: 10,
          },
          {
            code: 'C16',
            codeName: '목재 및 나무제품(가구 제외)',
            corpCnt1: 122,
            corpCnt2: 10,
          },
          {
            code: 'C17',
            codeName: '펄프, 종이 및 종이제품',
            corpCnt1: 767,
            corpCnt2: 674,
            corpCnt3: 529,
          },
          {
            code: 'C18',
            codeName: '인쇄 및 기록매체 복제업',
            corpCnt1: 49,
            corpCnt2: 1,
          },
          {
            code: 'C19',
            codeName: '코크스, 연탄 및 석유정제품',
            corpCnt1: 7,
            corpCnt2: 7,
            corpCnt3: 7,
          },
          {
            code: 'C20',
            codeName: '화학물질 및 화학제품(의약품 제외)',
            corpCnt1: 1708,
            corpCnt2: 1494,
            corpCnt3: 887,
          },
          {
            code: 'C21',
            codeName: '의료용 물질 및 의약품',
            corpCnt1: 10,
          },
          {
            code: 'C22',
            codeName: '고무 및 플라스틱제품',
            corpCnt1: 1468,
            corpCnt2: 772,
            corpCnt3: 503,
          },
          {
            code: 'C23',
            codeName: '비금속 광물제품',
            corpCnt1: 996,
            corpCnt2: 554,
            corpCnt3: 269,
          },
          {
            code: 'C24',
            codeName: '1차 금속',
            corpCnt1: 364,
            corpCnt2: 84,
            corpCnt3: 9,
          },
          {
            code: 'C25',
            codeName: '금속가공제품(기계 및 가구 제외)',
            corpCnt1: 708,
            corpCnt2: 97,
            corpCnt3: 15,
          },
          {
            code: 'C26',
            codeName: '전자부품, 컴퓨터, 영상, 음향 및 통신장비',
            corpCnt1: 1215,
            corpCnt2: 595,
            corpCnt3: 316,
          },
          {
            code: 'C27',
            codeName: '의료, 정밀, 광학기기 및 시계',
            corpCnt1: 128,
            corpCnt2: 9,
          },
          {
            code: 'C28',
            codeName: '전기장비',
            corpCnt1: 1498,
            corpCnt2: 1110,
            corpCnt3: 749,
          },
          {
            code: 'C29',
            codeName: '기타 기계 및 장비',
            corpCnt1: 486,
            corpCnt2: 92,
            corpCnt3: 3,
          },
          {
            code: 'C30',
            codeName: '자동차 및 트레일러',
            corpCnt1: 1503,
            corpCnt2: 1309,
            corpCnt3: 631,
          },
          {
            code: 'C31',
            codeName: '기타 운송장비',
            corpCnt1: 261,
            corpCnt2: 110,
            corpCnt3: 1,
          },
          {
            code: 'C32',
            codeName: '가구',
            corpCnt1: 40,
          },
          {
            code: 'C33',
            codeName: '기타 제품',
            corpCnt1: 205,
            corpCnt2: 65,
            corpCnt3: 65,
          },
          {
            code: 'C34',
            codeName: '산업용 기계 및 장비 수리업',
            corpCnt1: 162,
            corpCnt2: 53,
            corpCnt3: 53,
          },
        ])
      } else if (type === 2) {
        resolve([
          {
            code: 'C10',
            codeName: '식료품',
            empCnt1: 1599,
            empCnt2: 657,
            empCnt3: 359,
          },
          {
            code: 'C11',
            codeName: '음료',
            empCnt1: 25,
          },
          {
            code: 'C12',
            codeName: '담배',
            empCnt1: 159,
            empCnt2: 159,
            empCnt3: 159,
          },
          {
            code: 'C13',
            codeName: '섬유제품(의복 제외)',
            empCnt1: 352,
            empCnt2: 134,
          },
          {
            code: 'C14',
            codeName: '의복, 의복액세서리 및 모피제품',
            empCnt1: 144,
            empCnt2: 59,
          },
          {
            code: 'C15',
            codeName: '가죽, 가방 및 신발',
            empCnt1: 10,
          },
          {
            code: 'C16',
            codeName: '목재 및 나무제품(가구 제외)',
            empCnt1: 122,
            empCnt2: 10,
          },
          {
            code: 'C17',
            codeName: '펄프, 종이 및 종이제품',
            empCnt1: 767,
            empCnt2: 674,
            empCnt3: 529,
          },
          {
            code: 'C18',
            codeName: '인쇄 및 기록매체 복제업',
            empCnt1: 49,
            empCnt2: 1,
          },
          {
            code: 'C19',
            codeName: '코크스, 연탄 및 석유정제품',
            empCnt1: 7,
            empCnt2: 7,
            empCnt3: 7,
          },
          {
            code: 'C20',
            codeName: '화학물질 및 화학제품(의약품 제외)',
            empCnt1: 1708,
            empCnt2: 1494,
            empCnt3: 887,
          },
          {
            code: 'C21',
            codeName: '의료용 물질 및 의약품',
            empCnt1: 10,
          },
          {
            code: 'C22',
            codeName: '고무 및 플라스틱제품',
            empCnt1: 1468,
            empCnt2: 772,
            empCnt3: 503,
          },
          {
            code: 'C23',
            codeName: '비금속 광물제품',
            empCnt1: 996,
            empCnt2: 554,
            empCnt3: 269,
          },
          {
            code: 'C24',
            codeName: '1차 금속',
            empCnt1: 364,
            empCnt2: 84,
            empCnt3: 9,
          },
          {
            code: 'C25',
            codeName: '금속가공제품(기계 및 가구 제외)',
            empCnt1: 708,
            empCnt2: 97,
            empCnt3: 15,
          },
          {
            code: 'C26',
            codeName: '전자부품, 컴퓨터, 영상, 음향 및 통신장비',
            empCnt1: 1215,
            empCnt2: 595,
            empCnt3: 316,
          },
          {
            code: 'C27',
            codeName: '의료, 정밀, 광학기기 및 시계',
            empCnt1: 128,
            empCnt2: 9,
          },
          {
            code: 'C28',
            codeName: '전기장비',
            empCnt1: 1498,
            empCnt2: 1110,
            empCnt3: 749,
          },
          {
            code: 'C29',
            codeName: '기타 기계 및 장비',
            empCnt1: 486,
            empCnt2: 92,
            empCnt3: 3,
          },
          {
            code: 'C30',
            codeName: '자동차 및 트레일러',
            empCnt1: 1503,
            empCnt2: 1309,
            empCnt3: 631,
          },
          {
            code: 'C31',
            codeName: '기타 운송장비',
            empCnt1: 261,
            empCnt2: 110,
            empCnt3: 1,
          },
          {
            code: 'C32',
            codeName: '가구',
            empCnt1: 40,
          },
          {
            code: 'C33',
            codeName: '기타 제품',
            empCnt1: 205,
            empCnt2: 65,
            empCnt3: 65,
          },
          {
            code: 'C34',
            codeName: '산업용 기계 및 장비 수리업',
            empCnt1: 162,
            empCnt2: 53,
            empCnt3: 53,
          },
        ])
      }
    }, 100)
  })
}

export async function test_getMenu1_1_2_5Increase(type: number): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (type === 1) {
        resolve([
          {
            code: 'C10',
            codeName: '식료품',
            increase: 0,
          },
          {
            code: 'C12',
            codeName: '담배',
            increase: 1,
          },
          {
            code: 'C13',
            codeName: '섬유제품(의복 제외)',
            increase: -2,
          },
          {
            code: 'C14',
            codeName: '의복, 의복액세서리 및 모피제품',
            increase: -2,
          },
          {
            code: 'C15',
            codeName: '가죽, 가방 및 신발',
            increase: -1,
          },
          {
            code: 'C17',
            codeName: '펄프, 종이 및 종이제품',
            increase: 0,
          },
          {
            code: 'C19',
            codeName: '코크스, 연탄 및 석유정제품',
            increase: 0,
          },
          {
            code: 'C20',
            codeName: '화학물질 및 화학제품(의약품 제외)',
            increase: 6,
          },
          {
            code: 'C21',
            codeName: '의료용 물질 및 의약품',
            increase: -1,
          },
          {
            code: 'C22',
            codeName: '고무 및 플라스틱제품',
            increase: 3,
          },
          {
            code: 'C23',
            codeName: '비금속 광물제품',
            increase: -2,
          },
          {
            code: 'C24',
            codeName: '1차 금속',
            increase: 2,
          },
          {
            code: 'C25',
            codeName: '금속가공제품(기계 및 가구 제외)',
            increase: 2,
          },
          {
            code: 'C26',
            codeName: '전자부품, 컴퓨터, 영상, 음향 및 통신장비',
            increase: 0,
          },
          {
            code: 'C28',
            codeName: '전기장비',
            increase: -1,
          },
          {
            code: 'C29',
            codeName: '기타 기계 및 장비',
            increase: 1,
          },
          {
            code: 'C30',
            codeName: '자동차 및 트레일러',
            increase: -7,
          },
          {
            code: 'C31',
            codeName: '기타 운송장비',
            increase: 0,
          },
          {
            code: 'C33',
            codeName: '기타 제품',
            increase: 2,
          },
          {
            code: 'C34',
            codeName: '산업용 기계 및 장비 수리업',
            increase: 3,
          },
        ])
      } else if (type === 2) {
        resolve([
          {
            code: 'C10',
            codeName: '식료품',
            increase: -34,
          },
          {
            code: 'C12',
            codeName: '담배',
            increase: -12,
          },
          {
            code: 'C13',
            codeName: '섬유제품(의복 제외)',
            increase: -58,
          },
          {
            code: 'C14',
            codeName: '의복, 의복액세서리 및 모피제품',
            increase: -55,
          },
          {
            code: 'C15',
            codeName: '가죽, 가방 및 신발',
            increase: -164,
          },
          {
            code: 'C17',
            codeName: '펄프, 종이 및 종이제품',
            increase: 39,
          },
          {
            code: 'C19',
            codeName: '코크스, 연탄 및 석유정제품',
            increase: -1,
          },
          {
            code: 'C20',
            codeName: '화학물질 및 화학제품(의약품 제외)',
            increase: 291,
          },
          {
            code: 'C21',
            codeName: '의료용 물질 및 의약품',
            increase: -85,
          },
          {
            code: 'C22',
            codeName: '고무 및 플라스틱제품',
            increase: 126,
          },
          {
            code: 'C23',
            codeName: '비금속 광물제품',
            increase: -60,
          },
          {
            code: 'C24',
            codeName: '1차 금속',
            increase: -9,
          },
          {
            code: 'C25',
            codeName: '금속가공제품(기계 및 가구 제외)',
            increase: 10,
          },
          {
            code: 'C26',
            codeName: '전자부품, 컴퓨터, 영상, 음향 및 통신장비',
            increase: 5,
          },
          {
            code: 'C28',
            codeName: '전기장비',
            increase: 606,
          },
          {
            code: 'C29',
            codeName: '기타 기계 및 장비',
            increase: 3,
          },
          {
            code: 'C30',
            codeName: '자동차 및 트레일러',
            increase: -538,
          },
          {
            code: 'C31',
            codeName: '기타 운송장비',
            increase: -2,
          },
          {
            code: 'C33',
            codeName: '기타 제품',
            increase: 65,
          },
          {
            code: 'C34',
            codeName: '산업용 기계 및 장비 수리업',
            increase: 53,
          },
        ])
      }
    }, 100)
  })
}

export async function test_getMenu1_1_2_5Type(): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: '가공조립형',
          corpCnt1: 447,
          corpCnt2: 82,
          corpCnt3: 24,
          empCnt1: 5961,
          empCnt2: 3375,
          empCnt3: 1768,
        },
        {
          name: '기초소재형',
          corpCnt1: 384,
          corpCnt2: 96,
          corpCnt3: 33,
          empCnt1: 5794,
          empCnt2: 3729,
          empCnt3: 2204,
        },
        {
          name: '생활관련형',
          corpCnt1: 447,
          corpCnt2: 24,
          corpCnt3: 12,
          empCnt1: 2231,
          empCnt2: 941,
          empCnt3: 583,
        },
      ])
    }, 100)
  })
}

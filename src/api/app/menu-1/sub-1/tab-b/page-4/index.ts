const prefix = '/api/v1/menu-1/sub-1'

export async function test_getMenu1_2_4Data(type: number): Promise<any[]> {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      if (type === 1) {
        resolve([
          {
            name: '김천시',
            area: 1005.43,
            corpCnt: 8007,
            empCnt: 31356,
            corpDensity: 0.08,
            empDensity: 0.31,
          },
          {
            name: '공업지역',
            area: 6.43,
            corpCnt: 375,
            empCnt: 9289,
            corpDensity: 0.58,
            empDensity: 14.44,
          },
          {
            name: '도시공업지역',
            area: 2.64,
            corpCnt: 152,
            empCnt: 4978,
            corpDensity: 0.58,
            empDensity: 18.87,
          },
          {
            name: '공업지역 내 산업단지',
            area: 3.8,
            corpCnt: 223,
            empCnt: 4311,
            corpDensity: 0.59,
            empDensity: 11.36,
          },
        ])
      } else if (type === 2) {
        resolve([])
      }
    }, 100)
  })
}

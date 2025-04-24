import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'
import { DensityInfo } from '@/api/app/menu-1/sub-1/tab-b/model'

const prefix = '/api/v1/1-1-2'

export function getDensityInfos(type: 'ALL' | 'TYPE1') {
  return http.get<ResultData<DensityInfo>>(`${prefix}/density/${type}`)
}

export async function test_getMenu1_1_3Data(type: 'ALL' | 'TYPE1'): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      if (type === 'ALL') {
        resolve({
          type: 'ALL',
          notes: ['ALL-note1', 'ALL-note2'],
          infos: [
            {
              year: '2011',
              image: '49b16a45-1309-476d-a632-df2416db9832',
            },
            {
              year: '2016',
              image: '230e4e01-0935-4400-97aa-29bd26478206',
            },
            {
              year: '2021',
              image: '754b229f-61b2-4dc1-b8a1-992e9022782a',
            },
          ],
        })
      } else if (type === 'TYPE1') {
        resolve(
          resolve({
            type: 'TYPE1',
            notes: ['TYPE1-note1', 'TYPE1-note2'],
            infos: [
              {
                year: '2011',
                image: '203b9627-677d-4252-bec9-ba8e1205ee01',
              },
              {
                year: '2016',
                image: 'b486bbbb-f494-46ae-955f-2f86601eb3ba',
              },
              {
                year: '2021',
                image: 'b21b0961-88c7-467d-b955-d79fe9093454',
              },
            ],
          }),
        )
      }
    }, 100)
  })
}

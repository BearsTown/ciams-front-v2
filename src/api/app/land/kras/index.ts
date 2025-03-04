import { ciamsAxiosInstance as http } from '@/api/app'
import { ResultData } from '@/api/app/model'
import Kras from '@/api/app/land/kras/model'

const prefix = '/api/v1/openapi/kras/'

export async function getKrasData(pnu: string) {
  return http.get<ResultData<Kras.Result>>(`${prefix}`, {
    params: {
      pnu,
    },
  })
}

import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import CiamsCode from '@/api/admin/code/model'

const prefix = '/api/v1/codes'

export default {
  getCodeList(parentCode: string) {
    return http.get<ResultData<CiamsCode.Find[]>>(`${prefix}/${parentCode}/child`)
  },

  addNewCode(codeForm: object) {
    return http.post<ResultData<object>>(`${prefix}`, codeForm)
  },

  modifyCode(codeForm: object) {
    return http.put<ResultData<object>>(`${prefix}`, codeForm)
  },

  removeCode(code: string) {
    return http.delete<ResultData<object>>(`${prefix}/${code}`)
  },

  changeCodePriority(param: object) {
    return http.put<ResultData<object>>(`${prefix}/priority`, param)
  },
}

import { AxiosRequestConfig } from 'axios'

import Config from '@/api/admin/config/model'
import { ResultData } from '@/api/app/model'
import { ciamsAxiosInstance as http } from '@/api/app'
import { object } from 'vue-types'

const prefix = '/api/v1/config'

export default {
  getConfigList(confType: string) {
    return http.get<ResultData<Config.Result>>(`${prefix}?confType=${confType}`)
  },

  addConfig(params: object) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return http.post<ResultData<Config.Result>>(`${prefix}`, params, config)
  },

  modifyConfig(params: object) {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return http.put<ResultData<Config.Result>>(`${prefix}/${params.id}`, params, config)
  },

  getConfTypeList() {
    return http.get<ResultData<Config.Result>>(`${prefix}/types`)
  },

  checkGosiData(id) {
    return http.get<ResultData<any>>(`api/v1/plan/MapService/list?planId=${id}`)
  },

  getMapLayers(id) {
    return http.get<ResultData<any>>(`api/v1/plan/MapLayers/list?planId=${id}`)
  },

  deleteConfig(id: string) {
    return http.delete(`${prefix}/${id}`)
  },
}

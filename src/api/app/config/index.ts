import { AxiosRequestConfig } from 'axios'

import Config from '@/api/app/config/model'
import { ResultData } from '@/api/app/model'
import { AbstractApiAxios } from '@/utils/apiAxios'
import { API_INFO_CIAMS } from '@/config/config'

const prefix = '/api/v1/config'

class CiamsConfigAxios extends AbstractApiAxios<ResultData<any>> {
  constructor() {
    super({
      baseURL: API_INFO_CIAMS.PREFIX,
    })
  }
}

const http = new CiamsConfigAxios()

function getConfigList(params: Config.Find) {
  const config: AxiosRequestConfig = {
    params,
  }
  return http.get<ResultData<[Config.Result]>>(`${prefix}`, config)
}

function getConfig(id: string) {
  return http.get<ResultData<Config.Result>>(`${prefix}/${id}`)
}

export { getConfigList, getConfig }

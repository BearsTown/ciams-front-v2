import { API_INFO_VWORLD } from '@/config/config'
import { AbstractApiAxios } from '@/utils/apiAxios'

class vWorldAxios extends AbstractApiAxios<any> {
  constructor() {
    super({
      baseURL: API_INFO_VWORLD.PREFIX,
    })
  }
}

export const vWorldAxiosInstance = new vWorldAxios()

import { defineStore } from 'pinia'
import { MapType } from '@/enums/mapEnum'
import { markRaw, reactive, toRefs } from 'vue'
import { Feature } from 'ol'

interface IAddress {
  id: string
  address: {
    zipcode: string
    category: string
    road: string
    parcel: string
    bldnm: string
    bldnmdc: string
  }
  point: {
    x: string
    y: string
  }
}

interface ILocInfo {
  pnu: number
  point: {
    x: number
    y: number
  }
}

export const subInfoStore = (mapType: MapType) => {
  return defineStore(`subInfoStore-${mapType}`, () => {
    const searchAddress = markRaw({} as IAddress)

    const state = reactive({
      locInfo: {} as ILocInfo,
      locationInfoVisible: false,
      searchAddress: {} as IAddress,
      searchAddressFeature: {} as Feature,
    })

    function setAddress(newAddress: IAddress) {
      Object.assign(searchAddress, newAddress)
    }

    return {
      ...toRefs(state),
      setAddress,
      searchAddress,
    }
  })()
}

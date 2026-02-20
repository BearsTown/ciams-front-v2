import { defineStore } from 'pinia'
import { reactive, Ref, toRefs } from 'vue'

// import Kgeo from '@/api/app/kgeo/model'
import Kgeo from '@/models/api/app/kgeo'

interface State {
  krasInfoItem: any
  kgeoInfoItem: Kgeo.LandInfo
  kgeoBuildInfo: Kgeo.BuildInfo
  publicDataInfoItem: any
}

interface OpenApiStoreGetters {
  krasInfoItem: Ref<any>
  kgeoInfoItem: Ref<Kgeo.LandInfo>
  kgeoBuildInfo: Ref<Kgeo.BuildInfo>
  publicDataInfoItem: Ref<any>
}

interface OpenApiStoreActions {
  setKrasInfoItem: (item: any) => void
  setKgeoInfoItem: (item: Kgeo.LandInfo) => void
  setKgeoBuildInfo: (item: Kgeo.BuildInfo) => void
  setPublicDataInfotem: (item: any) => void
}

type OpenApiStore = OpenApiStoreGetters & OpenApiStoreActions

export const useOpenApiStore = defineStore('useOpenApiStore', (): OpenApiStore => {
  const state = reactive<State>({
    krasInfoItem: {},
    kgeoInfoItem: {} as Kgeo.LandInfo,
    kgeoBuildInfo: {} as Kgeo.BuildInfo,
    publicDataInfoItem: {},
  })

  function setKrasInfoItem(item) {
    state.krasInfoItem = item
  }

  function setKgeoInfoItem(item) {
    state.kgeoInfoItem = item
  }

  function setKgeoBuildInfo(item: Kgeo.BuildInfo) {
    state.kgeoBuildInfo = item
  }

  function setPublicDataInfotem(item) {
    state.publicDataInfoItem = item
  }

  return {
    ...toRefs(state),
    setKrasInfoItem,
    setKgeoInfoItem,
    setKgeoBuildInfo,
    setPublicDataInfotem,
  }
})

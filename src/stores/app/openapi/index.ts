import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import Kgeo from '@/api/app/land/kgeo/model'

interface State {
  krasInfoItem: any
  kgeoInfoItem: Kgeo.UnionMap
  publicDataInfoItem: any
}

export const useOpenApiStore = defineStore('useOpenApiStore', () => {
  const state = reactive<State>({
    krasInfoItem: {},
    kgeoInfoItem: {} as Kgeo.UnionMap,
    publicDataInfoItem: {},
  })

  function setKrasInfoItem(item) {
    state.krasInfoItem = item
  }

  function setKgeoInfoItem(item) {
    state.kgeoInfoItem = item
  }

  function setPublicDataInfotem(item) {
    state.publicDataInfoItem = item
  }

  return {
    ...toRefs(state),
    setKgeoInfoItem,
    setKrasInfoItem,
    setPublicDataInfotem,
  }
})

import { defineStore } from 'pinia'
import configService from '@/api/admin/config'

import { reactive, toRefs } from 'vue'

export const useAdminConfigStore = defineStore('adminConfig', () => {
  const state = reactive({
    typeList: [],
    selectConfigList: [],
  } as {
    typeList: any[]
    selectConfigList: any[]
  })

  function getConfigList(configType: string) {
    return new Promise((resolve, reject) => {
      configService
        .getConfigList(configType)
        .then((res) => {
          const resultList = res.data
          state.selectConfigList = [...resultList]
          resolve(resultList)
        })
        .catch(reject)
    })
  }

  function getConfTypeList() {
    return new Promise((resolve, reject) => {
      configService
        .getConfTypeList()
        .then((res) => {
          const resultList = res.data
          state.typeList = [...resultList]

          console.log(state.typeList)
          resolve(resultList)
        })
        .catch(reject)
    })
  }

  function addConfig(obj) {
    return new Promise<void>((resolve, reject) => {
      configService
        .addConfig(obj)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  }

  function modifyConfig(obj) {
    return new Promise<void>((resolve, reject) => {
      configService
        .modifyConfig(obj)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  }

  function checkGosiData(id) {
    return new Promise<any[]>((resolve, reject) => {
      configService
        .checkGosiData(id)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function getMapLayers(id) {
    return new Promise<any[]>((resolve, reject) => {
      configService
        .getMapLayers(id)
        .then((res) => {
          resolve(res.data)
        })
        .catch(reject)
    })
  }

  function deleteConfig(id) {
    return new Promise<void>((resolve, reject) => {
      configService
        .deleteConfig(id)
        .then(() => {
          resolve()
        })
        .catch(reject)
    })
  }

  return {
    ...toRefs(state),
    getConfigList,
    getConfTypeList,
    addConfig,
    modifyConfig,
    checkGosiData,
    deleteConfig,
    getMapLayers,
  }
})

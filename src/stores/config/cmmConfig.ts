import { reactive, ref, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { getConfigList } from '@/api/app/config'
import Config, { ConfigObject } from '@/api/app/config/model'
import CommonUtil from '@/utils/commonUtil'

type ConfigState = {
  [key: string]: ConfigObject
}

type PromiseState = {
  [key: string]: Promise<{ [key: string]: ConfigObject }> | null
}

export const useCmmConfigStore = defineStore('cmmConfigStore', () => {
  const state: ConfigState = reactive<ConfigState>({
    COMMON_CONFIG: {},
    MAP_CONFIG: {},
  })

  const promises = {
    COMMON_CONFIG: null,
    MAP_CONFIG: null,
  } as PromiseState

  async function loadCmmConfig() {
    await loadConfig({ confType: 'COMMON_CONFIG' })
  }

  async function loadMapConfig() {
    await loadConfig({ confType: 'MAP_CONFIG' })
  }

  async function loadConfig(params: Config.Find) {
    if (!CommonUtil.isEmpty(state[params.confType])) {
      return state[params.confType]
    }
    if (!promises[params.confType]) {
      promises[params.confType] = getConfigList(params)!.then(
        (res) => {
          const resCommonConfigData = res.data as Array<Config.Result>

          resCommonConfigData.forEach((configData, idx) => {
            state[params.confType][configData.id] = configData
          })

          promises[params.confType] = null
          return state.value
        },
        (err) => {
          promises[params.confType] = null
          CommonUtil.errorMessage(`CmmConfig API 호출 실패 :: ${err}`)
          throw err
        },
      )
    }

    return promises[params.confType]
  }

  return {
    mapConfigState: state['MAP_CONFIG'],
    cmmConfigState: state['COMMON_CONFIG'],
    loadMapConfig,
    loadCmmConfig,
  }
})

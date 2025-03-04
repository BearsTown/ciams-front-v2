import { ref, Ref } from 'vue'
import { defineStore } from 'pinia'

import { getConfigList } from '@/api/app/config'
import CommonUtil from '@/utils/commonUtil'

type key = string
type resData = {
  id: key
  confName: string
  confValue: string
  confType: string
  used: boolean
}
export type StateValue = Omit<resData, 'id'>

export const useCmmConfig = defineStore('cmmConfig', () => {
  const state: Ref<{ [k: string]: StateValue }> = ref({})

  async function init() {
    const resCommonConfig = await getConfigList({ confType: 'COMMON_CONFIG' })
    const resCommonConfigData = resCommonConfig.data as unknown as Array<resData>

    resCommonConfigData.forEach((configData, idx) => {
      state.value[configData.id] = {
        confName: configData.confName,
        confValue: configData.confValue,
        confType: configData.confType,
        used: configData.used,
      }
    })
  }

  async function fetchData(): Promise<Ref<{ [k: string]: StateValue }>> {
    if (CommonUtil.isEmpty(state.value)) {
      try {
        await init()
      } catch (error) {
        CommonUtil.errorMessage('API 호출 실패.')
        state.value = {}
      }
    }
    return state
  }

  return {
    state,
    fetchData,
  }
})

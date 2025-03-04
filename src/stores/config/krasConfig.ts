import { getConfigList } from '@/api/app/config'
import Config from '@/api/app/config/model'
import { defineStore } from 'pinia'
import { ref } from 'vue'

type key = string
type resData = Pick<Config.Result, 'id' | 'confName' | 'confValue' | 'confType' | 'used'>
type StateValue = Omit<resData, 'id'>

export const useKrasConfig = defineStore('krasConfig', () => {
  const state = ref<{ [k: string]: StateValue }>({
    k: {
      confName: '',
      confValue: '',
      confType: '',
      used: true,
    },
  })
  const init = async () => {
    const resKrasConfig = await getConfigList({ confType: 'KRAS_CONFIG' })
    const resKrasConfigData = resKrasConfig.data as unknown as Array<Config.Result>
    resKrasConfigData.forEach((configData, idx) => {
      state.value[configData.id] = {
        confName: configData.confName,
        confValue: configData.confValue,
        confType: configData.confType,
        used: configData.used,
      }
    })
  }
  return { state, init }
})

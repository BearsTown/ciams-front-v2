import { defineStore } from 'pinia'
import { reactive } from 'vue'

import { TagCategory } from '@/types/common'
import { CiamsZoneDTO } from '@/api/app/zone/model'
import { getCodeList } from '@/api/app/common'
import { getCiamsZoneOverView } from '@/api/app/zone'

interface State {
  tags: TagCategory[]
  overview?: CiamsZoneDTO.Overview.Find.Result
}

export const usePlanConceptStore = defineStore('planConceptStore', () => {
  const state = reactive<State>({
    tags: [],
  })

  async function setOverview(params: CiamsZoneDTO.Overview.Find.Params) {
    const { data } = await getCiamsZoneOverView(params)
    state.overview = data
  }

  async function setTagList(code: string) {
    const { data } = await getCodeList(code)

    state.tags = data.map((item) => ({
      label: item.codeName,
      value: item.code,
      color: item.codeVal,
    }))
  }

  function clear() {
    state.overview = undefined
  }

  return {
    state,
    clear,
    setTagList,
    setOverview,
  }
})

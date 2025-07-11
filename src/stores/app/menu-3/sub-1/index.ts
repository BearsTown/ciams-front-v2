import { defineStore } from 'pinia'
import { reactive } from 'vue'

import { TagCategory } from '@/types/common'
import { CiamsZoneDTO } from '@/api/app/zone/model'
import { CiamsMenu3Sub1DetailsDto } from '@/api/app/menu-3/sub-1/model'
import { getCodeList } from '@/api/app/common'
import { getCiamsZoneOverView } from '@/api/app/zone'

interface State {
  tags: TagCategory[]
  overview?: CiamsZoneDTO.Overview.Find.Result
}

export const useMenu3Sub1Store = defineStore('menu3Sub1Store', () => {
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

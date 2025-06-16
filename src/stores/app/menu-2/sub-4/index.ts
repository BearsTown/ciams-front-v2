import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CiamsMenu2Sub4DetailsDto } from '@/api/app/menu-2/sub-4/model'
import { getMenu2Sub4OverView } from '@/api/app/menu-2/sub-4'

export const useMenu2Sub4Store = defineStore('menu2Sub4Store', () => {
  const overview = ref<CiamsMenu2Sub4DetailsDto.Overview.Find.Result | null>()

  async function setOverview(params: CiamsMenu2Sub4DetailsDto.Overview.Find.Params) {
    const { data } = await getMenu2Sub4OverView(params)
    overview.value = data
  }

  return {
    overview,
    setOverview,
  }
})

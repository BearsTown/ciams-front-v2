import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CiamsMenu2Sub1DetailsDto } from '@/api/app/menu-2/sub-1/model'
import { getMenu2Sub1OverView } from '@/api/app/menu-2/sub-1'

export const useMenu2Sub3Store = defineStore('menu2Sub3Store', () => {
  const overview = ref<CiamsMenu2Sub1DetailsDto.Overview.Find.Result | null>()

  async function setOverview(params: CiamsMenu2Sub1DetailsDto.Overview.Find.Params) {
    const { data } = await getMenu2Sub1OverView(params)
    overview.value = data
  }

  return {
    overview,
    setOverview,
  }
})

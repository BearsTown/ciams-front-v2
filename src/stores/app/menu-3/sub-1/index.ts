import { defineStore } from 'pinia'
import { ref } from 'vue'

import { CiamsMenu3Sub1DetailsDto } from '@/api/app/menu-3/sub-1/model'
import { getMenu3Sub1OverView } from '@/api/app/menu-3/sub-1'

export const useMenu3Sub1Store = defineStore('menu3Sub1Store', () => {
  const overview = ref<CiamsMenu3Sub1DetailsDto.Overview.Find.Result | null>()

  async function setOverview(params: CiamsMenu3Sub1DetailsDto.Overview.Find.Params) {
    const { data } = await getMenu3Sub1OverView(params)
    overview.value = data
  }

  return {
    overview,
    setOverview,
  }
})

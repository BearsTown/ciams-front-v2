import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Menu2ZoneDetailsDto } from '@/api/app/menu-2/model'
import { getMenu2ZoneOverView } from '@/api/app/menu-2'

export const useMenu2Sub2Store = defineStore('menu2Sub2Store', () => {
  const overview = ref<Menu2ZoneDetailsDto.Overview.Find.Result | null>()

  async function setOverview(params: Menu2ZoneDetailsDto.Overview.Find.Params) {
    const { data } = await getMenu2ZoneOverView(params)
    overview.value = data
  }

  return {
    overview,
    setOverview,
  }
})

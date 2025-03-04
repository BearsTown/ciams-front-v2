import { defineStore } from 'pinia'
import { ref } from 'vue'

import { Plan } from '@/api/app/menu-1/model'
import { getOverView } from '@/api/app/menu-1'

export const useMenu1StepCStore = defineStore('menu1StepCStore', () => {
  const overview = ref<Plan.Overview.Find.Result | null>()

  async function setOverview(params: Plan.Overview.Find.Params) {
    const { data } = await getOverView(params)
    overview.value = data
  }

  return {
    overview,
    setOverview,
    // ...toRefs(overview),
  }
})

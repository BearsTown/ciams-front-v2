import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  { name: '전체 사업체 밀도분석', id: 'B001' },
  { name: '제조업 및 관련서비스업 밀도분석', id: 'B002' },
]

export const useBasicLocIndStatusDensityStore = defineStore('basicLocIndStatusDensityStore', () => {
  const state = reactive<{
    selectedTab?: {
      id: string
      name: string
    }
  }>({
    selectedTab: tabList.find((t) => t.id === 'B001'),
  })

  function selectTab(tabId: string) {
    state.selectedTab = tabList.find((t) => t.id === tabId)
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

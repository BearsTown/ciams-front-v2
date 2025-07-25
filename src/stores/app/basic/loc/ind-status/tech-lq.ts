import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  { name: '기술혁신정도', id: 'TabA', isActive: false },
  { name: '기술집약정도', id: 'TabB', isActive: false },
] as const

export type BasicLocIndStatusTechLQTabIdType = (typeof tabList)[number]['id']

export const useBasicLocIndStatusTechLQStore = defineStore('basicLocIndStatusTechLQStore', () => {
  const state = reactive<{
    selectedTabId: BasicLocIndStatusTechLQTabIdType
  }>({
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: BasicLocIndStatusTechLQTabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

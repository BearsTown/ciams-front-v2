import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  { name: '제조업별 사업체수', id: 'TabA', isActive: false },
  { name: '제조업별 종사자수', id: 'TabB', isActive: false },
  { name: '제조업의 유형별 현황', id: 'TabC', isActive: false },
] as const

export type BasicLocIndStatusMfgTabIdType = (typeof tabList)[number]['id']

export const useBasicLocIndStatusMfgStore = defineStore('basicLocIndStatusMfgStore', () => {
  const state = reactive<{
    selectedTabId: BasicLocIndStatusMfgTabIdType
  }>({
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: BasicLocIndStatusMfgTabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

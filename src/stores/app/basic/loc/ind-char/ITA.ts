import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  { name: '산업기반분석', id: 'TabA', isActive: false },
  { name: '선도산업 현황', id: 'TabB', isActive: false },
  { name: '신흥산업 현황', id: 'TabC', isActive: false },
  { name: '쇠퇴산업 현황', id: 'TabD', isActive: false },
  { name: '초기반산업 현황', id: 'TabE', isActive: false },
  { name: '산업특성분석 결과', id: 'TabF', isActive: false },
] as const

export type BasicLocIndCharITATabIdType = (typeof tabList)[number]['id']

export const useBasicLocIndCharITAStore = defineStore('basicLocIndCharITAStore', () => {
  const state = reactive<{
    selectedTabId: BasicLocIndCharITATabIdType
  }>({
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: BasicLocIndCharITATabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

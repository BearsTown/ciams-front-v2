import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  { name: '산업기반분석(ITA)', id: 'Page1', isActive: false, isChild: true },
  { name: '인접 지자체 산업특성분석', id: 'Page2', isActive: false, isChild: true },
] as const

export type BasicLocIndCharTabIdType = (typeof tabList)[number]['id']

export const useBasicLocIndCharStore = defineStore('basicLocIndCharStore', () => {
  const state = reactive<{
    selectedTabId: BasicLocIndCharTabIdType
  }>({
    selectedTabId: 'Page1',
  })

  function selectTab(tabId: BasicLocIndCharTabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

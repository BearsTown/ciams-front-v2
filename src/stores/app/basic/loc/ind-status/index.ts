import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  { name: '공업지역기본계획 산업의 범위', id: 'Page1', isActive: false, isChild: false },
  { name: '산업여건변화', id: 'Page2', isActive: false, isChild: false },
  { name: '사업체 밀도변화', id: 'Page3', isActive: false, isChild: true },
  { name: '산업별 분석', id: 'Page4', isActive: false, isChild: true },
  { name: '제조업별 분석', id: 'Page5', isActive: false, isChild: true },
  { name: '기술업종별 LQ분석', id: 'Page6', isActive: false, isChild: true },
] as const

export type BasicLocIndStatusTabIdType = (typeof tabList)[number]['id']

export const useBasicLocIndStatusStore = defineStore('basicLocIndStatusStore', () => {
  const state = reactive<{
    selectedTabId: BasicLocIndStatusTabIdType
  }>({
    selectedTabId: 'Page1',
  })

  function selectTab(tabId: BasicLocIndStatusTabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

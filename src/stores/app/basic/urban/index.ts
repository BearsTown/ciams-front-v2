import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  // { name: '일반현황', id: 'TabA' },
  { name: '대상지현황', id: 'TabB' },
  { name: '사업체현황', id: 'TabC' },
  { name: '산업특성분석', id: 'TabD' },
] as const

export type BasicUrbanTabIdType = (typeof tabList)[number]['id']

export const useBasicUrbanStore = defineStore('basicUrbanStore', () => {
  const state = reactive<{
    selectedTabId: BasicUrbanTabIdType
  }>({
    selectedTabId: 'TabB',
  })

  return {
    ...toRefs(state),

    tabList,
  }
})

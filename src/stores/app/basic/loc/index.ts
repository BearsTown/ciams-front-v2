import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  { name: '일반현황', id: 'TabA' },
  { name: '산업현황분석', id: 'TabB' },
  { name: '산업특성분석', id: 'TabC' },
] as const

export type BasicLocTabIdType = (typeof tabList)[number]['id']

export const useBasicLocStore = defineStore('basicLocStore', () => {
  const state = reactive<{
    selectedTabId: BasicLocTabIdType
  }>({
    selectedTabId: 'TabA',
  })

  return {
    ...toRefs(state),

    tabList,
  }
})

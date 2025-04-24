import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1TabIdType
}

const tabList = [
  { name: '일반현황', id: 'TabA' },
  { name: '산업현황분석', id: 'TabB' },
  { name: '산업특성분석', id: 'TabC' },
] as const

export type Menu1Sub1TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1store = defineStore('menu1sub1store', () => {
  const state = reactive<Menu1Sub1>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabB',
  })

  return {
    ...toRefs(state),

    tabList,
  }
})

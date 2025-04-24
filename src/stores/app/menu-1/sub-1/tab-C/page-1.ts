import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab3Page1 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1Tab3Page1TabIdType
}

const tabList = [
  { name: '산업기반분석', id: 'TabA', isActive: false },
  { name: '선도산업 현황', id: 'TabB', isActive: false },
  { name: '신흥산업 현황', id: 'TabC', isActive: false },
  { name: '쇠퇴산업 현황', id: 'TabD', isActive: false },
  { name: '초기반산업 현황', id: 'TabE', isActive: false },
  { name: '산업기반분석 결과', id: 'TabF', isActive: false },
] as const

export type Menu1Sub1Tab3Page1TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1Tab3Page1Store = defineStore('menu1-Sub1-Tab3-Page1-Store', () => {
  const state = reactive<Menu1Sub1Tab3Page1>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu1Sub1Tab3Page1TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

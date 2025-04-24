import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab3Page2 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1Tab3Page2TabIdType
}

const tabList = [
  { name: '산업기반분석 비교', id: 'TabA', isActive: false },
  { name: '구미시', id: 'TabB', isActive: false },
  { name: '상주시', id: 'TabC', isActive: false },
  { name: '칠곡군', id: 'TabD', isActive: false },
] as const

export type Menu1Sub1Tab3Page2TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1Tab3Page2Store = defineStore('menu1-Sub1-Tab3-Page2-Store', () => {
  const state = reactive<Menu1Sub1Tab3Page2>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu1Sub1Tab3Page2TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

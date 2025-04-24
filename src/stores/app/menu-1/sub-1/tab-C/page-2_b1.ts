import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab3Page2 {
  showInfo: UseBoolean
  selectedTabId: string
  tabList: TabItem[]
}

interface TabItem {
  name: string
  id: string
  isActive: boolean
}

export const useMenu1Sub1Tab3Page2Store = defineStore('menu1-Sub1-Tab3-Page2-Store', () => {
  const state = reactive<Menu1Sub1Tab3Page2>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
    tabList: [{ name: '산업기반분석 비교', id: 'TabA', isActive: false }],
  })

  function selectTab(tabId: string) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    selectTab,
  }
})

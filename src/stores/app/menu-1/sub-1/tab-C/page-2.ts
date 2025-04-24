import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab3Page2 {
  showInfo: UseBoolean
  selectedTab: any
  tabList: TabItem[]
}

interface TabItem {
  name: string
  id: string
  isActive: boolean
  type: string
}

export const useMenu1Sub1Tab3Page2Store = defineStore('menu1-Sub1-Tab3-Page2-Store', () => {
  const state = reactive<Menu1Sub1Tab3Page2>({
    showInfo: useBoolean(false),
    selectedTab: { name: '산업기반분석 비교', id: 'TabA', isActive: false, type: 'TabA' },
    tabList: [{ name: '산업기반분석 비교', id: 'TabA', isActive: false, type: 'TabA' }],
  })

  function selectTab(tab: any) {
    state.selectedTab = tab
  }

  function addTabList(tabs: any[]) {
    // state.selectedTab = tab
    state.tabList = [...state.tabList, ...tabs]
  }

  return {
    ...toRefs(state),

    selectTab,
    addTabList,
  }
})

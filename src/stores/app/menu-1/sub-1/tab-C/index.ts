import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab3 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1Tab3TabIdType
}

const tabList = [
  { name: '산업기반분석(ITA)', id: 'Page1', isActive: false, isChild: true },
  { name: '인접 지자체 산업특성분석', id: 'Page2', isActive: false, isChild: true },
] as const

export type Menu1Sub1Tab3TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1Tab3Store = defineStore('menu1-Sub1-Tab3-Store', () => {
  const state = reactive<Menu1Sub1Tab3>({
    showInfo: useBoolean(false),
    selectedTabId: 'Page1',
  })

  function selectTab(tabId: Menu1Sub1Tab3TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

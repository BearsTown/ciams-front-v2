import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu3Sub2Page3 {
  showInfo: UseBoolean
  selectedTabId: Menu3Sub2Page3TabIdType
}

const tabList = [
  { name: '환경관리 기본방향', id: 'TabA', isActive: false },
  { name: '분야별 환경관리방안', id: 'TabB', isActive: true },
] as const

export type Menu3Sub2Page3TabIdType = (typeof tabList)[number]['id']

export const useMenu3Sub2Page3Store = defineStore('menu3-Sub2-Page3-Store', () => {
  const state = reactive<Menu3Sub2Page3>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabB',
  })

  function selectTab(tabId: Menu3Sub2Page3TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

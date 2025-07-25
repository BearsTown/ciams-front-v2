import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu3Sub2 {
  showInfo: UseBoolean
  selectedTabId: Menu3Sub2TabIdType
}

const tabList = [
  { name: '산업육성 및 지원 방안', id: 'TabA', isActive: false },
  { name: '공간관리방안', id: 'TabB', isActive: false },
  { name: '환경관리방안', id: 'TabC', isActive: true },
] as const

export type Menu3Sub2TabIdType = (typeof tabList)[number]['id']

export const useMenu3Sub2Store = defineStore('menu3Sub2Store', () => {
  const state = reactive<Menu3Sub2>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu3Sub2TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu3Sub2Page1 {
  showInfo: UseBoolean
  selectedTabId: Menu3Sub2Page1TabIdType
}

const tabList = [
  { name: '산업육성방안', id: 'TabA', isActive: false },
  { name: '산업지원방안', id: 'TabB', isActive: false },
] as const

export type Menu3Sub2Page1TabIdType = (typeof tabList)[number]['id']

export const useMenu3Sub2Page1Store = defineStore('menu3-Sub2-Page1-Store', () => {
  const state = reactive<Menu3Sub2Page1>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu3Sub2Page1TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

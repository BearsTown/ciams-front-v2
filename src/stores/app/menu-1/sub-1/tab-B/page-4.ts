import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab2Page4 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1Tab2Page4TabIdType
}

const tabList = [
  { name: '산업별 사업체수', id: 'TabA', isActive: false },
  { name: '산업별 종사자수', id: 'TabB', isActive: false },
] as const

export type Menu1Sub1Tab2Page4TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1Tab2Page4Store = defineStore('menu1-Sub1-Tab2-Page4-Store', () => {
  const state = reactive<Menu1Sub1Tab2Page4>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu1Sub1Tab2Page4TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

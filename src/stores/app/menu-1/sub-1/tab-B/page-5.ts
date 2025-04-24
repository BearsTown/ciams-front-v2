import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab2Page5 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1Tab2Page5TabIdType
}

const tabList = [
  { name: '제조업별 사업체수', id: 'TabA', isActive: false },
  { name: '제조업별 종사자수', id: 'TabB', isActive: false },
  { name: '제조업의 유형별 현황', id: 'TabC', isActive: false },
] as const

export type Menu1Sub1Tab2Page5TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1Tab2Page5Store = defineStore('menu1-Sub1-Tab2-Page5-Store', () => {
  const state = reactive<Menu1Sub1Tab2Page5>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu1Sub1Tab2Page5TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

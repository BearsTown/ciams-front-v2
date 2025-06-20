import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab2Page3 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1Tab2Page3TabIdType
}

const tabList = [
  { name: '전체 사업체 밀도분석', id: 'TabA', isActive: false },
  { name: '제조업 및 관련서비스업 밀도분석', id: 'TabB', isActive: false },
] as const

export type Menu1Sub1Tab2Page3TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1Tab2Page3Store = defineStore('menu1-Sub1-Tab2-Page3-Store', () => {
  const state = reactive<Menu1Sub1Tab2Page3>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu1Sub1Tab2Page3TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

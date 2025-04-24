import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab2Page6 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1Tab2Page6TabIdType
}

// const tabList = [
//   { name: '기술혁신정도별 산업 현황(LQ)', id: 'TabA', isActive: false },
//   { name: '기술집약정도별 산업 현황(LQ)', id: 'TabB', isActive: false },
//   { name: '기술혁신정도별 세부 산업 현황(LQ)', id: 'TabC', isActive: false },
// ] as const

const tabList = [
  { name: '기술혁신정도', id: 'TabA', isActive: false },
  { name: '기술집약정도', id: 'TabB', isActive: false },
] as const

export type Menu1Sub1Tab2Page6TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1Tab2Page6Store = defineStore('menu1-Sub1-Tab2-Page6-Store', () => {
  const state = reactive<Menu1Sub1Tab2Page6>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu1Sub1Tab2Page6TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu3Sub2Page2 {
  showInfo: UseBoolean
  selectedTabId: Menu3Sub2Page2TabIdType
}

const tabList = [
  { name: '공업지역정비구역 지정을 통한 정비', id: 'TabA', isActive: false },
  { name: '건축물 권장용도(업종) 및 밀도계획 방안', id: 'TabB', isActive: false },
  { name: '지원기반시설 정비방안', id: 'TabC', isActive: false },
] as const

export type Menu3Sub2Page2TabIdType = (typeof tabList)[number]['id']

export const useMenu3Sub2Page2Store = defineStore('menu3-Sub2-Page2-Store', () => {
  const state = reactive<Menu3Sub2Page2>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  function selectTab(tabId: Menu3Sub2Page2TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

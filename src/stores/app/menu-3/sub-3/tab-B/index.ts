import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu3Sub3TabB {
  showInfo: UseBoolean
  selectedTabId: Menu3Sub3TabBTabIdType
}

const tabList = [
  { name: '계획의 개요', id: 'Page1', isActive: false, isChild: false },
  { name: '토지이용계획', id: 'Page2', isActive: false, isChild: false },
  { name: '유치업종계획', id: 'Page3', isActive: false, isChild: false },
  { name: '건축물에 관한 계획', id: 'Page4', isActive: false, isChild: false },
  { name: '지원기반시설에 관한 계획', id: 'Page5', isActive: false, isChild: false },
  { name: '교통처리계획', id: 'Page6', isActive: false, isChild: false },
  { name: '환경관리계획', id: 'Page7', isActive: false, isChild: false },
  { name: '재원조달계획', id: 'Page8', isActive: false, isChild: false },
  { name: '기타계획', id: 'Page9', isActive: false, isChild: false },
] as const

export type Menu3Sub3TabBTabIdType = (typeof tabList)[number]['id']

export const useMenu3Sub3TabBStore = defineStore('menu3-Sub3-TabB-Store', () => {
  const state = reactive<Menu3Sub3TabB>({
    showInfo: useBoolean(false),
    selectedTabId: 'Page1',
  })

  function selectTab(tabId: Menu3Sub3TabBTabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

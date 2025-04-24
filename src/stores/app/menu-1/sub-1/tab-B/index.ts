import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub1Tab2 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub1Tab2TabIdType
}

const tabList = [
  { name: '공업지역기본계획 산업의 범위', id: 'Page1', isActive: false, isChild: false },
  { name: '산업여건변화', id: 'Page2', isActive: false, isChild: false },
  { name: '사업체 밀도변화', id: 'Page3', isActive: false, isChild: false },
  { name: '산업별 분석', id: 'Page4', isActive: false, isChild: true },
  { name: '제조업별 분석', id: 'Page5', isActive: false, isChild: true },
  { name: '기술업종별 LQ분석', id: 'Page6', isActive: false, isChild: true },
] as const

export type Menu1Sub1Tab2TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub1Tab2Store = defineStore('menu1-Sub1-Tab2-Store', () => {
  const state = reactive<Menu1Sub1Tab2>({
    showInfo: useBoolean(false),
    selectedTabId: 'Page3',
  })

  function selectTab(tabId: Menu1Sub1Tab2TabIdType) {
    state.selectedTabId = tabId
  }

  return {
    ...toRefs(state),

    tabList,
    selectTab,
  }
})

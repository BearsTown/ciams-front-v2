import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu1Sub2 {
  showInfo: UseBoolean
  selectedTabId: Menu1Sub2TabIdType
}

const tabList = [
  { name: '일반현황', id: 'TabA' },
  { name: '대상지현황', id: 'TabB' },
  { name: '사업체현황', id: 'TabC' },
  { name: '산업특성분석', id: 'TabD' },
] as const

export type Menu1Sub2TabIdType = (typeof tabList)[number]['id']

export const useMenu1Sub2store = defineStore('menu1sub2store', () => {
  const state = reactive<Menu1Sub2>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  return {
    ...toRefs(state),

    tabList,
  }
})

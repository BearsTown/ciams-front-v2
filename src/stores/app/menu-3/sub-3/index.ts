import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

interface Menu3Sub3 {
  showInfo: UseBoolean
  selectedTabId: Menu3Sub3TabIdType
}

const tabList = [
  { name: '산업혁신구역계획', id: 'TabA' },
  { name: '산업정비구역계획', id: 'TabB' },
] as const

export type Menu3Sub3TabIdType = (typeof tabList)[number]['id']

export const useMenu3Sub3store = defineStore('menu3sub3store', () => {
  const state = reactive<Menu3Sub3>({
    showInfo: useBoolean(false),
    selectedTabId: 'TabA',
  })

  return {
    ...toRefs(state),

    tabList,
  }
})

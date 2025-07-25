import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

const tabList = [
  { name: '산업별 사업체수', id: 'TabA', isActive: false },
  { name: '산업별 종사자수', id: 'TabB', isActive: false },
] as const

export type BasicLocIndStatusIndustrialTabIdType = (typeof tabList)[number]['id']

export const useBasicLocIndStatusIndustrialStore = defineStore(
  'basicLocIndStatusIndustrialStore',
  () => {
    const state = reactive<{
      selectedTabId: BasicLocIndStatusIndustrialTabIdType
    }>({
      selectedTabId: 'TabA',
    })

    function selectTab(tabId: BasicLocIndStatusIndustrialTabIdType) {
      state.selectedTabId = tabId
    }

    return {
      ...toRefs(state),

      tabList,
      selectTab,
    }
  },
)

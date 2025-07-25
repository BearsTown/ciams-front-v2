import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

interface Tab {
  id: string
  name: string
}

export const useBasicLocIndCharAdjacentStore = defineStore('basicLocIndCharAdjacentStore', () => {
  const state = reactive<{
    selectedTab?: Tab
    tabList: Tab[]
  }>({
    selectedTab: undefined,
    tabList: [],
  })

  function selectTab(tab: Tab) {
    state.selectedTab = tab
  }

  function addTabList(tabs: Tab[]) {
    state.tabList = [...state.tabList, ...tabs]

    selectTab(state.tabList[0])
  }

  return {
    ...toRefs(state),

    selectTab,
    addTabList,
  }
})

// useTabStore.ts
import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

export interface TabItem {
  id: string
  name: string
  isChild?: boolean
  isActive?: boolean
}

export interface TabStoreOptions {
  storeName: string
  tabs: TabItem[]
  defaultTabId?: string
}

export function createTabStore({ storeName, tabs, defaultTabId }: TabStoreOptions) {
  return defineStore(storeName, () => {
    const state = reactive({
      selectedTabId: defaultTabId || tabs[0]?.id || '',
      tabs: [...tabs],
    })

    function selectTab(tabId: string) {
      if (tabs.some((tab) => tab.id === tabId)) {
        state.selectedTabId = tabId
      }
    }

    function getTabs() {
      return state.tabs
    }

    function addTab(tab: TabItem) {
      state.tabs.push(tab)
    }

    function removeTab(tabId: string) {
      const index = state.tabs.findIndex((tab) => tab.id === tabId)
      if (index !== -1) {
        state.tabs.splice(index, 1)

        // If the removed tab was selected, select another tab
        if (state.selectedTabId === tabId) {
          state.selectedTabId = state.tabs[0]?.id || ''
        }
      }
    }

    return {
      ...toRefs(state),
      selectTab,
      getTabs,
      addTab,
      removeTab,
    }
  })
}

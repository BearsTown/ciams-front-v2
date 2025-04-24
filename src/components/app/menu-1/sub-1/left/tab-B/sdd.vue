<template>
  <div class="menu-page">
    <CollapsibleMenuContainer
      :tabs="tabStore.tabs"
      :selected-tab-id="tabStore.selectedTabId"
      :component-map="componentMap"
      :default-component="defaultComponent"
      @tab-change="handleTabChange"
    />
  </div>
</template>

<script setup lang="ts">
  import CollapsibleMenuContainer from '@/components/common/collapse/CollapsibleMenuContainer.vue'
  import { createTabStore } from '@/stores/app/useTabStore'
  import TabAComp from '@/components/app/menu-1/sub-1/left/tab-B/Page-3.vue'
  import TabBComp from '@/components/app/menu-1/sub-1/left/tab-B/Page-3.vue'
  import TabCComp from '@/components/app/menu-1/sub-1/left/tab-B/Page-3.vue'

  // Create a tab store for this specific menu
  const menuTabs = [
    { name: '공업지역기본계획 산업의 범위', id: 'Page1', isChild: true },
    { name: '산업여건변화', id: 'Page2', isChild: true },
    { name: '사업체 밀도변화', id: 'Page3', isChild: true },
    { name: '산업별 분석', id: 'Page4', isChild: true },
    { name: '제조업별 분석', id: 'Page5', isChild: true },
    { name: '기술업종별 LQ분석', id: 'Page6', isChild: true },
  ]

  const useMenuTabStore = createTabStore({
    storeName: 'menu-tab-store',
    tabs: menuTabs,
    defaultTabId: 'Page4',
  })

  const tabStore = useMenuTabStore()

  // Map of tab IDs to components
  const componentMap = {
    Page1: TabAComp,
    Page2: TabBComp,
    Page3: TabCComp,
    Page4: TabAComp,
    Page5: TabBComp,
    Page6: TabBComp,
  }

  // Default component to use if no matching component is found
  const defaultComponent = TabAComp

  function handleTabChange(tabId: string) {
    tabStore.selectTab(tabId)
  }
</script>

<style scoped lang="scss">
  .menu-page {
    width: 100%;
    height: 100%;
  }
</style>

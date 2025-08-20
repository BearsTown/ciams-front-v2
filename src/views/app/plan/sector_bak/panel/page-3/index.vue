<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import TabAComp from '@/views/app/plan/sector/panel/page-3/section-1'
  // import TabBComp from '@/views/app/menu-3/sub-2/panel/page-3/section-2'
  import { Menu3Sub2Page3TabIdType, useMenu3Sub2Page3Store } from '@/stores/app/plan/sector/page-3'

  const menu3Sub2Page3Store = useMenu3Sub2Page3Store()

  const components: Record<Menu3Sub2Page3TabIdType, DefineComponent> = {
    TabA: TabAComp,
    // TabB: TabBComp,
  }

  const currentTabComponent = computed(
    () => components[menu3Sub2Page3Store.selectedTabId] || TabAComp,
  )
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

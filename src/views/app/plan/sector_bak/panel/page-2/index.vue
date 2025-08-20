<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import TabAComp from '@/views/app/plan/sector/panel/page-2/section-1'
  import TabBComp from '@/views/app/plan/sector/panel/page-2/section-2'
  import TabCComp from '@/views/app/plan/sector/panel/page-2/section-3'

  import { Menu3Sub2Page2TabIdType, useMenu3Sub2Page2Store } from '@/stores/app/plan/sector/page-2'

  const menu3Sub2Page2Store = useMenu3Sub2Page2Store()

  const components: Record<Menu3Sub2Page2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  const currentTabComponent = computed(
    () => components[menu3Sub2Page2Store.selectedTabId] || TabAComp,
  )
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import TabAComp from '@/views/app/plan/sector/panel/page-1/section-1'
  import TabBComp from '@/views/app/plan/sector/panel/page-1/section-2'

  import { Menu3Sub2Page1TabIdType, useMenu3Sub2Page1Store } from '@/stores/app/plan/sector/page-1'

  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const components: Record<Menu3Sub2Page1TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
  }

  const currentTabComponent = computed(
    () => components[menu3Sub2Page1Store.selectedTabId] || TabAComp,
  )
</script>

<style scoped lang="scss">
  //.panel {
  //  height: 100%;
  //  padding: 15px 12px;
  //  background-color: #f4f4f4;
  //}
</style>

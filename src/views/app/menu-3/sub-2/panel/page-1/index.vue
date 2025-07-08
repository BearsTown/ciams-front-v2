<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import TabAComp from '@/views/app/menu-3/sub-2/panel/page-1/section-1'
  import TabBComp from '@/views/app/menu-3/sub-2/panel/page-1/section-2'

  import { Menu3Sub2Page1TabIdType, useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'
  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu3Sub2Page1TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
  }

  const currentTabComponent = computed(
    () => components[menu3Sub2Page1Store.selectedTabId] || TabAComp,
  )

  async function init() {}

  onBeforeMount(() => {
    init()
  })
</script>

<style scoped lang="scss">
  //.panel {
  //  height: 100%;
  //  padding: 15px 12px;
  //  background-color: #f4f4f4;
  //}
</style>

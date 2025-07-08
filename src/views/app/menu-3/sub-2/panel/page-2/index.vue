<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import TabAComp from '@/views/app/menu-3/sub-2/panel/page-2/section-1'
  import TabBComp from '@/views/app/menu-3/sub-2/panel/page-2/section-2'
  import TabCComp from '@/views/app/menu-3/sub-2/panel/page-2/section-3'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { Menu3Sub2Page2TabIdType, useMenu3Sub2Page2Store } from '@/stores/app/menu-3/sub-2/page-2'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()
  const menu3Sub2Page2Store = useMenu3Sub2Page2Store()

  const components: Record<Menu3Sub2Page2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  const currentTabComponent = computed(
    () => components[menu3Sub2Page2Store.selectedTabId] || TabAComp,
  )

  async function init() {}

  onBeforeMount(() => {
    init()
  })
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

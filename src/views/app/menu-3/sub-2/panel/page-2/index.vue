<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import {
    Menu3Sub2Page2TabIdType,
    useMenu3Sub2Page2Store,
  } from 'src/stores/app/menu-3/sub-2/page-2'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  import CommonUtil from '@/utils/commonUtil'

  import TabAComp from '@/views/app/menu-3/sub-2/panel/page-2/section-1'
  import TabBComp from '@/views/app/menu-3/sub-2/panel/page-2/section-2'
  import TabCComp from '@/views/app/menu-3/sub-2/panel/page-2/section-3'

  const globalStore = useGlobalStore()
  const menu3Sub2Page2Store = useMenu3Sub2Page2Store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu3Sub2Page2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  const currentTabComponent = computed(
    () => components[menu3Sub2Page2Store.selectedTabId] || TabAComp,
  )

  async function loadConfig() {
    try {
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  async function init() {
    await loadConfig()
  }

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

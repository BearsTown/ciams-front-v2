<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import {
    Menu1Sub1Tab2Page6TabIdType,
    useMenu1Sub1Tab2Page6Store,
  } from '@/stores/app/menu-1/sub-1/tab-B/page-6'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  import CommonUtil from '@/utils/commonUtil'

  import Section1Comp from '@/components/app/menu-1/sub-1/panel/tab-B/page-6/section-1.vue'
  import Section2Comp from '@/components/app/menu-1/sub-1/panel/tab-B/page-6/section-2.vue'

  const globalStore = useGlobalStore()
  const menu1Sub1Page6Store = useMenu1Sub1Tab2Page6Store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu1Sub1Tab2Page6TabIdType, DefineComponent> = {
    TabA: Section1Comp,
    TabB: Section2Comp,
  }

  const currentTabComponent = computed(
    () => components[menu1Sub1Page6Store.selectedTabId] || Section1Comp,
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

<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import Section1Comp from '@/components/app/menu-1/sub-1/panel/tab-B/page-4/section-1.vue'
  import Section2Comp from '@/components/app/menu-1/sub-1/panel/tab-B/page-4/section-2.vue'

  import {
    Menu1Sub1Tab2Page4TabIdType,
    useMenu1Sub1Tab2Page4Store,
  } from '@/stores/app/menu-1/sub-1/tab-B/page-4'
  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const globalStore = useGlobalStore()
  const menu1Sub1Page4Store = useMenu1Sub1Tab2Page4Store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu1Sub1Tab2Page4TabIdType, DefineComponent> = {
    TabA: Section1Comp,
    TabB: Section2Comp,
  }

  const currentTabComponent = computed(
    () => components[menu1Sub1Page4Store.selectedTabId] || Section1Comp,
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

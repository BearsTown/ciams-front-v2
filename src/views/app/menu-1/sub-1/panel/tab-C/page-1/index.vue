<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import Section1Comp from '@/components/app/menu-1/sub-1/panel/tab-C/page-1/section-1.vue'
  import Section2Comp from '@/components/app/menu-1/sub-1/panel/tab-C/page-1/section-2.vue'
  import Section3Comp from '@/components/app/menu-1/sub-1/panel/tab-C/page-1/section-3.vue'
  import Section4Comp from '@/components/app/menu-1/sub-1/panel/tab-C/page-1/section-4.vue'
  import Section5Comp from '@/components/app/menu-1/sub-1/panel/tab-C/page-1/section-5.vue'
  import Section6Comp from '@/components/app/menu-1/sub-1/panel/tab-C/page-1/section-6.vue'

  import {
    Menu1Sub1Tab3Page1TabIdType,
    useMenu1Sub1Tab3Page1Store,
  } from '@/stores/app/menu-1/sub-1/tab-C/page-1'
  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const globalStore = useGlobalStore()
  const menu1Sub1Tab3Page1Store = useMenu1Sub1Tab3Page1Store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu1Sub1Tab3Page1TabIdType, DefineComponent> = {
    TabA: Section1Comp,
    TabB: Section2Comp,
    TabC: Section3Comp,
    TabD: Section4Comp,
    TabE: Section5Comp,
    TabF: Section6Comp,
  }

  const currentTabComponent = computed(
    () => components[menu1Sub1Tab3Page1Store.selectedTabId] || Section1Comp,
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

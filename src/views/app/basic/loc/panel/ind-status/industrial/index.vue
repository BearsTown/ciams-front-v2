<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import Section1Comp from '@/components/app/basic/loc/status/panel/industrial/section-1.vue'
  import Section2Comp from '@/components/app/basic/loc/status/panel/industrial/section-2.vue'

  import {
    BasicLocIndStatusIndustrialTabIdType,
    useBasicLocIndStatusIndustrialStore,
  } from '@/stores/app/basic/loc/ind-status/industrial'

  const basicLocIndStatusIndustrialStore = useBasicLocIndStatusIndustrialStore()

  const components: Record<BasicLocIndStatusIndustrialTabIdType, DefineComponent> = {
    TabA: Section1Comp,
    TabB: Section2Comp,
  }

  const currentTabComponent = computed(
    () => components[basicLocIndStatusIndustrialStore.selectedTabId] || Section1Comp,
  )
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

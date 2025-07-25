<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import Section1Comp from '@/components/app/basic/loc/status/panel/manufacturing/section-1.vue'
  import Section2Comp from '@/components/app/basic/loc/status/panel/manufacturing/section-2.vue'
  import Section3Comp from '@/components/app/basic/loc/status/panel/manufacturing/section-3.vue'

  import {
    BasicLocIndStatusMfgTabIdType,
    useBasicLocIndStatusMfgStore,
  } from '@/stores/app/basic/loc/ind-status/manufacturing'

  const basicLocIndStatusMfgStore = useBasicLocIndStatusMfgStore()

  const components: Record<BasicLocIndStatusMfgTabIdType, DefineComponent> = {
    TabA: Section1Comp,
    TabB: Section2Comp,
    TabC: Section3Comp,
  }

  const currentTabComponent = computed(
    () => components[basicLocIndStatusMfgStore.selectedTabId] || Section1Comp,
  )
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

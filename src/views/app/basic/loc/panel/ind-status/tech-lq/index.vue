<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import Section1Comp from '@/components/app/basic/loc/status/panel/tech-lq/section-1.vue'
  import Section2Comp from '@/components/app/basic/loc/status/panel/tech-lq/section-2.vue'

  import {
    BasicLocIndStatusTechLQTabIdType,
    useBasicLocIndStatusTechLQStore,
  } from '@/stores/app/basic/loc/ind-status/tech-lq'

  const basicLocIndStatusTechLQStore = useBasicLocIndStatusTechLQStore()

  const components: Record<BasicLocIndStatusTechLQTabIdType, DefineComponent> = {
    TabA: Section1Comp,
    TabB: Section2Comp,
  }

  const currentTabComponent = computed(
    () => components[basicLocIndStatusTechLQStore.selectedTabId] || Section1Comp,
  )
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

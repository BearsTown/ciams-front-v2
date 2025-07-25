<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import DensityComp from '@/components/app/basic/loc/status/panel/density'
  import { useBasicLocIndStatusDensityStore } from '@/stores/app/basic/loc/ind-status/density'

  const menu1Sub1Page3Store = useBasicLocIndStatusDensityStore()

  const components: Record<string, DefineComponent> = {
    Density: DensityComp,
  }

  const currentTabComponent = computed(() => {
    if (menu1Sub1Page3Store.selectedTab) return components['Density']
  })
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

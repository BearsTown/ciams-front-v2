<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import ScopeComp from '@/components/app/basic/loc/status/panel/scope'
  import ConditionsComp from '@/components/app/basic/loc/status/panel/conditions'
  import DensityComp from '@/views/app/basic/loc/panel/ind-status/density'
  import IndustrialComp from '@/views/app/basic/loc/panel/ind-status/industrial'
  import MfgComp from '@/views/app/basic/loc/panel/ind-status/manufacturing'
  import TechLQComp from '@/views/app/basic/loc/panel/ind-status/tech-lq'

  import { useBasicLocIndStatusStore } from '@/stores/app/basic/loc/ind-status'

  const basicLocIndStatusStore = useBasicLocIndStatusStore()

  const components: Record<string, DefineComponent> = {
    Page1: ScopeComp,
    Page2: ConditionsComp,
    Page3: DensityComp,
    Page4: IndustrialComp,
    Page5: MfgComp,
    Page6: TechLQComp,
  }

  const currentTabComponent = computed(
    () => components[basicLocIndStatusStore.selectedTabId] || ScopeComp,
  )
</script>

<style scoped lang="scss">
  .border-box-round {
    background: #fff;
    border-radius: 8px;
  }

  :deep(.inside-collapse) {
    > div {
      .title {
        font-size: 13px;
        font-weight: normal;
      }
    }
  }
</style>

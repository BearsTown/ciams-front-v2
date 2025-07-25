<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import PlansComp from '@/components/app/basic/loc/general/panel/plans'
  import DataComp from '@/components/app/basic/loc/general/panel/data'

  import { useBasicLocGeneralStore } from '@/stores/app/basic/loc/general'

  const menu1Sub1Page1Store = useBasicLocGeneralStore()

  const components: Record<string, DefineComponent> = {
    '999': PlansComp,
  }

  const currentTabComponent = computed(
    () => components[menu1Sub1Page1Store.selectedMenu.id] || DataComp,
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

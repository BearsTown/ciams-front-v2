<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'
  import Section2Comp from '@/components/app/basic/loc/characteristic/panel/adjacent'

  const components: Record<string, DefineComponent> = {
    etcSGG: Section2Comp,
  }

  const currentTabComponent = computed(() => {
    return components['etcSGG']
  })
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

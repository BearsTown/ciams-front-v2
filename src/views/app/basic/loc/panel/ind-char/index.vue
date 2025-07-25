<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import ITAComp from '@/views/app/basic/loc/panel/ind-char/ita'
  import AdjacentComp from '@/views/app/basic/loc/panel/ind-char/adjacent'
  import { useBasicLocIndCharStore } from '@/stores/app/basic/loc/ind-char'

  const basicLocIndCharStore = useBasicLocIndCharStore()

  const components: Record<string, DefineComponent> = {
    Page1: ITAComp,
    Page2: AdjacentComp,
  }

  const currentTabComponent = computed(
    () => components[basicLocIndCharStore.selectedTabId] || ITAComp,
  )
</script>

<style scoped lang="scss"></style>

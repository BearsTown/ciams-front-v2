<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import ITAComp from '@/components/app/basic/loc/characteristic/panel/ITA/ITA.vue'
  import LeadersComp from '@/components/app/basic/loc/characteristic/panel/ITA/Leaders.vue'
  import NewlyComp from '@/components/app/basic/loc/characteristic/panel/ITA/Newly.vue'
  import DeclineComp from '@/components/app/basic/loc/characteristic/panel/ITA/Decline.vue'
  import InitialComp from '@/components/app/basic/loc/characteristic/panel/ITA/Initial.vue'
  import ResultsComp from '@/components/app/basic/loc/characteristic/panel/ITA/Results.vue'

  import {
    BasicLocIndCharITATabIdType,
    useBasicLocIndCharITAStore,
  } from '@/stores/app/basic/loc/ind-char/ITA'

  const basicLocIndCharITAStore = useBasicLocIndCharITAStore()

  const components: Record<BasicLocIndCharITATabIdType, DefineComponent> = {
    TabA: ITAComp,
    TabB: LeadersComp,
    TabC: NewlyComp,
    TabD: DeclineComp,
    TabE: InitialComp,
    TabF: ResultsComp,
  }

  const currentTabComponent = computed(
    () => components[basicLocIndCharITAStore.selectedTabId] || ITAComp,
  )
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

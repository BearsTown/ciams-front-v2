<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import GeneralComp from '@/views/app/basic/loc/panel/general'
  import StatusComp from '@/views/app/basic/loc/panel/ind-status'
  import CharComp from '@/views/app/basic/loc/panel/ind-char'

  import { BasicLocTabIdType, useBasicLocStore } from '@/stores/app/basic/loc'

  const basicLocStore = useBasicLocStore()

  const components: Record<BasicLocTabIdType, DefineComponent> = {
    TabA: GeneralComp,
    TabB: StatusComp,
    TabC: CharComp,
  }

  const currentTabComponent = computed(() => components[basicLocStore.selectedTabId] || GeneralComp)

  async function init() {}

  onBeforeMount(() => {
    init()
  })
</script>

<style scoped lang="scss">
  .panel {
    width: 100%;
    height: 100%;
    padding: 10px;
    //padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

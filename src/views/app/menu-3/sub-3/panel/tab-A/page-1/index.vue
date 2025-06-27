<template>
  <Page1 />
</template>

<script setup lang="ts">
  import { onBeforeMount } from 'vue'

  import Page1 from '@/components/app/menu-3/sub-3/panel/tab-A/page-1'

  import CommonUtil from '@/utils/commonUtil'
  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()

  async function loadConfig() {
    try {
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  async function init() {
    await loadConfig()
  }

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

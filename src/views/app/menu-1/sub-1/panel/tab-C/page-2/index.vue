<template>
  <keep-alive>
    <component :is="currentTabComponent" />
  </keep-alive>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub1Tab3Page2Store } from '@/stores/app/menu-1/sub-1/tab-C/page-2'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  import CommonUtil from '@/utils/commonUtil'

  import Section1Comp from '@/components/app/menu-1/sub-1/panel/tab-C/page-2/section-1.vue'
  import Section2Comp from '@/components/app/menu-1/sub-1/panel/tab-C/page-2/section-2.vue'

  const globalStore = useGlobalStore()
  const menu1Sub1Tab3Page2Store = useMenu1Sub1Tab3Page2Store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<string, DefineComponent> = {
    TabA: Section1Comp,
    etcSGG: Section2Comp,
  }

  const currentTabComponent = computed(() => {
    switch (menu1Sub1Tab3Page2Store.selectedTab?.type) {
      case 'TabA': {
        return components['TabA']
      }
      case 'etcSGG': {
        return components['etcSGG']
      }
    }
  })

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
    height: 100%;
    padding: 15px 12px;
    background-color: #f4f4f4;
  }
</style>

<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { Menu1Sub1TabIdType, useMenu1Sub1store } from '@/stores/app/menu-1/sub-1'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  import CommonUtil from '@/utils/commonUtil'

  import TabAComp from '@/views/app/menu-1/sub-1/panel/tab-A'
  import TabBComp from '@/components/app/menu-1/sub-1/panel/tab-B'
  import TabCComp from '@/components/app/menu-1/sub-1/panel/tab-C'

  const globalStore = useGlobalStore()
  const menu1sub1store = useMenu1Sub1store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu1Sub1TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  const currentTabComponent = computed(() => components[menu1sub1store.selectedTabId] || TabAComp)

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

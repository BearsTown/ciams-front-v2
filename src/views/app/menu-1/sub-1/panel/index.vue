<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import TabAComp from '@/components/app/menu-1/sub-1/panel/tab-A'
  import TabBComp from '@/components/app/menu-1/sub-1/panel/tab-B'
  import TabCComp from '@/components/app/menu-1/sub-1/panel/tab-C'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { Menu1Sub1TabIdType, useMenu1Sub1store } from '@/stores/app/menu-1/sub-1'

  const globalStore = useGlobalStore()
  const menu1sub1store = useMenu1Sub1store()
  const cmmConfigStore = useCmmConfigStore()

  const components: Record<Menu1Sub1TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  const currentTabComponent = computed(() => components[menu1sub1store.selectedTabId] || TabAComp)

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

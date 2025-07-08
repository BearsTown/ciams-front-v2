<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onBeforeMount } from 'vue'

  import TabAComp from '@/views/app/menu-3/sub-3/panel/tab-A'
  import TabBComp from '@/views/app/menu-3/sub-3/panel/tab-B'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { Menu3Sub3TabIdType, useMenu3Sub3store } from '@/stores/app/menu-3/sub-3'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()
  const menu3sub3store = useMenu3Sub3store()

  const components: Record<Menu3Sub3TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
  }

  const currentTabComponent = computed(() => components[menu3sub3store.selectedTabId] || TabAComp)

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

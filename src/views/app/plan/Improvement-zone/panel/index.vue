<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import TabAComp from '@/views/app/plan/Improvement-zone/panel/tab-A'
  import TabBComp from '@/views/app/plan/Improvement-zone/panel/tab-B'

  import { Menu3Sub3TabIdType, useMenu3Sub3store } from '@/stores/app/plan/Improvement-zone'

  const menu3sub3store = useMenu3Sub3store()

  const components: Record<Menu3Sub3TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
  }

  const currentTabComponent = computed(() => components[menu3sub3store.selectedTabId] || TabAComp)
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

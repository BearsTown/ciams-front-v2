<template>
  <div class="zoningSetting">
    <ul class="zoningSetting-tab customTab">
      <li
        v-for="(tab, index) in menu3sub3store.tabList"
        :key="index"
        @click.prevent="handleTabChange(tab.id)"
        :class="{ active: menu3sub3store.selectedTabId == tab.id }"
        class="customTab-item"
      >
        {{ tab.name }}
      </li>
    </ul>

    <div class="zoningSetting-content border-container">
      <keep-alive>
        <component :is="currentTabComponent" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import TabAComp from '@/components/app/plan/Improvement-zone/left/tab-A'
  import TabBComp from '@/components/app/plan/Improvement-zone/left/tab-B'

  import { MapWrapper } from '@/js/mapWrapper'
  import { useBoolean } from '@/hooks/useBoolean'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { Menu3Sub3TabIdType, useMenu3Sub3store } from '@/stores/app/plan/Improvement-zone'

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const { status: isActive, toggle } = useBoolean(false)

  const cmmConfigStore = useCmmConfigStore()
  const menu3sub3store = useMenu3Sub3store()

  const components: Record<Menu3Sub3TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
  }
  const currentTabComponent = computed(() => components[menu3sub3store.selectedTabId] || TabAComp)

  const mapWrap = ref<MapWrapper>()

  function handleTabChange(tabId: Menu3Sub3TabIdType) {
    menu3sub3store.selectedTabId = tabId

    switch (menu3sub3store.selectedTabId) {
      case 'TabA': {
        // isActiveTimePoint.value = false
        // layoutSelected.value?.right?.visible.off()
        break
      }
      case 'TabB': {
        // isActiveTimePoint.value = false
        // layoutSelected.value?.right?.visible.off()

        break
      }
    }
  }

  onMounted(() => {
    handleTabChange(menu3sub3store.selectedTabId)
  })
</script>

<style scoped lang="scss">
  .urbanInfo {
    padding: 0;
  }

  .zoningSetting-top {
    min-height: 0px;
    padding: 10px;
  }

  .zoningSetting-tab {
    margin: 0;
  }

  .customTab {
    display: flex;
    overflow: visible;
    padding: 10px 0 10px 0;
    justify-content: space-between;

    .customTab-item {
      flex: 1;
      padding: 0 !important;
      //margin-left: 5px !important;
      background-color: white;
      border-radius: 0;
      box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.12);
    }

    .customTab-item:first-child {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .zoningSetting .zoningSetting-top .customSelect {
    border: 0;
  }

  .zoningSetting-top.customCard .customSelect-value {
    font-size: 14px;
    border: 0;
    padding: 0;
  }

  .zoningSetting .customTab-item:not(.disabled).active {
    background: #7aaad1;
    color: #fff;
  }
</style>

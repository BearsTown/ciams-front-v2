<template>
  <div class="zoningSetting">
    <ul class="zoningSetting-tab customTab">
      <li
        v-for="(tab, index) in basicLocStore.tabList"
        :key="index"
        @click.prevent="handleTabChange(tab.id)"
        :class="{ active: basicLocStore.selectedTabId === tab.id }"
        class="customTab-item"
      >
        {{ tab.name }}
      </li>
    </ul>

    <div class="border-container container customScroll" style="flex: 1">
      <keep-alive>
        <component :is="currentTabComponent" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'

  import GeneralLeftComp from '@/components/app/basic/loc/general/left'
  import StatusLeftComp from '@/components/app/basic/loc/status/left'
  import CharLeftComp from '@/components/app/basic/loc/characteristic/left'

  import { useBoolean } from '@/hooks/useBoolean'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { BasicLocTabIdType, useBasicLocStore } from '@/stores/app/basic/loc'

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const { status: isActive, toggle } = useBoolean(false)

  const cmmConfigStore = useCmmConfigStore()
  const basicLocStore = useBasicLocStore()

  const components: Record<BasicLocTabIdType, DefineComponent> = {
    TabA: GeneralLeftComp,
    TabB: StatusLeftComp,
    TabC: CharLeftComp,
  }

  const currentTabComponent = computed(
    () => components[basicLocStore.selectedTabId] || GeneralLeftComp,
  )

  function handleTabChange(tabId: BasicLocTabIdType) {
    basicLocStore.selectedTabId = tabId
  }

  onMounted(() => {
    handleTabChange(basicLocStore.selectedTabId)
  })
</script>

<style scoped lang="scss">
  .urbanInfo {
    padding: 0;
  }

  .zoningSetting-top {
    min-height: 0;
    padding: 10px;
  }

  .zoningSetting-tab {
    margin: 0;
  }

  .customTab {
    display: flex;
    padding: 10px 0 10px 0;
    justify-content: space-between;

    .customTab-item {
      flex: 1;
      padding: 0 !important;
      //margin-left: 5px !important;
      background-color: white;
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

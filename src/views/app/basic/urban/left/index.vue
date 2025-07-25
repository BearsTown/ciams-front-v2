<template>
  <div class="zoningSetting">
    <ul class="zoningSetting-tab customTab">
      <li
        v-for="(tab, index) in basicUrbanStore.tabList"
        :key="index"
        @click.prevent="handleTabChange(tab.id)"
        :class="{ active: basicUrbanStore.selectedTabId == tab.id }"
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
  import { computed, DefineComponent, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'

  import DistrictLeftComp from '@/components/app/basic/urban/district/left'
  import CompanyLeftComp from '@/components/app/basic/urban/company/left'
  import IndCharLeftComp from '@/components/app/basic/urban/ind-char/left'

  import { useBoolean } from '@/hooks/useBoolean'

  import { useGlobalStore } from '@/stores/app'
  import { BasicUrbanTabIdType, useBasicUrbanStore } from '@/stores/app/basic/urban'

  const globalStore = useGlobalStore()
  const basicUrbanStore = useBasicUrbanStore()

  const { layoutSelected } = storeToRefs(globalStore)

  const { status: isActive, toggle } = useBoolean(false)

  const components: Record<BasicUrbanTabIdType, DefineComponent> = {
    TabB: DistrictLeftComp,
    TabC: CompanyLeftComp,
    TabD: IndCharLeftComp,
  }

  const currentTabComponent = computed(
    () => components[basicUrbanStore.selectedTabId] || DistrictLeftComp,
  )

  function handleTabChange(tabId: BasicUrbanTabIdType) {
    basicUrbanStore.selectedTabId = tabId
  }

  onMounted(() => {
    handleTabChange(basicUrbanStore.selectedTabId)
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
    padding: 10px 0 10px 0;
    justify-content: space-between;

    .customTab-item {
      flex: 1;
      padding: 0;
      margin-left: 5px;
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

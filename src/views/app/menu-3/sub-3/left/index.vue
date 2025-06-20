<template>
  <div class="zoningSetting">
    <div class="zoningSetting-top customCard">
      <div style="display: flex">
        <div style="flex: 1; display: flex; align-items: center">정비구역계획</div>
        <div style=""></div>
      </div>
    </div>

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
  import { computed, defineComponent, DefineComponent, onActivated, onMounted, ref } from 'vue'

  import TabAComp from '@/components/app/menu-1/sub-1/left/tab-A'
  import { useBoolean } from '@/hooks/useBoolean'
  import { useGlobalStore } from '@/stores/app'
  import { Menu3Sub3TabIdType, useMenu3Sub3store } from '@/stores/app/menu-3/sub-3'

  import { MapWrapper } from '@/js/mapWrapper'
  import { storeToRefs } from 'pinia'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const { status: isActive, toggle } = useBoolean(false)

  const cmmConfigStore = useCmmConfigStore()
  const menu3sub3store = useMenu3Sub3store()

  const TabA = defineComponent({
    name: 'TabA',
    template: `<el-text>산업혁신구역계획</el-text>`,
  })

  const TabB = defineComponent({
    name: 'TabB',
    template: `<el-text>산업정비구역계획</el-text>`,
  })

  const components: Record<Menu3Sub3TabIdType, DefineComponent> = {
    TabA: TabA,
    TabB: TabB,
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

  onActivated(() => {})

  defineExpose({})
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
      padding: 0 !important;
      margin-left: 5px !important;
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

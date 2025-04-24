<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <div class="border-container">
      <template v-for="(tab, index) in menu1Sub1Store.tabList" :key="tab">
        <MenuCollapse
          class="menuButton"
          ref="childRefs"
          :title="tab.name"
          type=""
          :is-open="menu1Sub1Store.selectedTabId === tab.id"
          :is-child="tab.isChild"
          @open-change="(isOpen: boolean) => handleCustomEvent(isOpen, tab.id, index)"
        >
          <template #content>
            <component :is="tabRef(tab.id)" />
          </template>
        </MenuCollapse>

        <el-divider
          v-if="index < menu1Sub1Store.tabList.length - 1"
          style="margin: 10px 0"
          border-style="dashed"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onActivated, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useBoolean } from '@/hooks/useBoolean'
  import { useGlobalStore } from '@/stores/app'
  import { useMenu3store } from '@/stores/app/menu-3'
  import { Menu1Sub1Tab3TabIdType, useMenu1Sub1Tab3Store } from 'src/stores/app/menu-1/sub-1/tab-C'

  import { Style } from 'ol/style'
  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'
  import Page1Comp from '@/components/app/menu-1/sub-1/left/tab-C/Page-1.vue'
  import Page2Comp from '@/components/app/menu-1/sub-1/left/tab-C/Page-2.vue'

  const menu3store = useMenu3store()
  const menu1Sub1Store = useMenu1Sub1Tab3Store()

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)

  const components: Record<string, DefineComponent> = {
    Page1: Page1Comp,
    Page2: Page2Comp,
  }
  const currentTabComponent = computed(() => components[menu1Sub1Store.selectedTabId] || Page1Comp)

  const tabRef = computed(() => (type: Menu1Sub1Tab3TabIdType) => components[type])

  const childRefs = ref<MenuCollapse[]>([])

  function handleCustomEvent(isOpen: boolean, id: Menu1Sub1Tab3TabIdType, index: number) {
    if (!isOpen) return

    console.log(menu1Sub1Store.tabList.filter((value) => value.id !== id))

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    menu1Sub1Store.selectTab(id)
  }

  function load() {}

  onMounted(async () => {
    load()
  })

  onActivated(() => {})
</script>

<style lang="scss">
  .zoningSetting .zoningSetting-top .customSelect {
    border: 0;
  }

  .zoningSetting-top.customCard .customSelect-value {
    font-size: 14px;
    border: 0;
    padding: 0;
  }

  .zoningSetting .customTab-item:not(.disabled).active {
    background: #52b597;
    color: #fff;
  }
</style>

<style scoped lang="scss">
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
      margin-left: 10px;
      background-color: white;
    }

    .customTab-item:first-child {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .menuButton {
    overflow-y: hidden;

    &:not(:first-child) {
      //margin-top: 8px;
    }
  }
</style>

<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <template v-for="(tab, index) in menu3Sub2Store.tabList" :key="tab">
      <MenuCollapse
        class="menuButton"
        ref="childRefs"
        :title="tab.name"
        type=""
        :is-open="menu3Sub2Store.selectedTabId === tab.id"
        :is-child="tab.isChild"
        @open-change="(isOpen: boolean) => handleCustomEvent(isOpen, tab.id, index)"
      >
        <template #content>
          <component :is="tabRef(tab.id)" />
        </template>
      </MenuCollapse>

      <el-divider
        v-if="index < menu3Sub2Store.tabList.length - 1"
        style="margin: 10px 0"
        border-style="dashed"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onActivated, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'
  import Page3Comp from '@/components/app/menu-1/sub-1/left/tab-B/Page-3.vue'
  import Page4Comp from '@/components/app/menu-1/sub-1/left/tab-B/Page-4.vue'
  import Page5Comp from '@/components/app/menu-1/sub-1/left/tab-B/Page-5.vue'
  import Page6Comp from '@/components/app/menu-1/sub-1/left/tab-B/Page-6.vue'

  import { Style } from 'ol/style'

  import { useBoolean } from '@/hooks/useBoolean'

  import { useGlobalStore } from '@/stores/app'
  import { Menu1Sub1Tab2TabIdType, useMenu1Sub1Tab2Store } from '@/stores/app/menu-1/sub-1/tab-B'

  const menu3Sub2Store = useMenu1Sub1Tab2Store()

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)

  const components: Record<string, DefineComponent> = {
    // Page1: TabAComp,
    // Page2: TabBComp,
    Page3: Page3Comp,
    Page4: Page4Comp,
    Page5: Page5Comp,
    Page6: Page6Comp,
  }
  // const currentTabComponent = computed(() => components[menu3Sub2Store.selectedTabId] || Page3Comp)

  const tabRef = computed(() => (type: Menu1Sub1Tab2TabIdType) => components[type])

  const childRefs = ref<MenuCollapse[]>([])

  function handleCustomEvent(isOpen: boolean, id: Menu1Sub1Tab2TabIdType, index: number) {
    if (!isOpen) return

    console.log(menu3Sub2Store.tabList.filter((value) => value.id !== id))

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    menu3Sub2Store.selectTab(id)
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
    background: #7aaad1;
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
    //overflow-y: hidden;

    &:not(:first-child) {
      //margin-top: 8px;
    }
  }
</style>

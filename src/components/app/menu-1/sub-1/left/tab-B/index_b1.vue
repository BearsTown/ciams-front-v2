<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <div class="border-container">
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
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onActivated, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useBoolean } from '@/hooks/useBoolean'
  import { useGlobalStore } from '@/stores/app'
  import { useMenu3store } from '@/stores/app/menu-3'
  import { Menu1Sub1Tab2TabIdType, useMenu1Sub1Tab2Store } from 'src/stores/app/menu-1/sub-1/tab-B'

  import { Style } from 'ol/style'
  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'
  import TabAComp from '@/components/app/menu-1/sub-1/left/tab-B/Page-3.vue'
  import TabBComp from '@/components/app/menu-1/sub-1/left/tab-B/Page-3.vue'
  import TabCComp from '@/components/app/menu-1/sub-1/left/tab-B/Page-3.vue'

  const menu3store = useMenu3store()
  const menu3Sub2Store = useMenu1Sub1Tab2Store()


  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)

  const components: Record<Menu1Sub1Tab2TabIdType, DefineComponent> = {
    Page1: TabAComp,
    Page2: TabBComp,
    Page3: TabCComp,
    Page4: TabAComp,
    Page5: TabBComp,
    Page6: TabBComp,
  }
  const currentTabComponent = computed(() => components[menu3Sub2Store.selectedTabId] || TabAComp)

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
    background: #7AAAD1;
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

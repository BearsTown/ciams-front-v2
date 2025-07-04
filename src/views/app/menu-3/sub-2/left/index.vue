<template>
  <div style="display: flex; width: 100%; height: 100%; padding: 10px; flex-direction: column">
    <div class="border-container">
      <template v-for="(tab, index) in menu3Sub2Store.tabList" :key="tab">
        <MenuCollapse
          class="menuButton"
          ref="childRefs"
          :title="`${index + 1}. ${tab.name}`"
          type=""
          align="left"
          :is-open="menu3Sub2Store.selectedTabId === tab.id"
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
  import { Menu3Sub2TabIdType, useMenu3Sub2Store } from '@/stores/app/menu-3/sub-2'

  import { Style } from 'ol/style'
  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'
  import TabAComp from '@/components/app/menu-3/sub-2/left/page-1/Tab-A.vue'
  import TabBComp from '@/components/app/menu-3/sub-2/left/page-2/Tab-A.vue'
  import TabCComp from '@/components/app/menu-3/sub-2/left/page-3/Tab-A.vue'

  const menu3store = useMenu3store()
  const menu3Sub2Store = useMenu3Sub2Store()
  // const { tabList } = storeToRefs(menu3Sub2Store)

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)

  const components: Record<Menu3Sub2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }
  const currentTabComponent = computed(() => components[menu3Sub2Store.selectedTabId] || TabAComp)

  const tabRef = computed(() => (type: Menu3Sub2TabIdType) => components[type])

  const childRefs = ref<MenuCollapse[]>([])

  function handleCustomEvent(isOpen: boolean, id: Menu3Sub2TabIdType, index: number) {
    console.log(isOpen)
    console.log(id)

    if (!isOpen) return

    console.log(menu3Sub2Store.tabList.filter((value) => value.id !== id))

    // menu3Sub2Store.tabList.filter((value) => value.id !== id).forEach((value) => {})

    childRefs.value.forEach((child, i) => {
      console.log(child)

      // child.setOpen(false)

      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    menu3Sub2Store.selectTab(id)
  }

  function load() {}
  onMounted(async () => {})

  onActivated(() => {})
</script>

<style lang="scss">
  //@import '@/assets/css/zoningSetting.css';

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
    overflow-y: hidden;

    &:not(:first-child) {
      //margin-top: 8px;
    }
  }
</style>

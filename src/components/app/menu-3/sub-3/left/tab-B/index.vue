<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <template v-for="(tab, index) in menu3Sub3TabBStore.tabList" :key="tab">
      <MenuCollapse
        class="menuButton"
        ref="childRefs"
        :title="`${index + 1}. ${tab.name}`"
        type=""
        align="left"
        :is-open="menu3Sub3TabBStore.selectedTabId === tab.id"
        :is-child="tab.isChild"
        @open-change="(isOpen: boolean) => handleCustomEvent(isOpen, tab.id, index)"
      >
        <template #content>
          <component :is="tabRef(tab.id)" />
        </template>
      </MenuCollapse>

      <el-divider
        v-if="index < menu3Sub3TabBStore.tabList.length - 1"
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

  import { Style } from 'ol/style'

  import { useBoolean } from '@/hooks/useBoolean'

  import { useGlobalStore } from '@/stores/app'
  import { Menu3Sub3TabBTabIdType, useMenu3Sub3TabBStore } from '@/stores/app/menu-3/sub-3/tab-B'

  const menu3Sub3TabBStore = useMenu3Sub3TabBStore()

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)

  const components: Record<string, DefineComponent> = {
    // Page1: Page3Comp,
    // Page2: Page3Comp,
    // Page3: Page3Comp,
    // Page4: Page4Comp,
    // Page5: Page5Comp,
    // Page6: Page6Comp,
    // Page7: Page6Comp,
    // Page8: Page6Comp,
    // Page9: Page6Comp,
  }

  const tabRef = computed(() => (type: Menu3Sub3TabBTabIdType) => components[type])

  const childRefs = ref<MenuCollapse[]>([])

  function handleCustomEvent(isOpen: boolean, id: Menu3Sub3TabBTabIdType, index: number) {
    if (!isOpen) return

    console.log(menu3Sub3TabBStore.tabList.filter((value) => value.id !== id))

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    menu3Sub3TabBStore.selectTab(id)
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
    overflow-y: hidden;

    &:not(:first-child) {
      //margin-top: 8px;
    }
  }
</style>

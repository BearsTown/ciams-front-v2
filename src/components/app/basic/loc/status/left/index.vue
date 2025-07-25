<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <template v-for="(tab, index) in basicLocIndStatusStore.tabList" :key="tab">
      <MenuCollapse
        class="menuButton"
        ref="childRefs"
        :title="tab.name"
        type=""
        :is-open="basicLocIndStatusStore.selectedTabId === tab.id"
        :is-child="tab.isChild"
        @open-change="(isOpen: boolean) => handleCustomEvent(isOpen, tab.id, index)"
      >
        <template #content>
          <component :is="tabRef(tab.id)" />
        </template>
      </MenuCollapse>

      <el-divider
        v-if="index < basicLocIndStatusStore.tabList.length - 1"
        style="margin: 10px 0"
        border-style="dashed"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'
  import DensityComp from '@/components/app/basic/loc/status/left/Density.vue'
  import IndustrialComp from '@/components/app/basic/loc/status/left/Industrial.vue'
  import MfgComp from '@/components/app/basic/loc/status/left/Manufacturing.vue'
  import TechLQComp from '@/components/app/basic/loc/status/left/Tech-LQ.vue'

  import { Style } from 'ol/style'

  import { useBoolean } from '@/hooks/useBoolean'

  import { useGlobalStore } from '@/stores/app'
  import {
    BasicLocIndStatusTabIdType,
    useBasicLocIndStatusStore,
  } from '@/stores/app/basic/loc/ind-status'

  const basicLocIndStatusStore = useBasicLocIndStatusStore()

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)

  const components: Record<string, DefineComponent> = {
    // Page1: TabAComp,
    // Page2: TabBComp,
    Page3: DensityComp,
    Page4: IndustrialComp,
    Page5: MfgComp,
    Page6: TechLQComp,
  }

  const tabRef = computed(() => (type: BasicLocIndStatusTabIdType) => components[type])

  const childRefs = ref<MenuCollapse[]>([])

  function handleCustomEvent(isOpen: boolean, id: BasicLocIndStatusTabIdType, index: number) {
    if (!isOpen) return

    console.log(basicLocIndStatusStore.tabList.filter((value) => value.id !== id))

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    basicLocIndStatusStore.selectTab(id)
  }
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

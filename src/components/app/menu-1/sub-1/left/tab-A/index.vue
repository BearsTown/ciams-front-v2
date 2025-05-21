<template>
  <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
    <template v-for="(tab, index) in statusList" :key="tab.id">
      <MenuCollapse
        class="menuButton"
        ref="childRefs"
        :title="tab.title"
        type=""
        :is-open="false"
        :is-child="tab.children?.length > 0"
        @open-change="(isOpen: boolean) => handleCustomEvent(isOpen, tab, index)"
      >
        <template #content>
          <template v-for="child in tab.children" :key="child.id">
            <ActiveButton
              ref="activeBtnChildRefs"
              :title="child.title"
              :is-active="selectedItem?.id === child?.id"
              @change:active="(isActive: boolean) => handleStatusGroupChange(isActive, child)"
            />
          </template>
        </template>
      </MenuCollapse>

      <el-divider
        v-if="index < statusList.length - 1"
        style="margin: 10px 0"
        border-style="dashed"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { DefineComponent, nextTick, onActivated, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useBoolean } from '@/hooks/useBoolean'
  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub1Tab1Store } from '@/stores/app/menu-1/sub-1/tab-A'

  import { Style } from 'ol/style'
  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'
  import Page3Comp from '@/components/app/menu-1/sub-1/left/tab-B/Page-3.vue'
  import Page4Comp from '@/components/app/menu-1/sub-1/left/tab-B/Page-4.vue'
  import Page5Comp from '@/components/app/menu-1/sub-1/left/tab-B/Page-5.vue'
  import Page6Comp from '@/components/app/menu-1/sub-1/left/tab-B/Page-6.vue'
  import ActiveButton from '@/components/common/ActiveButton.vue'
  import { test_getMenu1_1_1Data } from '@/api/app/menu-1/sub-1/tab-a'

  const menu1Sub1Tab1Store = useMenu1Sub1Tab1Store()

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const { selectedItem } = storeToRefs(menu1Sub1Tab1Store)

  const { status: isActive, toggle } = useBoolean(false)

  // const statusList = ref([
  //   { name: '토지', id: 'Page1', isActive: false, isChild: true },
  //   { name: '인구', id: 'Page2', isActive: false, isChild: true },
  //   { name: '경제', id: 'Page3', isActive: false, isChild: true },
  //   { name: '산업', id: 'Page4', isActive: false, isChild: true },
  // ])

  const statusList = ref<any[]>([])

  const selectedMenu = ref<object | null>(null)
  // const selectedStatusGroup = ref<object | null>(null)

  const params = ref({
    title: '',
    menu: '',
  })

  const components: Record<string, DefineComponent> = {
    // Page1: TabAComp,
    // Page2: TabBComp,
    Page3: Page3Comp,
    Page4: Page4Comp,
    Page5: Page5Comp,
    Page6: Page6Comp,
  }
  const childRefs = ref<MenuCollapse[]>([])
  const activeBtnChildRefs = ref<ActiveButton[]>([])

  function handleCustomEvent(isOpen: boolean, menu: object, index: number) {
    if (!isOpen) return

    childRefs.value.forEach((child, i) => {
      if (i !== index && child?.setOpen) {
        child.setOpen(false)
      }
    })

    selectedMenu.value = menu
  }

  function handleStatusGroupChange(isActive: boolean, item: object) {
    if (!isActive) return
    // selectedItem.value = item

    console.log(`item ${item}; ${isActive}`)
    menu1Sub1Tab1Store.setStatusGroup(selectedMenu.value!, item)
  }

  async function load() {
    const { data } = await test_getMenu1_1_1Data()
    statusList.value = data

    await nextTick()

    childRefs.value[0]?.setOpen(true)
    selectedItem.value = statusList.value[0]?.children?.[0]
  }

  // const selected = ref()

  onMounted(async () => {
    await load()
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

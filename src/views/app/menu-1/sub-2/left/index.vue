<template>
  <div class="zoningSetting">
    <ul class="zoningSetting-tab customTab">
      <li
        v-for="(tab, index) in menu1sub2store.tabList"
        :key="index"
        @click.prevent="handleTabChange(tab.id)"
        :class="{ active: menu1sub2store.selectedTabId == tab.id }"
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
  import { computed, DefineComponent, onActivated, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import TabAComp from '@/components/app/menu-1/sub-2/left/Tab-A.vue'
  import TabBComp from '@/components/app/menu-1/sub-2/left/Tab-B.vue'
  import TabCComp from '@/components/app/menu-1/sub-2/left/Tab-C.vue'
  import TabDComp from '@/components/app/menu-1/sub-2/left/Tab-D.vue'

  import { MapWrapper } from '@/js/mapWrapper'
  import { useBoolean } from '@/hooks/useBoolean'

  import { getConfigList } from '@/api/app/config'

  import { useGlobalStore } from '@/stores/app'
  import { Menu1Sub2TabIdType, useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const { status: isActive, toggle } = useBoolean(false)

  const menu1sub2store = useMenu1Sub2store()

  const timePoint = ref()
  const gosiList = ref<any[]>([])
  const planName = ref('')

  // const currentTab = ref('TabA')
  // const tabList = [
  //   { name: '일반현황', id: 'TabA', component: TabA },
  //   { name: '산업현황분석', id: 'TabB', component: TabB },
  //   { name: '산업특성분석', id: 'TabC', component: TabC },
  // ]

  // const tabList = menu1store.tabList

  const components: Record<Menu1Sub2TabIdType, DefineComponent> = {
    // TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
    TabD: TabDComp,
  }

  // const currentTabComponent = computed(() => {
  //   return menu1store.tabList.find((tab) => tab.id === menu1store.currentTabId)?.component || null
  // })

  const currentTabComponent = computed(() => components[menu1sub2store.selectedTabId] || TabAComp)

  const gosiOption = ref<{ label: string; value: any }[]>([])

  const mapWrap = ref<MapWrapper>()

  const showInfoRef = ref<boolean>(false)

  function showInfo() {
    // menu1store.showInfo.on()
    showInfoRef.value = true
  }

  function handleTabChange(tabId: Menu1Sub2TabIdType) {
    menu1sub2store.selectedTabId = tabId

    switch (menu1sub2store.selectedTabId) {
      // 용도지역현황
      // case 'TabA': {
      // isActiveTimePoint.value = false
      // layoutSelected.value?.right?.visible.off()
      //   break
      // }
      // 수립대상지역
      case 'TabB': {
        // isActiveTimePoint.value = false
        // layoutSelected.value?.right?.visible.off()

        break
      }
      // 대상지현황
      case 'TabC': {
        // isActiveTimePoint.value = false
        // layoutSelected.value?.right?.visible.on()
        // layoutSelected.value?.right?.collapse?.on()

        break
      }
    }
    // managementStore.setSelectStep(tabId)
  }

  function handleInfoClick() {
    // const gosi = gosiList.value.find((element) => element.value === planId.value)
    // if (gosi) window.open(gosi.gosiUrl, '_blank')
  }

  function setMapDefault() {
    // const currentMap = mapUtil.getCurrentMapFromMapStore()
    // if (!currentMap) return false
    // const currentView = currentMap.getView()
    // const cmmConfig = useCmmConfig()
    // const mapCenter = cmmConfig.state.MAP_INIT_CENTER.confValue ?? 7
    // const mapZoom = cmmConfig.state.MAP_INIT_ZOOM.confValue ?? '[14250000, 4353402]'
    // currentView.setCenter(JSON.parse(mapCenter))
    // currentView.setZoom(+mapZoom)
  }

  function changePlanId(value: string | number | boolean): void {
    const find = gosiList.value.find((item) => value == item.value)
    // useKeyLayerStore().setPlanState(find.value)
    // changeLabelLayer(find.value)
    setMapDefault()

    // planId.value = find.value
    // planConfig.value = find
    planName.value = find.title

    // useSummaryStore().selectGosi = {
    //   key: find.key,
    //   title: find.title,
    // }
    // useSummaryStore().getMasterSumList(find.key)
  }

  // watch(mapWrap, () => {
  // handleTabChange('TabC')
  // })

  async function fetchData() {
    await getConfigList({ confType: 'GOSI_CONFIG', used: true }).then((res) => {
      gosiList.value = res.data.map((a) => {
        return {
          key: a.id,
          value: a.id,
          gosiUrl: a.confValue,
          title: a.confName,
          planAreaCode: a.confDesc,
        }
      })

      gosiOption.value = res.data.map((a) => {
        return {
          value: a.id,
          label: a.confName,
        }
      })

      timePoint.value = gosiList.value[0].value

      changePlanId(gosiList.value[0].value)
    })
  }

  fetchData()

  onMounted(() => {
    handleTabChange(menu1sub2store.selectedTabId)
  })

  onActivated(() => {
    // handleTabChange('TabB')
    // handleTabChange('TabC')
  })

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

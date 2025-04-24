<template>
  <div class="zoningSetting">
    <div class="zoningSetting-top customCard">
      <div style="display: flex">
        <div style="flex: 1">김천시 현황</div>
        <div style="">
          <button type="button" class="btn-control" @click="showImage()">
            <SvgIcon name="view-type" :size="15" />
          </button>

          <el-image
            ref="imageRef"
            :preview-teleported="true"
            fit="cover"
            style="width: 0; height: 0"
            :preview-src-list="srcList"
          />
        </div>
      </div>
    </div>

    <ul class="zoningSetting-tab customTab">
      <li
        v-for="(tab, index) in menu1sub1store.tabList"
        :key="index"
        @click.prevent="handleTabChange(tab.id)"
        :class="{ active: menu1sub1store.selectedTabId == tab.id }"
        class="customTab-item"
      >
        {{ tab.name }}
      </li>
    </ul>

    <div class="zoningSetting-content">
      <keep-alive>
        <component :is="currentTabComponent" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent, onActivated, onMounted, ref } from 'vue'

  import TabAComp from '@/components/app/menu-1/sub-1/left/Tab-A.vue'
  import TabBComp from '@/components/app/menu-1/sub-1/left/tab-B'
  import TabCComp from '@/components/app/menu-1/sub-1/left/Tab-CC.vue'
  import { getConfigList } from '@/api/app/config'
  import { useBoolean } from '@/hooks/useBoolean'
  import { useGlobalStore } from '@/stores/app'
  import { Menu1Sub1TabIdType, useMenu1Sub1store } from '@/stores/app/menu-1/sub-1'
  // import { useManagementStore } from '@/stores/app/zoneEstablish/management'
  import { MapWrapper } from '@/js/mapWrapper'
  import { storeToRefs } from 'pinia'
  import { API_INFO_CIAMS } from '@/config/config'
  import type { ImageInstance } from 'element-plus'

  // const managementStore = useManagementStore()
  // const { planId, planConfig, isActiveTimePoint, features } = storeToRefs(managementStore)

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const { status: isActive, toggle } = useBoolean(false)

  const menu1sub1store = useMenu1Sub1store()

  const timePoint = ref()
  const gosiList = ref<any[]>([])
  const planName = ref('')

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'

  const imageRef = ref<ImageInstance>()
  const srcList = ref<string[]>([prefixPath + '2044e732-c692-4ea0-9a8d-fc3554768949'])

  // const currentTab = ref('TabA')
  // const tabList = [
  //   { name: '일반현황', id: 'TabA', component: TabA },
  //   { name: '산업현황분석', id: 'TabB', component: TabB },
  //   { name: '산업특성분석', id: 'TabC', component: TabC },
  // ]

  // const tabList = menu1store.tabList

  const components: Record<Menu1Sub1TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }

  // const currentTabComponent = computed(() => {
  //   return menu1store.tabList.find((tab) => tab.id === menu1store.currentTabId)?.component || null
  // })

  const currentTabComponent = computed(() => components[menu1sub1store.selectedTabId] || TabAComp)

  const gosiOption = ref<{ label: string; value: any }[]>([])

  const mapWrap = ref<MapWrapper>()

  function showImage() {
    imageRef.value!.showPreview()
  }

  function handleTabChange(tabId: Menu1Sub1TabIdType) {
    menu1sub1store.selectedTabId = tabId

    switch (menu1sub1store.selectedTabId) {
      // 용도지역현황
      case 'TabA': {
        // isActiveTimePoint.value = false
        // layoutSelected.value?.right?.visible.off()
        break
      }
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
    handleTabChange(menu1sub1store.selectedTabId)
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
    background: #52b597;
    color: #fff;
  }
</style>

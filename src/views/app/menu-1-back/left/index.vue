<template>
  <div class="zoningSetting">
    <div class="zoningSetting-top customCard">
      <div class="form-group">
        <label class="form-label">고시</label>
        <div>
          <CustomSelect
            @change="changePlanId"
            :list="gosiOption"
            :default-value="timePoint"
            style="width: 100%"
            :is-gosi="true"
          />
          <button type="button" class="btn-file" @click="handleInfoClick">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.14949 8.49164L4.28828 10.3529C3.59317 11.048 3.19343 11.9938 3.20074 12.9878C3.20804 13.9818 3.59903 14.9334 4.32713 15.639C5.0327 16.3671 5.98447 16.7581 6.97832 16.7654C7.99484 16.7728 8.91826 16.3956 9.61341 15.7005L11.4746 13.8393M13.852 11.5074L15.7132 9.64619C16.4083 8.95108 16.808 8.00528 16.8007 7.01127C16.7934 6.01726 16.4024 5.06568 15.6743 4.36007C14.9689 3.65467 14.0173 3.26366 13.0233 3.25636C12.0293 3.24905 11.0834 3.62609 10.3882 4.32123L8.527 6.18244M7.17832 12.7722L12.762 7.18852"
                stroke="#7AAAD1"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ul class="zoningSetting-tab customTab">
      <li
        v-for="(tab, index) in tabList"
        :key="index"
        @click.prevent="handleTabChange(tab.id)"
        :class="{ active: currentTab == tab.id }"
        class="customTab-item"
      >
        {{ tab.name }}
      </li>
    </ul>

    <div class="zoningSetting-content">
      <keep-alive>
        <component :is="currentTabComponent" :pageSize="4" />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated, onMounted, ref } from 'vue'

  import TabA from '@/components/app/menu-1/sub-1/left/Tab-A.vue'
  import TabB from 'src/components/app/menu-1/sub-1/left/tab-B'
  import TabC from '@/components/app/menu-1/sub-1/left/Tab-CC.vue'
  import { getConfigList } from '@/api/app/config'
  import { useBoolean } from '@/hooks/useBoolean'
  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub1store } from '@/stores/app/menu-1/sub-1'
  // import { useManagementStore } from '@/stores/app/zoneEstablish/management'
  import CustomSelect from '@/components/CustomSelect.vue'
  import { MapWrapper } from '@/js/mapWrapper'
  import { storeToRefs } from 'pinia'

  // const managementStore = useManagementStore()
  // const { planId, planConfig, isActiveTimePoint, features } = storeToRefs(managementStore)

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)

  const { status: isActive, toggle } = useBoolean(false)

  const menu1store = useMenu1Sub1store()

  const timePoint = ref()
  const gosiList = ref<any[]>([])
  const planName = ref('')

  const currentTab = ref('TabA')
  const tabList = [
    { name: '용도지역현황', id: 'TabA', component: TabA },
    { name: '수립대상지역', id: 'TabB', component: TabB },
    { name: '대상지현황', id: 'TabC', component: TabC },
  ]

  const currentTabComponent = computed(() => {
    return tabList.find((tab) => tab.id === currentTab.value)?.component || null
  })

  const gosiOption = ref<{ label: string; value: any }[]>([])

  const mapWrap = ref<MapWrapper>()

  function handleTabChange(tabId: string) {
    currentTab.value = tabId

    switch (currentTab.value) {
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
    handleTabChange(currentTab.value)
  })

  onActivated(() => {
    // handleTabChange('TabB')
    // handleTabChange('TabC')
  })

  defineExpose({})
</script>

<style lang="scss">
  @import '@/assets/css/zoningSetting.css';

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
  .urbanInfo {
    padding: 0;
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
      margin-left: 10px;
      background-color: white;
    }

    .customTab-item:first-child {
      margin-left: 0;
      margin-right: 0;
    }
  }
</style>

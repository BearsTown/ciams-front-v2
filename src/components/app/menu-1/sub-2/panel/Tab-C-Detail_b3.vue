<template>
  <div class="detail">
    <el-tabs
      tab-position="top"
      style="flex: 0 0 auto"
      v-model="state.activeYear"
      @tab-change="tabChangeListener"
    >
      <el-tab-pane
        v-for="data in menu1_2_3Store.years"
        :label="`${data.title}`"
        :name="data.id"
        :key="data.id"
        class="customScroll scrollX"
      />
    </el-tabs>

    <div class="top">
      <div style="display: flex; padding-bottom: 5px">
        <el-text style="margin-right: 5px">지도</el-text>
        <el-switch
          size="small"
          v-model="menu1_2_3Store.layerVisible"
          :disabled="!menu1_2_3Store.getSelectDetail()"
        />
      </div>

      <el-table
        :data="filteredTableData"
        size="small"
        :show-header="true"
        show-summary
        style="z-index: 0"
        empty-text="데이터가 없습니다."
        scrollbar-always-on
        height="260"
        max-height="260"
        border
        :summary-method="getSummaries"
      >
        <el-table-column label="범례" align="center" width="50" class-name="legend">
          <template #default="{ row: { color } }">
            <div :style="{ width: '15px', height: '15px', backgroundColor: color }"></div>
          </template>
        </el-table-column>
        <el-table-column label="구분" align="center">
          <template #default="{ row: { short } }">
            {{ short }}
          </template>
        </el-table-column>
        <template v-for="(item, index) in state.attributes" :key="index">
          <el-table-column :label="item.label" align="center">
            <el-table-column :label="item.unit" align="center" :prop="`${item.name}.value`">
              <template #default="{ row: { data } }">
                {{
                  data?.[item.name].value === 0 ? '-' : CommonUtil.comma(data?.[item.name].value)
                }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="item.useRatio"
              label="비율(%)"
              align="center"
              :prop="`${item.name}.ratio`"
            >
              <template #default="{ row: { data } }">
                {{ data?.[item.name].ratio === 0 ? '-' : data?.[item.name].ratio }}
              </template>
            </el-table-column>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <div class="bottom">
      <IndiChart />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { VNode } from 'vue'
  import { computed, h, onActivated, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  import {
    CommonLayerGroup,
    MapLayerGroupType,
    MapType,
    MapWrapperConfig,
    ViewLayerTypes,
  } from '@/enums/mapEnum'
  import { MapWrapper } from '@/js/mapWrapper'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { useMenu1_2_3Store } from '@/stores/app/menu-1/sub-2/tab-c'

  import UitWMSLayer from '@uitgis/ol-ugis-test/layer/uitWMSLayer'
  import { MapLayer } from '@/js/layer'
  import CommonUtil from '@/utils/commonUtil'
  import commonUtil from '@/utils/commonUtil'
  import { useMapStore } from '@/stores/map/map'
  import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'
  import UitWMTSLayer from '@uitgis/ol-ugis-test/layer/uitWMTSLayer'

  import { dataUtil } from '@/utils'
  import type { Item } from '@/utils/data.types'
  import Chart from '@/components/app/menu-1/sub-2/panel/Chart.vue'
  import type { TableColumnCtx } from 'element-plus'
  import IndiChart from '@/components/app/menu-1/sub-2/panel/IndiChart.vue'

  interface SummaryMethodProps<T = any> {
    columns: TableColumnCtx<T>[]
    data: T[]
  }

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()
  const menu1sub2store = useMenu1Sub2store()
  const menu1_2_3Store = useMenu1_2_3Store()

  // const { state } = storeToRefs(menu1_2_3Store)

  const state = menu1_2_3Store.state

  const mapConfig = ref<MapWrapperConfig>()
  const test = ref(false)
  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1-2-3'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-3'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_1-2-3'
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()

  const layerVisibleValue = ref(false)

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

  // const attributes: Attribute[] = [
  //   {
  //     name: 'attr1',
  //     label: '사업체',
  //     unit: '개소',
  //     useRatio: true,
  //   },
  //   {
  //     name: 'attr2',
  //     label: '종사자',
  //     unit: '명',
  //     useRatio: true,
  //   },
  // ]

  const tempList: Item[] = [
    {
      name: 'C',
      label: '제조업',
      color: '#7bc142',
      data: {
        attr1: 181,
        attr2: 7717,
      },
    },
    {
      name: 'G',
      label: '도매 및 소매업',
      color: '#faaa1c',
      data: {
        attr1: 69,
        attr2: 227,
      },
    },
    {
      name: 'H',
      label: '운수 및 창고업',
      color: '#7b88c2',
      data: {
        attr1: 51,
        attr2: 499,
      },
    },
    {
      name: 'N',
      label: '테스트업',
      color: '#7b88c2',
      data: {
        attr1: 13,
        attr2: 377,
      },
    },
    {
      name: '기타',
      label: '기타',
      color: '#d6cfcc',
      data: {
        attr1: 25,
        attr2: 95,
      },
    },
  ]

  // const years = [
  //   {
  //     year: 2011,
  //   },
  //   {
  //     year: 2016,
  //   },
  //   {
  //     year: 2021,
  //   },
  // ]

  const tempListWithRatio = computed(
    () => dataUtil.calculateRatios(tempList, state.value.attributes.value, { round: 1 }), // 소수점 2자리
  )

  const filteredTableData = computed(() => {
    // return menu1_2_3Store.getSelectDetail()?.tableData
    return menu1_2_3Store.getSelectDetail()?.tableData.filter((row) => row.visible)
  })

  async function loadConfig() {
    try {
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '5CE56438-29A3-83A2-F5EC-157133C5E823',
      LAYERS: ['CIAMS_P1_SGG'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_p1_sgg',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    visible: true,
    opacity: 1,
    zIndex: 1110,
  })

  const uitWMSLayer2 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '5CE56438-29A3-83A2-F5EC-157133C5E823',
      LAYERS: ['CIAMS_P1_EMD'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_p1_sgg',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    visible: true,
    opacity: 1,
    zIndex: 1110,
  })

  const uitWMSLayerT = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '585C994F-2629-20C9-3EB8-619B3547E42F',
      LAYERS: ['CIAMS_DIST'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      // id: 'ciams_p1_plan',
      id: 'ciams_dist',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    opacity: 0.8,
    zIndex: 1111,
  })

  async function init() {
    await loadConfig()

    mapConfig.value = {
      center: JSON.parse(cmmConfigStore.mapConfigState['MAP_INIT_CENTER'].confValue),
      zoom: Number(cmmConfigStore.mapConfigState['MAP_INIT_ZOOM'].confValue),
      kakao: cmmConfigStore.mapConfigState['KAKAO_KEY'].confValue,
      vWorld: cmmConfigStore.mapConfigState['VWORLD_KEY'].confValue,
      baseMapKey: 'vWorld_normal',
      baseMapOption: 'NORMAL',
      olMapId: `ol-map-${mapType}`,
      baseMapId: `base-map-${mapType}`,
      isMapLocation: true,
    }

    mapWrap.value = await mapStore.getMapInstance()

    const uitMap = mapWrap.value?.getUitMap()

    // uitMap.addWMSLayer(uitWMSLayer)

    const mapLayers = reactive<MapLayer[]>([
      new MapLayer({
        layer: uitWMSLayer1,
        title: '시군구',
        userVisible: true,
        useLegend: true,
        useLayerSetting: true,
      }),
      new MapLayer({
        layer: uitWMSLayer2,
        title: '읍면동',
        userVisible: true,
        useLegend: true,
        useLayerSetting: true,
      }),
      new MapLayer({
        layer: uitWMSLayerT,
        title: '대상지',
        userVisible: true,
        useLayerSetting: true,
      }),
    ])

    mapLayers.forEach((item) => {
      if (item) {
        const uLayer = item.getLayer()
        if (uLayer instanceof UitWMSLayer) {
          uitMap.addWMSLayer(uLayer as UitWMSLayer)
        } else if (uLayer instanceof UitWFSLayer) {
          uitMap.addWFSLayer(uLayer as UitWFSLayer)
        } else if (uLayer instanceof UitWMTSLayer) {
          uitMap.addWMTSLayer(uLayer as UitWMTSLayer)
        }

        mapWrap.value?.addCommonLayer({
          key: commonLayerType!,
          layers: [item] as MapLayer[],
        })
      }
    })

    mapWrap.value?.setCommonLayersVisible(commonLayerType!, true)

    const tocLayerGroups = {
      title: '행정구역',
      layers: [mapLayers[0], mapLayers[1]] as MapLayer[],
    }

    mapWrap.value?.setTocCommonLayerGroups(commonLayerType, tocLayerGroups)

    const tocViewLayerGroups = mapLayers[2] as MapLayer

    mapWrap.value?.setTocViewLayerGroups(layerGroupName!, tocViewLayerGroups)
  }

  function tabChangeListener(id) {
    menu1_2_3Store.callChangeYear()
  }

  function makeChart() {
    test.value = true
  }

  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param
    const sums: (string | VNode)[] = []
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: {} }, ['합계'])
        return
      }

      if (commonUtil.isEmpty(column.property)) {
        return
      }

      const values = data.map((item) => {
        const value = getNestedValue(item.data, column.property)
        return value !== undefined ? Number(value) : 0 // 기본값 설정
      })

      if (!values.every((value) => Number.isNaN(value))) {
        const total = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        sums[index] = CommonUtil.comma(total.toFixed(0))
      }
    })

    return sums
  }

  const getNestedValue = (obj, path) => {
    try {
      return path.split('.').reduce((current, key) => current && current[key], obj)
    } catch (error) {
      console.error(`Error accessing ${path}:`, error)
      return undefined
    }
  }

  onMounted(async () => {
    makeChart()
  })

  onBeforeMount(() => {
    init()
  })

  onActivated(() => {})

  watch(
    () => menu1_2_3Store.layerVisible,
    (newValue) => {
      layerVisibleValue.value = newValue || false
    },
    { immediate: true },
  )

  watch(layerVisibleValue, (newValue) => {
    const selectedDetail = menu1_2_3Store.getSelectDetail()
    if (selectedDetail) {
      selectedDetail.layerVisible = newValue
    }
  })
</script>

<style scoped lang="scss">
  :deep(.el-tabs__header) {
    margin-bottom: 5px;
  }

  .detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: #fff;
    border-radius: 8px;

    .top {
      //height: auto;
      //max-height: 30%;
      //flex: 1;
      flex: 0 1 auto;
      //overflow: auto;
      //overflow-y: scroll;
    }

    .bottom {
      height: 65%;
      flex: 1 1 auto;
      overflow-y: auto;
      //height: 100%;
    }
  }
</style>

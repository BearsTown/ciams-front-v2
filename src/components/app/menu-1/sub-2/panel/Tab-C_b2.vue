<template>
  <div class="container">
    <div class="center">
      <div class="left">
        <MapWrapperView v-if="mapConfig" :map-type="mapType" :map-config="mapConfig">
          <template #control>
            <Controls :map-type="mapType" />
          </template>
        </MapWrapperView>
      </div>
      <div class="right">
        <div class="right-top">
          <el-table
            :data="tempListWithRatio"
            size="small"
            :show-header="true"
            show-summary
            style="height: 100%; z-index: 0"
            empty-text="데이터가 없습니다."
            scrollbar-always-on
            border
          >
            <el-table-column label="범례" align="center" width="50" class-name="legend">
              <template #default="{ row: { color } }">
                <div :style="{ width: '15px', height: '15px', backgroundColor: color }"></div>
              </template>
            </el-table-column>
            <el-table-column label="구분" align="center">
              <template #default="{ row: { name } }">
                {{ name }}
              </template>
            </el-table-column>
            <template v-for="(item, index) in attributes" :key="index">
              <el-table-column :label="item.label" align="center">
                <el-table-column :label="item.unit" align="center">
                  <template #default="{ row: { data } }">
                    {{ data?.[item.name] }}
                  </template>
                </el-table-column>
                <el-table-column v-if="item.useRatio" label="비율(%)" align="center">
                  <template #default="{ row: { ratio } }">
                    {{ ratio?.[item.name]?.toFixed(1) ?? '-' }}%
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <div class="right-bottom">
          <Chart style="flex: 1"></Chart>
          <el-tabs tab-position="bottom">
            <el-tab-pane
              v-for="data in years"
              :label="data.year"
              :name="data.year"
              :key="data.year"
              class="customScroll scrollX"
              style="height: 100%"
            >
              <template #label>
                {{ `${data.year}년` }}
              </template>

              <template #default> </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="bottom customScroll">
      <div class="text-wrap">
        - 최근 10년간(2011~2021년) 김천시 전체 인구는(140,239명) 증가(0.29%)하였음 <br />
        - 그 중 대신동이 24,895명으로 가장 많은 인구비율을 나타냈으며 인구 증가율은 율곡동이
        41.65%로 가장 높음
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, reactive, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  import Controls from '@/components/map/control/Controls.vue'
  import MapWrapperView from '@/components/map/MapWrapper.vue'
  import {
    CommonLayerGroup,
    MapLayerGroupType,
    MapType,
    MapWrapperConfig,
    ViewLayerTypes,
  } from '@/enums/mapEnum'
  import { MapWrapper } from '@/js/mapWrapper'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  import UitWMSLayer from '@uitgis/ol-ugis-test/layer/uitWMSLayer'
  import { MapLayer } from '@/js/layer'
  import CommonUtil from '@/utils/commonUtil'
  import { useMapStore } from '@/stores/map/map'
  import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'
  import UitWMTSLayer from '@uitgis/ol-ugis-test/layer/uitWMTSLayer'

  import { dataUtil } from '@/utils'
  import type { Attribute, Item } from '@/utils/data.types'
  import Chart from '@/components/app/menu-1/sub-2/panel/Chart.vue'

  const globalStore = useGlobalStore()
  const menu1sub2store = useMenu1Sub2store()
  const cmmConfigStore = useCmmConfigStore()

  const mapConfig = ref<MapWrapperConfig>()
  const test = ref(false)
  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1-2-3'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-3'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_1-2-3'
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

  const attributes: Attribute[] = [
    {
      name: 'attr1',
      label: '사업체',
      unit: '개소',
      useRatio: true,
    },
    {
      name: 'attr2',
      label: '종사자',
      unit: '명',
      useRatio: true,
    },
  ]

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

  const years = [
    {
      year: 2011,
    },
    {
      year: 2016,
    },
    {
      year: 2021,
    },
  ]

  const tempListWithRatio = computed(
    () => dataUtil.calculateRatios(tempList, attributes, { round: 1 }), // 소수점 2자리
  )

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

  const y_year = [
    136000, 135100, 135020, 135050, 140500, 142500, 142900, 141010, 141050, 140700, 140600,
  ]

  // const minVal = Math.min(...y_year)
  // const maxVal = Math.max(...y_year)

  const minVal = Math.round(Math.min(...y_year) / 1000) * 1000
  const maxVal = Math.ceil(Math.max(...y_year) / 1000) * 1000

  const step = Math.ceil((maxVal - minVal) / 6 / 1000) * 1000

  const option = ref({
    title: {
      text: '읍면동 별 인구 추이',
      left: 'center',
    },
    legend: {
      bottom: 'bottom',
      data: ['년도'],
      // data: [
      //   '년도',
      //   '이포읍',
      //   '농소면',
      //   '남면',
      //   '개령면',
      //   '감문면',
      //   '어모면',
      //   '봉산면',
      //   '대항면',
      //   '감천면',
      //   '조마면',
      //   '구성면',
      //   '지례면',
      //   '부항면',
      //   '대덕면',
      //   '증산면',
      //   '평화남산동',
      //   '양금동',
      //   '대곡동',
      // ],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    xAxis: {
      type: 'category',
      data: [
        '2011년',
        '2012년',
        '2013년',
        '2014년',
        '2015년',
        '2016년',
        '2017년',
        '2018년',
        '2019년',
        '2020년',
        '2021년',
      ],
    },
    yAxis: [
      {
        type: 'value',
        name: '왼쪽 축',
        min: minVal,
        max: maxVal,
        interval: step,
        position: 'left',
      },
      {
        type: 'value',
        name: '오른쪽 축',
        min: 0,
        max: 30000,
        position: 'right',
      },
    ],
    series: [
      {
        name: '년도',
        type: 'bar',
        yAxisIndex: 0,
        data: y_year,
        tooltip: {
          // valueFormatter: function (value) {
          //   return (value as number) + ' 명'
          // },
        },
      },
      {
        name: '이포읍',
        type: 'line',
        yAxisIndex: 0,
        data: [
          136000, 135100, 135020, 135050, 140500, 142500, 142900, 141010, 141050, 140700, 140600,
        ],
      },
      {
        name: '농소면',
        type: 'line',
        data: [
          142500, 142600, 142500, 142300, 142000, 141800, 141500, 142000, 142100, 141800, 141600,
        ],
      },
      {
        name: '남면',
        type: 'line',
        data: [
          136200, 136400, 136500, 136600, 136400, 136200, 136000, 135800, 135600, 135400, 135200,
        ],
      },
      {
        name: '개령면',
        type: 'line',
        data: [
          143200, 143400, 143500, 143600, 143400, 143200, 143000, 143100, 143300, 143400, 143500,
        ],
      },
      {
        name: '감문면',
        type: 'line',
        data: [
          138500, 138700, 138800, 138700, 138500, 138300, 138100, 137900, 137700, 137500, 137300,
        ],
      },
      {
        name: '어모면',
        type: 'line',
        data: [
          138800, 138900, 138800, 138600, 138400, 138200, 138000, 137800, 137600, 137400, 137200,
        ],
      },
      {
        name: '봉산면',
        type: 'line',
        data: [
          136800, 136900, 137000, 136900, 136700, 136500, 136300, 136100, 135900, 135700, 135500,
        ],
      },
      {
        name: '대항면',
        type: 'line',
        data: [
          137800, 137900, 138000, 137900, 137700, 137500, 137300, 137100, 136900, 136700, 136500,
        ],
      },
      {
        name: '감천면',
        type: 'line',
        data: [
          138200, 138300, 138400, 138300, 138100, 137900, 137700, 137500, 137300, 137100, 136900,
        ],
      },
      {
        name: '조마면',
        type: 'line',
        data: [
          137200, 137300, 137400, 137300, 137100, 136900, 136700, 136500, 136300, 136100, 135900,
        ],
      },
      {
        name: '구성면',
        type: 'line',
        data: [
          138900, 139000, 139100, 139000, 138800, 138600, 138400, 138200, 138000, 137800, 137600,
        ],
      },
      {
        name: '지례면',
        type: 'line',
        data: [
          136500, 136600, 136700, 136600, 136400, 136200, 136000, 135800, 135600, 135400, 135200,
        ],
      },
      {
        name: '부항면',
        type: 'line',
        data: [
          136200, 136300, 136400, 136300, 136100, 135900, 135700, 135500, 135300, 135100, 134900,
        ],
      },
      {
        name: '대덕면',
        type: 'line',
        data: [
          137500, 137600, 137700, 137600, 137400, 137200, 137000, 136800, 136600, 136400, 136200,
        ],
      },
      {
        name: '증산면',
        type: 'line',
        data: [
          135500, 135600, 135700, 135600, 135400, 135200, 135000, 134800, 134600, 134400, 134200,
        ],
      },
      {
        name: '평화남산동',
        type: 'line',
        data: [
          139200, 139300, 139400, 139300, 139100, 138900, 138700, 138500, 138300, 138100, 137900,
        ],
      },
      {
        name: '양금동',
        type: 'line',
        data: [
          136900, 137000, 137100, 137000, 136800, 136600, 136400, 136200, 136000, 135800, 135600,
        ],
      },
      {
        name: '대곡동',
        type: 'line',
        data: [
          138600, 138700, 138800, 138700, 138500, 138300, 138100, 137900, 137700, 137500, 137300,
        ],
      },
    ],
  })

  function makeChart() {
    // chartOptions.value = chartUtil.makeChartOption('BAR', {
    //   isHorizontal: false,
    //   titleName: '',
    //   data: [],
    // })
    //
    // chartRef.value.reloadOption(chartOptions.value)
    test.value = true
  }

  onMounted(async () => {
    makeChart()
  })

  onBeforeMount(() => {
    init()
  })

  onActivated(() => {})
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .center {
      flex: 1;
      display: flex;
      flex-direction: row;
      overflow-y: hidden;
      height: 100%;

      .left {
        width: 50%;

        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;
        display: flex;
        flex-direction: column;

        //padding: 10px;
        //background: #fff;
        margin-left: 8px;
        //border-radius: 8px;
      }

      .right-top {
        //flex: 1;
        //max-height: 50%;
        //height: 50%;
        height: auto;
        //min-height: 30%;
        max-height: 35%;

        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }

      .right-bottom {
        display: flex;
        flex-direction: column;
        flex: 1;
        //flex: 0.5;
        //height: auto;
        height: 100%;
        //max-height: 70%;

        //max-height: 50%;
        //height: auto;

        //overflow-y: hidden;
        margin-top: 8px;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .customScroll {
      height: max-content;
      overflow-y: auto;
    }

    .text-wrap {
      color: #616161;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.5;
    }
  }

  .legend {
    align-items: center;
    display: inline-flex;
    vertical-align: middle;
  }
</style>

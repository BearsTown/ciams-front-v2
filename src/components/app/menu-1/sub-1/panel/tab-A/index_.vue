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
        <v-chart class="chart" :option="option" autoresize />
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
  import { onActivated, onBeforeMount, onMounted, reactive, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub1store } from '@/stores/app/menu-1/sub-1'

  import VChart from 'vue-echarts'
  import Controls from '@/components/map/control/Controls.vue'
  import MapWrapperView from '@/components/map/MapWrapper.vue'
  import { CommonLayerGroup, MapType, MapWrapperConfig } from '@/enums/mapEnum'
  import { MapWrapper } from '@/js/mapWrapper'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  import UitWMSLayer from '@uitgis/ol-ugis-test/layer/uitWMSLayer'
  import { MapLayer } from '@/js/layer'
  import CommonUtil from '@/utils/commonUtil'
  import { useMapStore } from '@/stores/map/map'
  import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'
  import UitWMTSLayer from '@uitgis/ol-ugis-test/layer/uitWMTSLayer'
  import { dataUtil } from '@/utils'

  const globalStore = useGlobalStore()
  const menu1sub1store = useMenu1Sub1store()
  const cmmConfigStore = useCmmConfigStore()

  const mapConfig = ref<MapWrapperConfig>()

  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_1'
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

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
  }

  const y_year = [
    136185, 135504, 135259, 135456, 140132, 142256, 142908, 141104, 141229, 140548, 140239,
  ]

  const yAxisMinMax = dataUtil.axisMinMax(y_year)

  // const minValue = Math.min(...y_year)
  // const maxValue = Math.max(...y_year)
  // const padding = (maxValue - minValue) * 0.1
  // const axisMin = Math.floor(minValue - padding)
  // const axisMax = Math.ceil(maxValue + padding)

  // const minVal = Math.round(Math.min(...y_year) / 1000) * 1000
  // const maxVal = Math.ceil(Math.max(...y_year) / 1000) * 1000

  // const step = Math.ceil((maxVal - minVal) / 6 / 1000) * 1000

  const option = ref({
    title: {
      text: '읍면동 별 인구 추이',
      left: 'center',
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    legend: {
      type: 'scroll',
      bottom: 'bottom',
      // data: [
      // '년도',
      // '이포읍',
      // '농소면',
      // '남면',
      // '개령면',
      // '감문면',
      // '어모면',
      // '기타',
      // '대항면',
      // '감천면',
      // '조마면',
      // '구성면',
      // '지례면',
      // '부항면',
      // '대덕면',
      // '증산면',
      // '평화남산동',
      // '양금동',
      // '대곡동',
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
        // min: yAxisMinMax.axisMin,
        // max: yAxisMinMax.axisMax,
        // min: minVal,
        // max: maxVal,
        // interval: step,
        position: 'left',
      },
    ],
    series: [
      // {
      //   name: '년도',
      //   type: 'line',
      //   yAxisIndex: 0,
      //   data: y_year,
      //   tooltip: {
      //     // valueFormatter: function (value) {
      //     //   return (value as number) + ' 명'
      //     // },
      //   },
      // },
      {
        name: '아포읍',
        type: 'line',
        data: [8617, 8573, 8563, 8489, 8441, 8017, 7826, 7535, 7309, 7131, 7800],
      },
      {
        name: '농소면',
        type: 'line',
        data: [3347, 3345, 3358, 3283, 3315, 3299, 3249, 3102, 3037, 3043, 3076],
      },
      {
        name: '남면',
        type: 'line',
        data: [3691, 3600, 4069, 3550, 3595, 3499, 3441, 3370, 3249, 3128, 3078],
      },
      {
        name: '개령면',
        type: 'line',
        data: [2995, 2991, 2969, 2884, 2838, 2747, 2732, 2628, 2609, 2478, 2407],
      },
      {
        name: '감문면',
        type: 'line',
        data: [3917, 3908, 3875, 3781, 3791, 3688, 3644, 3496, 3435, 3305, 3258],
      },
      {
        name: '어모면',
        type: 'line',
        data: [5106, 5073, 4984, 4892, 4860, 4642, 4497, 4344, 4219, 4062, 4013],
      },
      {
        name: '봉산면',
        type: 'line',
        data: [3699, 3678, 3615, 3637, 3670, 3527, 3467, 3372, 3306, 3196, 3065],
      },
      {
        name: '대항면',
        type: 'line',
        data: [4252, 4242, 4223, 4157, 4042, 3917, 3836, 3714, 3600, 3469, 3407],
      },
      {
        name: '감천면',
        type: 'line',
        data: [2327, 2280, 2287, 2252, 2230, 2164, 2119, 2035, 2017, 1942, 1936],
      },
      {
        name: '조마면',
        type: 'line',
        data: [2680, 2620, 2623, 2597, 2562, 2433, 2423, 2325, 2296, 2237, 2178],
      },
      {
        name: '구성면',
        type: 'line',
        data: [3398, 3287, 3286, 3244, 3211, 3106, 3033, 2956, 2913, 2835, 2755],
      },
      {
        name: '지례면',
        type: 'line',
        data: [1961, 1940, 1872, 1835, 1851, 1790, 1736, 1679, 1626, 1576, 1531],
      },
      {
        name: '부항면',
        type: 'line',
        data: [1411, 1373, 1419, 1344, 1354, 1358, 1368, 1324, 1317, 1260, 1236],
      },
      {
        name: '대덕면',
        type: 'line',
        data: [2495, 2460, 2449, 2413, 2420, 2381, 2268, 2162, 2198, 2294, 2263],
      },
      {
        name: '증산면',
        type: 'line',
        data: [1249, 1249, 1269, 1256, 1260, 1189, 1141, 1103, 1084, 1036, 1033],
      },
      {
        name: '자산동',
        type: 'line',
        data: [9437, 9295, 8990, 8793, 8488, 8072, 7737, 7390, 6990, 6748, 6551],
      },
      {
        name: '평화남산동',
        type: 'line',
        data: [10876, 10580, 10377, 10403, 9873, 9299, 8878, 8558, 7985, 7641, 7466],
      },
      {
        name: '양금동',
        type: 'line',
        data: [5647, 5501, 5229, 5004, 4960, 4677, 4510, 4305, 4116, 3961, 3816],
      },
      {
        name: '대신동',
        type: 'line',
        data: [25711, 25685, 25847, 25996, 25873, 24959, 24816, 24186, 24688, 25224, 25354],
      },
      {
        name: '대곡동',
        type: 'line',
        data: [23021, 22990, 22919, 22609, 21583, 20798, 20317, 19598, 20528, 20434, 20150],
      },
      {
        name: '지좌동',
        type: 'line',
        data: [10348, 10834, 11036, 11036, 10681, 10362, 10307, 10719, 10896, 11061, 10972],
      },
      {
        name: '율곡동',
        type: 'line',
        data: [null, null, null, 2001, 9234, 16332, 19563, 21203, 21811, 22487, 22894],
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

      .left {
        width: 50%;

        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;

        padding: 10px;
        background: #fff;
        margin-left: 8px;
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
</style>

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
        <TabDDetail />
      </div>
    </div>
    <div class="bottom customScroll">
      <div class="text-wrap">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, reactive, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  import { useMenu1_2_4Store } from '@/stores/app/menu-1/sub-2/tab-d'
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
  import TabDDetail from '@/components/app/menu-1/sub-2/panel/Tab-D-Detail.vue'

  const globalStore = useGlobalStore()
  const menu1sub2store = useMenu1Sub2store()
  const menu1_2_4Store = useMenu1_2_4Store()
  const cmmConfigStore = useCmmConfigStore()

  const mapConfig = ref<MapWrapperConfig>()
  const test = ref(false)
  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1-2-4'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-4'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_1-2-4'
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]
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

  function makeChart() {
    test.value = true
  }

  const summay = {
    15: {
      DIST_KEY_001: '선도산업이 58개(50%)로 가장 많음 (대표 선도산업 : 전구 및 조명장치 제조업)',
      DIST_KEY_002:
        '선도산업, 신흥산업, 특화성장산업이 각각 7개(29.2%)씩 입지 (대표 선도산업 : 자동차 및 모터사이클 수리업)',
      DIST_KEY_003:
        '선도산업이 4개(66.7%)로 가장 많음 (대표 선도산업 : 시멘트, 석회, 플라스터 및 그 제품 제조업)',
      DIST_KEY_004: '쇠퇴산업이 2개(66.7%)로 가장 많음 (대표 선도산업 : 음ㆍ식료품 및 담배 도매업)',
      DIST_KEY_005:
        '선도산업, 특화성장산업, 비특화성장산업이 각각 3개(33.3%)씩 입지 (대표 선도산업 : 자동차 및 모터사이클 수리업)',
    },
    16: {
      DIST_KEY_001:
        '초기반산업이 43개(37.1%)로 가장 많음 (대표 초기반산업 : 전구 및 조명장치 제조업)',
      DIST_KEY_002: '보통이 11개(45.8%)로 가장 많음 (대표 초기반산업 : 자동차 신품 부품 제조업)',
      DIST_KEY_003:
        '초기반산업, 기반산업이 각각 3개(50.0%)씩 입지 (대표 초기반산업 : 시멘트, 석회, 플라스터 및 그 제품 제조업)',
      DIST_KEY_004: '초기반산업이 2개(66.7%)로 가장 많음 (대표 초기반산업 : 담배 제조업)',
      DIST_KEY_005: '기반산업, 보통, 비기반산업이 각각 1개(33.3%)씩 입지 (대표 초기반산업 : 없음)',
    },
  }

  const state = menu1_2_4Store.state

  const text = computed(() => {
    if (!CommonUtil.isEmpty(state.activeCategory) && !CommonUtil.isEmpty(state.activeDistFeature)) {
      return `최근 10년간(2011~2021년) ${state.activeDistFeature!.get('DIST_NAME')}의 ${
        state.activeCategory!.name
      } 결과 ${summay[state.activeCategory!.id][state.activeDistFeature!.get('DIST_NO')]}`
    }
    return ''
  })

  // const text = ref('')

  // watch(
  //   () => state.activeDistId,
  //   (newValue) => {
  //     text.value = `최근 10년간(2011~2021년) ${state.activeDistFeature!.get('DIST_NAME')}의 ${
  //       state.activeCategory!.name
  //     } 결과 ${summay[state.activeCategory!.id][state.activeDistFeature!.get('DIST_NO')]}`
  //   },
  // )

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
      gap: 8px;

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
        //margin-left: 8px;
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

<template>
  <PagePane :title="['도시공업지역 현황', '사업체현황']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">{{ text }}</div>
        </div>

        <div class="center">
          <div class="left">
            <MapWrapperView v-if="mapConfig" :map-type="mapType" :map-config="mapConfig">
              <template #control>
                <Controls :map-type="mapType" :use-land="false" />
              </template>
            </MapWrapperView>
          </div>
          <div class="right">
            <TabCDetail />
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  import { useMenu1_2_3Store } from '@/stores/app/menu-1/sub-2/tab-c'
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
  import TabCDetail from '@/components/app/menu-1/sub-2/panel/Tab-C-Detail.vue'
  import Source from '@/components/common/Source.vue'
  import PagePane from '@/components/common/PagePane.vue'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getSources } from '@/api/app/source'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()
  const menu1sub2store = useMenu1Sub2store()
  const menu1_2_3Store = useMenu1_2_3Store()

  const mapConfig = ref<MapWrapperConfig>()
  const mapType: MapType = 'Map-1-2-3'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-3'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_1-2-3'
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

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
    zIndex: 2222,
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

  const summay = {
    11: {
      DIST_KEY_001:
        '사업체는 지속적으로 증가하였으며 총 116개 중 C(제조업)가 48개(41.4%)로 가장 많음',
      DIST_KEY_002:
        '사업체는 지속적으로 증가하였으며 총 24개 중 C(제조업)가 16개(66.7%)로 가장 많음',
      DIST_KEY_003:
        '사업체는 큰 변화를 보이지 않고있으며 총 6개 중 C(제조업)가 3개(50.0%)로 가장 많음',
      DIST_KEY_004:
        '사업체는 큰 변화를 보이지 않고 있으며 총 4개 중 C(제조업)가 2개(66.7%)로 가장 많음',
      DIST_KEY_005: '사업체는 증가 추세를 보이고 있으며 총 3개 중 H, N, S가 각각 1곳(33.3%)씩 입지',
    },
    12: {
      DIST_KEY_001:
        '종사자는 지속적으로 증가하였으며 5명 미만 종사자 수가 54곳(46.6%)으로 가장 많음',
      DIST_KEY_002:
        '종사자는 지속적으로 증가하였으며 5명 미만 종사자 수가 16곳(66.7%)으로 가장 많음',
      DIST_KEY_003:
        '종사자는 큰 변화를 보이지 않고 있으며 5명 미만 종사자 수가 3곳(50.0%)으로 가장 많음',
      DIST_KEY_004:
        '종사자는 큰 변화를 보이지 않고 있으며 5~9명, 20~99명, 100~299명 종사자 수가 각각 1곳(33.3%)씩 차지하고 있음',
      DIST_KEY_005:
        '종사자는 증가 추세를 보이고 있으며 5명 미만 종사자 수가 2곳(66.7%)으로 가장 많음',
    },
    13: {
      DIST_KEY_001:
        '제조업은 증가추세를 보이다 감소하고 있으며 제조업 48개(41.4%), 관련 서비스업이 68개(58.6%)임',
      DIST_KEY_002:
        '제조업은 증가추세를 보이고 있으며 제조업 16개(66.7%), 관련 서비스업이 8개(33.3%)임',
      DIST_KEY_003:
        '제조업은 큰 변화를 보이지 않고 있으며 제조업 3개(50.0%), 관련 서비스업이 3개(50.0%)임',
      DIST_KEY_004:
        '제조업은 큰 변화를 보이지않고 있으며 제조업 2개(66.7%), 관련 서비스업이 1개(33.3%)임',
      DIST_KEY_005: '제조업은 존재하지 않으며 제조업 0개(0.0%), 관련 서비스업이 3개(100.0%)임',
    },
    14: {
      DIST_KEY_001: '',
      DIST_KEY_002: '',
      DIST_KEY_003: '',
      DIST_KEY_004: '',
      DIST_KEY_005: '',
    },
  }

  const state = menu1_2_3Store.state

  const text = computed(() => {
    if (!CommonUtil.isEmpty(state.activeCategory) && !CommonUtil.isEmpty(state.activeDistFeature)) {
      return `최근 10년간(2011~2021년) ${state.activeDistFeature!.get('DIST_NAME')}의 ${
        state.activeCategory!.name
      } 결과 ${summay[state.activeCategory!.id][state.activeDistFeature!.get('DIST_NO')]}`
    }
    return ''
  })

  watch(
    () => state.activeCategory?.id,
    async (id) => {
      if (CommonUtil.isEmpty(id)) {
        sources.value = []
      } else {
        const { data: sourceData } = await getSources({
          category: '도시공업지역현황',
          targetId: id,
        })

        sources.value = sourceData[0]?.sources
      }
    },
    { immediate: true },
  )

  onMounted(async () => {})

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

    .top {
      height: 80px;
      margin-bottom: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
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

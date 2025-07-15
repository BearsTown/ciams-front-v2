<template>
  <PagePane :title="['도시공업지역 현황', '대상지현황']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap"></div>
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
            <TabBDetail />
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref, watch } from 'vue'

  import Source from '@/components/common/Source.vue'
  import PagePane from '@/components/common/PagePane.vue'
  import Controls from '@/components/map/control/Controls.vue'
  import MapWrapperView from '@/components/map/MapWrapper.vue'
  import TabBDetail from '@/components/app/menu-1/sub-2/panel/Tab-B-Detail.vue'

  import { UitWFSLayer, UitWMSLayer, UitWMTSLayer } from '@uitgis/ol-ugis-test/layer'

  import {
    CommonLayerGroup,
    MapLayerGroupType,
    MapType,
    MapWrapperConfig,
    ViewLayerTypes,
  } from '@/enums/mapEnum'
  import CommonUtil from '@/utils/commonUtil'
  import { MapLayer } from '@/js/layer'
  import { MapWrapper } from '@/js/mapWrapper'
  import { API_INFO_MAPSTUDIO } from '@/config/config'

  import { getSources } from '@/api/app/source'
  import { SourceGroupDTO } from '@/api/app/source/model'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { useMenu1_2_2Store } from '@/stores/app/menu-1/sub-2/tab-b'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()
  const menu1_2_2Store = useMenu1_2_2Store()

  const mapConfig = ref<MapWrapperConfig>()
  const mapType: MapType = 'Map-1-2-2'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-2'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_1-2-2'
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  const labelLayer = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: '62398AF4-FA36-D468-4FD7-639E4849DB25',
      LAYERS: [],
    },
    crossOrigin: 'Anonymous',
    layerType: 'wms',
    isSingleTile: true,
    visible: true,
    opacity: 1,
    zIndex: 10000,
  })

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: '5CE56438-29A3-83A2-F5EC-157133C5E823',
      LAYERS: ['CIAMS_P1_SGG'],
    },
    crossOrigin: 'Anonymous',
    layerType: 'wms',
    isSingleTile: false,
    visible: true,
    opacity: 1,
    zIndex: 1110,
  })

  const uitWMSLayer2 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: '5CE56438-29A3-83A2-F5EC-157133C5E823',
      LAYERS: ['CIAMS_P1_EMD'],
    },
    crossOrigin: 'Anonymous',
    layerType: 'wms',
    isSingleTile: false,
    visible: true,
    opacity: 1,
    zIndex: 1110,
  })

  const uitWMSLayer3 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: 'AF781CA7-729A-BA0C-C965-E6751C9CE3EA',
      LAYERS: ['CIAMS_P1_LSMD_CONT_LDREG'],
    },
    crossOrigin: 'Anonymous',
    layerType: 'wms',
    isSingleTile: false,
    visible: true,
    opacity: 1,
    zIndex: 1110,
  })

  const uitWMSLayerT = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: '585C994F-2629-20C9-3EB8-619B3547E42F',
      LAYERS: ['CIAMS_DIST'],
    },
    crossOrigin: 'Anonymous',
    layerType: 'wms',
    isSingleTile: false,
    opacity: 0.8,
    zIndex: 1112,
  })

  async function init() {
    const wmtsCapability = await UitWMTSLayer.getWMTSCapabilities({
      key: 'AD03CBBB-8FE4-6A8F-BC1A-C11E08291890',
      layerType: 'wmts',
      url: API_INFO_MAPSTUDIO.PREFIX,
    })

    const source = UitWMTSLayer.createWMTSByCapability({
      layers: [wmtsCapability.Contents.Layer[0].Title],
      url: API_INFO_MAPSTUDIO.PREFIX,
      wmtsCapability,
    })

    const uitWMTSLayer = new UitWMTSLayer({
      baseUrl: API_INFO_MAPSTUDIO.PREFIX,
      source,
      visible: true,
      zIndex: 0,
      opacity: 0.8,
      wmtsCapability,
    })

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

    const mapLayers: MapLayer[] = [
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
        layer: uitWMSLayer3,
        title: '지적도',
        userVisible: false,
        useLegend: true,
        useLayerSetting: true,
      }),
      new MapLayer({
        layer: uitWMTSLayer,
        title: '용도지역',
        userVisible: false,
        useLayerSetting: true,
      }),
      new MapLayer({
        layer: uitWMSLayerT,
        title: '대상지',
        userVisible: true,
        useLayerSetting: true,
      }),
    ]

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
      }
    })

    mapWrap.value?.setLabelLayer(labelLayer)

    mapWrap.value?.addCommonLayer({
      key: commonLayerType!,
      layers: mapLayers,
    })

    mapWrap.value?.setCommonLayersVisible(commonLayerType!, true)

    mapWrap.value?.setTocCommonLayerGroups(commonLayerType, {
      title: '행정구역',
      layers: [mapLayers[0], mapLayers[1], mapLayers[2]],
    })

    mapWrap.value?.setTocCommonLayerGroups(commonLayerType, {
      title: '용도지역',
      layers: [mapLayers[3]],
    })

    mapWrap.value?.setTocViewLayerGroups(layerGroupName!, {
      title: '대상지',
      layers: [mapLayers[4]],
    })
  }

  watch(
    () => menu1_2_2Store.state.activeCategory?.id,
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

  onActivated(async () => {
    mapWrap.value = await mapStore.getMapInstance()
    mapWrap.value?.getUitBaseMap().updateSize()
    mapWrap.value?.getUitMap()?.refresh()
  })
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
        overflow: hidden;

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
</style>

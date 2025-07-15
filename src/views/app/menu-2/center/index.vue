<template>
  <MapWrapperView v-if="mapConfig" :map-type="mapType" :map-config="mapConfig">
    <template #control>
      <Controls :map-type="mapType" />
    </template>
  </MapWrapperView>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue'

  import Controls from '@/components/map/control/Controls.vue'
  import MapWrapperView from '@/components/map/MapWrapper.vue'

  import { UitWFSLayer, UitWMSLayer, UitWMTSLayer } from '@uitgis/ol-ugis-test/layer'

  import { MapLayer } from '@/js/layer'
  import { MapWrapper } from '@/js/mapWrapper'
  import { API_INFO_MAPSTUDIO } from '@/config/config'
  import { CommonLayerGroup, MapType, MapWrapperConfig } from '@/enums/mapEnum'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()

  const mapConfig = ref<MapWrapperConfig>()

  const mapType: MapType = 'Map-2'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_2'
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()

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
      baseMapKey: 'vWorld_satellite',
      baseMapOption: 'DARK',
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
  }

  onBeforeMount(() => {
    init()
  })
</script>

<style scoped></style>

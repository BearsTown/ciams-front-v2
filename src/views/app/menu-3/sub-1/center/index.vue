<template>
  <MapWrapperView v-if="mapConfig" :map-type="mapType" :map-config="mapConfig">
    <template #control>
      <Controls :map-type="mapType" />
    </template>
  </MapWrapperView>
</template>

<script setup lang="ts">
  import { onBeforeMount, reactive, ref } from 'vue'

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

  const mapType: MapType = 'Map-3-1-1'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_3-1-1'
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()

  async function init() {
    const wmtsCapability = await UitWMTSLayer.getWMTSCapabilities({
      key: 'CA5DC99D-28CA-3CF2-24B5-F0414D56DC84',
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

    const uitWMSLayer1 = new UitWMSLayer({
      baseUrl: API_INFO_MAPSTUDIO.PREFIX,
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
      baseUrl: API_INFO_MAPSTUDIO.PREFIX,
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
        layer: uitWMTSLayer,
        title: '용도지역',
        userVisible: false,
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

    mapWrap.value?.setTocCommonLayerGroups(commonLayerType, {
      title: '용도지역',
      layers: [mapLayers[2]] as MapLayer[],
    })
  }

  onBeforeMount(() => {
    init()
  })
</script>

<style scoped></style>

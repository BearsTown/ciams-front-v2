<template>
  <MapWrapperView v-if="mapConfig" :map-type="mapType" :map-config="mapConfig">
    <template #control>
      <Controls :map-type="mapType" />
    </template>
  </MapWrapperView>
</template>

<script setup lang="ts">
  import { onBeforeMount, reactive, ref } from 'vue'

  import MapWrapperView from '@/components/map/MapWrapper.vue'
  import Controls from '@/components/map/control/Controls.vue'

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

  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_1'
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()

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

  async function init() {
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

  async function initLayers() {}

  onBeforeMount(() => {
    init()
  })
</script>

<style scoped></style>

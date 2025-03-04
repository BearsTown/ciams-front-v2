<template>
  <div>
    <TargetList @item-select="areaItemSelect" @clear="clear" />
  </div>
</template>

<script setup lang="ts">
  import {
    computed,
    onActivated,
    onBeforeMount,
    onDeactivated,
    onMounted,
    reactive,
    ref,
    watch,
  } from 'vue'
  import { storeToRefs } from 'pinia'

  import TargetList from '@/components/common/TargetList.vue'

  import { Plan } from '@/api/app/menu-1/model'
  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub1store } from '@/stores/app/menu-1/sub-1'
  import { useMenu1StepCStore } from '@/stores/app/menu-1/step-c'
  import { MapLayer } from '@/js/layer'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'
  import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
  import { UitWFSLayer, UitWMSLayer } from '@uitgis/ol-ugis-test/layer'

  import { Stroke, Style } from 'ol/style'
  import Feature from 'ol/Feature'
  import { GeoJSON } from 'ol/format'
  import VectorSource from 'ol/source/Vector'
  import { like as likeFilter } from 'ol/format/filter'
  import { MapWrapper } from '@/js/mapWrapper'

  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import { useMapStore } from '@/stores/map/map'
  import UitWMTSLayer from '@uitgis/ol-ugis-test/layer/uitWMTSLayer'

  const globalStore = useGlobalStore()
  const menu1sub1store = useMenu1Sub1store()
  const menu1StepCStore = useMenu1StepCStore()

  const { layoutSelected } = storeToRefs(globalStore)
  const { overview } = storeToRefs(menu1StepCStore)

  const mapType = MapType.MAP_1
  const mapLayerGroupType: MapLayerGroupType = 'Menu_1_Tab_C'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType][mapLayerGroupType]

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

  // const layers = reactive<LayerState[]>([
  //   {
  //     layer: undefined,
  //     userVisible: true,
  //   },
  //   {
  //     layer: undefined,
  //     userVisible: true,
  //   },
  // ])

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: 'EDAE2DC5-ACD7-0847-DD96-991BF9E64CF9',
      LAYERS: ['CIAMS_P1_PLAN'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_p1_plan',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    opacity: 0.8,
    zIndex: 1111,
  })

  const uitVectorLayer2 = new UitWFSLayer({
    baseUrl: '',
    layerType: 'vector',
    source: new VectorSource(),
    visible: true,
    zIndex: 2222,
    style: new Style({
      stroke: new Stroke({
        color: '#0F825F',
        width: 4,
      }),
      zIndex: 100,
    }),
  })

  const mapLayers = reactive<MapLayer[]>([
    new MapLayer({
      layer: uitWMSLayer1,
      title: '대상지',
      userVisible: true,
      useLayerSetting: true,
    }),
    new MapLayer({
      layer: uitVectorLayer2,
      userVisible: true,
    }),
  ])

  function load() {
    mapLayers.forEach((item) => {
      if (item) {
        const uLayer = item.getLayer()
        if (uLayer instanceof UitWMSLayer) {
          mapWrap.value?.getUitMap().addWMSLayer(uLayer as UitWMSLayer)
        } else if (uLayer instanceof UitWFSLayer) {
          mapWrap.value?.getUitMap().addWFSLayer(uLayer as UitWFSLayer)
        } else if (uLayer instanceof UitWMTSLayer) {
          mapWrap.value?.getUitMap().addWMTSLayer(uLayer as UitWMTSLayer)
        }

        mapWrap.value?.addViewLayer({
          key: layerGroupName!,
          layers: [item] as MapLayer[],
        })
      }
    })

    mapWrap.value?.setViewLayersVisible(layerGroupName!, true)

    const tocViewLayerGroups = mapLayers[0] as MapLayer

    mapWrap.value?.setTocViewLayerGroups('VIEW_LAYER_GROUP_3', tocViewLayerGroups)
  }

  async function areaItemSelect(item: Plan.Search.Row) {
    layoutSelected.value?.right?.collapse?.on()
    mapStore.locationInfoVisible = false

    mapStore.controlManager?.closeAll()

    await menu1StepCStore.setOverview({
      planId: 'p1',
      name: item.name,
    })

    const res = await fetchFeatures({
      url: mapStudioUrl,
      key: 'EDAE2DC5-ACD7-0847-DD96-991BF9E64CF9',
      featureRequestProps: {
        layers: 'CIAMS_P1_PLAN',
        filter: likeFilter('name', item.name),
        srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
      },
    })
    let text = await res.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    uitVectorLayer2.clear()
    uitVectorLayer2.addFeatures(features)

    mapWrap.value
      ?.getUitMap()
      .getView()
      .fit(uitVectorLayer2.getSource().getExtent(), {
        padding: [200, 100, 200, 100],
      })
  }

  function clear() {
    overview.value = null
    uitVectorLayer2.clear()
  }

  watch(overview, async (value) => {
    // console.log(value)
  })

  const isActive = computed({
    get: () => {
      // return mapStore.controlManager?.getControl('mini-map')?.isVisible
      return mapStore.interactionManager?.getInteraction('drag-zoom-out')?.getActive()
    },
    set: (newValue: boolean) => {
      // mapStore.controlManager?.getControl('mini-map')?.setVisible(newValue)
      mapStore.interactionManager?.getInteraction('drag-zoom-out')?.setActive(newValue)
    },
  })

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()
    // mapObject = mapCacheStore.getMapObject(mapType)
    // mapWrap.value = await mapObject.getMapInstance()

    const uitMap = ref<UitMap>()
    uitMap.value = mapWrap.value?.getUitMap()
    const olMap = uitMap.value?.getMap()

    load()
  })

  onMounted(async () => {
    globalStore.layoutSelected?.right?.collapse?.on()
  })

  onActivated(() => {
    mapStore.currentMapGroup = 'Menu_1_Tab_C'

    mapWrap.value?.setViewLayersVisible(layerGroupName!, true)
    // uitVectorLayer2.setVisible(true)
  })

  onDeactivated(() => {
    // uitVectorLayer2.setVisible(false)
  })
</script>

<style scoped lang="scss">
  .urbanInfo {
    display: flex;
    flex-direction: column;
  }

  .urbanInfo .search .btn-group {
    flex: 1;
  }

  .urbanInfo .result-wrap {
    height: auto;
  }

  .btn-fixed {
    display: block;

    :deep(.el-radio-button) {
      width: 100%;
      min-width: 70px;
      max-width: 75px;

      .el-radio-button__inner {
        width: 100%;
        padding: 8px;
      }
    }
  }

  .select-bottom {
    :deep(.el-input) {
      & > .is-focus {
        box-shadow: none !important;
      }

      :hover {
        box-shadow: none !important;
      }
    }

    :deep(.el-input__wrapper) {
      box-shadow: none;
      border-radius: 0;
      border-bottom: 1px solid;
    }
  }
</style>

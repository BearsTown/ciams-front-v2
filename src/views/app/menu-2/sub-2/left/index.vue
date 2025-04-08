<template>
  <ZoneSegList :page-size="6" @item-select="zoneSegItemSelect" @clear="clear" />
</template>

<script setup lang="ts">
  import { onActivated, onMounted, reactive, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import ZoneSegList from '@/components/common/ZoneSegList.vue'

  import { useBoolean } from '@/hooks/useBoolean'
  import { useGlobalStore } from '@/stores/app'
  import { Plan } from '@/api/app/menu-1/model'
  import { useMenu2store } from '@/stores/app/menu-2'
  import { useMenu2Sub2Store } from '@/stores/app/menu-2/sub-2'
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
  import { useMapStore } from '@/stores/map/map'
  import UitWMTSLayer from '@uitgis/ol-ugis-test/layer/uitWMTSLayer'

  interface Layers {
    layer?: MapLayer
    userVisible: boolean
  }

  const menu2store = useMenu2store()
  const menu2Sub2Store = useMenu2Sub2Store()
  const { overview } = storeToRefs(menu2Sub2Store)

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)

  // const mapType = MapType.MAP_2
  const mapType: MapType = 'Map-2'
  const mapLayerGroupType: MapLayerGroupType = 'Menu_2_Sub_2'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '1E2DA8DC-0446-15DB-5EF7-6C0CC955E694',
      LAYERS: ['CIAMS_ZONE_1'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_analysis_1',
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

    mapWrap.value?.setTocViewLayerGroups(layerGroupName!, tocViewLayerGroups)
  }

  async function zoneSegItemSelect(item: Plan.Search.Row) {
    layoutSelected.value?.right?.collapse?.on()
    mapStore.locationInfoVisible = false

    mapStore.controlManager?.closeAll()

    await menu2Sub2Store.setOverview({
      zoneNo: item.zoneNo,
    })

    const res = await fetchFeatures({
      url: mapStudioUrl,
      key: '1E2DA8DC-0446-15DB-5EF7-6C0CC955E694',
      featureRequestProps: {
        // layers: 'CIAMS_P1_PLAN',
        layers: 'CIAMS_ZONE_1',
        filter: likeFilter('zone_no', item.zoneNo),
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

  onMounted(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    // mapObject = mapCacheStore.getMapObject(mapType)
    // mapWrap.value = await mapObject.getMapInstance()

    load()
  })

  onActivated(() => {
    mapStore.currentMapGroup = mapLayerGroupType
    mapWrap.value?.setViewLayersVisible(layerGroupName!, true)
  })
</script>

<style lang="scss">
  //@import '@/assets/css/zoningSetting.css';

  .zoningSetting .zoningSetting-top .customSelect {
    border: 0;
  }

  .zoningSetting-top.customCard .customSelect-value {
    font-size: 14px;
    border: 0;
    padding: 0;
  }

  .zoningSetting .customTab-item:not(.disabled).active {
    background: #52b597;
    color: #fff;
  }
</style>

<style scoped lang="scss">
  .zoningSetting-tab {
    margin: 0;
  }

  .customTab {
    display: flex;
    padding: 10px 0 10px 0;
    justify-content: space-between;

    .customTab-item {
      flex: 1;
      padding: 0;
      margin-left: 10px;
      background-color: white;
    }

    .customTab-item:first-child {
      margin-left: 0;
      margin-right: 0;
    }
  }
</style>

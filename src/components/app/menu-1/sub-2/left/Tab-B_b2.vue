<template>
  <div class="border-container" style="display: flex; flex-direction: column">
    <div class="customScroll" style="flex: 1; overflow-y: auto">
      <InsideCollapse title="토지 소유자 현황" :is-open="false" style="margin: 0 0 10px">
        <template #content>
          <Table :records="tempList" />
        </template>

        <template #sub>
          <div style="display: flex">
            <div style="flex: 1"></div>
            <el-switch
              size="small"
              v-model="mapLayers[0].userVisible"
              @change="userActiveChangeListener($event, 0)"
              @click.prevent.stop
            />
          </div>
        </template>
      </InsideCollapse>

      <InsideCollapse title="건축물 용도 현황" :is-open="false" style="margin: 0 0 10px">
        <template #content>
          <Table :records="tempList2" />
        </template>

        <template #sub>
          <div style="display: flex">
            <div style="flex: 1"></div>
            <el-switch
              size="small"
              v-model="mapLayers[1].userVisible"
              @change="userActiveChangeListener($event, 1)"
              @click.prevent.stop
            />
          </div>
        </template>
      </InsideCollapse>
    </div>

    <div style="flex: 1; overflow-y: hidden">
      <ZoneList :page-size="50" @item-select="zoneItemSelect" @clear="clear" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, reactive, ref } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  // import { useManagementStore } from '@/stores/app/zoneEstablish/management'
  import { MapLayer } from '@/js/layer'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'
  import UitWMSLayer from '@uitgis/ol-ugis-test/layer/uitWMSLayer'
  import { useGlobalStore } from '@/stores/app'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'
  import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'
  import UitWMTSLayer from '@uitgis/ol-ugis-test/layer/uitWMTSLayer'
  import ZoneList from '@/components/common/DistList/DistList.vue'
  import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
  import { like as likeFilter } from 'ol/format/filter'
  import { GeoJSON } from 'ol/format'
  import Feature from 'ol/Feature'
  import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'
  import VectorSource from 'ol/source/Vector'
  import { Stroke, Style } from 'ol/style'

  const globalStore = useGlobalStore()
  const menu1sub2store = useMenu1Sub2store()

  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1-2-2'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-2'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

  // const layers = reactive<LayerState[]>([
  //   {
  //     layer: undefined,
  //     userVisible: true,
  //   },
  //   {
  //     layer: undefined,
  //     userVisible: false,
  //   },
  // ])

  const tempList: object[] = [
    {
      layer: '국유지',
      area: 65.45,
      percent: 6.5,
    },
    {
      layer: '공유지',
      area: 312.55,
      percent: 31.1,
    },
    {
      layer: '사유지',
      area: 312.55,
      percent: 31.1,
    },
  ]

  const tempList2: object[] = [
    {
      layer: '국유지',
      area: 65.45,
      percent: 6.5,
    },
    {
      layer: '공유지',
      area: 312.55,
      percent: 31.1,
    },
    {
      layer: '사유지',
      area: 312.55,
      percent: 31.1,
    },
  ]

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '7DFEAB9C-E26B-50B9-10CF-3BC803FBF2F1',
      LAYERS: ['LAND_USE_TEST'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'LAND_USE_TEST',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    opacity: 0.8,
    zIndex: 1111,
  })

  const uitWMSLayer2 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '2F7C7B85-708C-0D8E-B981-BA4DE042E051',
      LAYERS: ['BUILD_TEST'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'BUILD_TEST',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    opacity: 0.8,
    zIndex: 1111,
  })

  const uitVectorLayer = new UitWFSLayer({
    baseUrl: '',
    layerType: 'vector',
    source: new VectorSource(),
    visible: true,
    zIndex: 2222,
    properties: {
      visibleIgnore: true,
    },
    style: new Style({
      stroke: new Stroke({
        color: '#4D7D99',
        width: 4,
      }),
      zIndex: 100,
    }),
  })

  const mapLayers = reactive<MapLayer[]>([
    new MapLayer({
      layer: uitWMSLayer1,
      userVisible: true,
    }),
    new MapLayer({
      layer: uitWMSLayer2,
      userVisible: false,
    }),
    new MapLayer({
      layer: uitVectorLayer,
      userVisible: true,
    }),
  ])

  function userActiveChangeListener(value: boolean, index: number) {
    mapLayers.forEach((_, i) => {
      if (mapLayers[i].getLayer().getProperties()?.visibleIgnore) {
        return
      }
      mapLayers[i].userVisible = i === index && value
      mapLayers[i].setUserVisible(mapLayers[i].userVisible)
    })
  }

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
  }

  async function zoneItemSelect(item: GisCiamsDistDTO.Search.Row) {
    // mapStore.controlManager?.closeAll()

    // await menu1StepCStore.setOverview({
    //   planId: 'p1',
    //   zoneNo: item.zoneNo,
    // })

    const res = await fetchFeatures({
      url: mapStudioUrl,
      key: '585C994F-2629-20C9-3EB8-619B3547E42F',
      featureRequestProps: {
        // layers: 'CIAMS_P1_PLAN',
        layers: 'CIAMS_DIST',
        filter: likeFilter('dist_no', item.distNo),
        srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
      },
    })
    let text = await res.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    uitVectorLayer.clear()
    uitVectorLayer.addFeatures(features)

    mapWrap.value
      ?.getUitMap()
      .getView()
      .fit(uitVectorLayer.getSource().getExtent(), {
        padding: [200, 100, 200, 100],
      })
  }

  function clear() {
    // overview.value = null
    uitVectorLayer.clear()
  }

  onMounted(async () => {})

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()
    // mapWrap.value = await mapCacheStore.getMapObject(mapType).getMapInstance()
    load()
  })

  onActivated(() => {
    mapStore.currentMapGroup = 'Menu-1-2-2'

    mapWrap.value?.setViewLayersVisible(layerGroupName!, true)
  })
</script>

<style scoped lang="scss">
  .border-box-round {
    background: #fff;
    border-radius: 8px;
  }

  :deep(.inside-collapse) {
    > div {
      .title {
        font-size: 13px;
        font-weight: normal;
      }
    }
  }
</style>

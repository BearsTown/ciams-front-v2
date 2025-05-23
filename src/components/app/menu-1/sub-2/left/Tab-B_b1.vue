<template>
  <div class="container customScroll">
    <InsideCollapse title="토지 소유자 현황" :is-open="true" style="margin: 0 0 10px">
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

    <InsideCollapse title="건축물 용도 현황" :is-open="true" style="margin: 0 0 10px">
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

  const mapLayers = reactive<MapLayer[]>([
    new MapLayer({
      layer: uitWMSLayer1,
      userVisible: true,
    }),
    new MapLayer({
      layer: uitWMSLayer2,
      userVisible: false,
    }),
  ])

  function userActiveChangeListener(value: boolean, index: number) {
    mapLayers.forEach((_, i) => {
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

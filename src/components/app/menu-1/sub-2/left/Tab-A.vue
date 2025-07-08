<template>
  <div class="container customScroll">
    <InsideCollapse title="용도지역" :is-open="true" style="margin: 0 0 10px">
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

    <InsideCollapse title="공업지역" :is-open="true" style="margin: 0 0 10px">
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

    <InsideCollapse title="도시공업지역" :is-open="true" style="margin: 0 0 10px">
      <template #content>
        <Table :records="tempList2" />
      </template>

      <template #sub>
        <div style="display: flex">
          <div style="flex: 1"></div>
          <el-switch
            size="small"
            v-model="mapLayers[2].userVisible"
            @change="userActiveChangeListener($event, 2)"
            @click.prevent.stop
          />
        </div>
      </template>
    </InsideCollapse>

    <InsideCollapse title="수립제외지역" :is-open="true" style="margin: 0 0 10px">
      <template #content>
        <Table :records="tempList3" />
      </template>

      <template #sub>
        <div style="display: flex">
          <div style="flex: 1"></div>
          <el-switch
            size="small"
            v-model="mapLayers[3].userVisible"
            @change="userActiveChangeListener($event, 3)"
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

  import { UitWFSLayer, UitWMSLayer, UitWMTSLayer } from '@uitgis/ol-ugis-test/layer'

  import { MapLayer } from '@/js/layer'
  import { MapWrapper } from '@/js/mapWrapper'
  import { API_INFO_MAPSTUDIO } from '@/config/config'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'

  const globalStore = useGlobalStore()
  const menu1sub2store = useMenu1Sub2store()

  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1-2-1'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-1'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const tempList: object[] = [
    {
      layer: '도시지역',
      area: 65.45,
      percent: 6.5,
    },
    {
      layer: '관리지역',
      area: 312.55,
      percent: 31.1,
    },
    {
      layer: '농림지역',
      area: 65.45,
      percent: 6.5,
    },
    {
      layer: '자연환경보전지역',
      area: 312.55,
      percent: 31.1,
    },
    {
      layer: '기타용도지역',
      area: 312.55,
      percent: 31.1,
    },
  ]

  const tempList2: object[] = [
    {
      layer: '일반공업지역',
      area: 65.45,
      percent: 6.5,
    },
    {
      layer: '준공업지역',
      area: 312.55,
      percent: 31.1,
    },
  ]

  const tempList3: object[] = [
    {
      layer: '산업단지',
      area: 65.45,
      percent: 6.5,
    },
    {
      layer: '문화산업단지',
      area: 312.55,
      percent: 31.1,
    },
    {
      layer: '경제자유구역',
      area: 312.55,
      percent: 31.1,
    },
    {
      layer: '항만배후단지',
      area: 312.55,
      percent: 31.1,
    },
  ]

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: '4E3030CC-D422-1740-0108-DBC8B1BEA424',
      LAYERS: ['CIAMS_P1_USE'],
    },
    layerType: 'wms',
    isSingleTile: false,
    opacity: 0.8,
    zIndex: 1111,
  })

  const uitWMSLayer2 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: '8C75FDDA-35F5-493E-328F-8B8C7F8CA0CF',
      LAYERS: ['CIAMS_P1_UQA300'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_p1_uqa300',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    opacity: 0.8,
    zIndex: 1111,
  })

  const uitWMSLayer3 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: 'C71716C0-8435-688A-D737-F2A4A4BBF4FD',
      LAYERS: ['CIAMS_P1_UQA300_URBAN'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_p1_uqa300_urban',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    opacity: 0.8,
    zIndex: 1111,
  })

  const uitWMSLayer4 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: 'C411380C-E985-DF54-62F7-22890F1D300B',
      LAYERS: ['CIAMS_P1_LIMIT'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_p1_limit',
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
    new MapLayer({
      layer: uitWMSLayer3,
      userVisible: false,
    }),
    new MapLayer({
      layer: uitWMSLayer4,
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
    mapStore.currentMapGroup = 'Menu-1-2-1'

    mapWrap.value?.setViewLayersVisible(layerGroupName!, true)

    console.log(mapWrap.value?.getViewLayers()[layerGroupName!])
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

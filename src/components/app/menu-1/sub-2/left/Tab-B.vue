<template>
  <div class="" style="display: flex; flex-direction: column; height: 100%">
    <div style="flex: 1; overflow-y: hidden">
      <DistList
        :page-size="50"
        ref="distListRef"
        @item-select="zoneItemSelect"
        @clear="clear"
        @on-mounted="handleChildMounted"
      />
    </div>

    <el-divider border-style="dashed" style="margin: 10px 0" />

    <div class="customScroll" style="flex: 1; overflow-y: auto">
      <template v-for="(category, idx) in state.categories" :key="category.id">
        <InsideCollapse
          :title="category.name"
          :is-open="category.active.status"
          style="margin: 0 0 10px"
        >
          <template #sub>
            <div style="display: flex">
              <div style="flex: 1"></div>
              <el-switch
                size="small"
                v-model="category.active.status"
                @change="handleSwitchChange(category.id)"
                @click.prevent.stop
              />
            </div>
          </template>
        </InsideCollapse>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, reactive, ref } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'

  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  import { useMenu1_2_2Store } from '@/stores/app/menu-1/sub-2/tab-b'

  // import { useManagementStore } from '@/stores/app/zoneEstablish/management'
  import { MapLayer } from '@/js/layer'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'
  import UitWMSLayer from '@uitgis/ol-ugis-test/layer/uitWMSLayer'
  import { useGlobalStore } from '@/stores/app'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'
  import DistList from '@/components/common/DistList/DistList.vue'
  import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'
  import { Style } from 'ol/style'

  const distListRef = ref<InstanceType<typeof DistList>>()

  const globalStore = useGlobalStore()
  const menu1sub2store = useMenu1Sub2store()
  const menu1_2_2Store = useMenu1_2_2Store()

  const mapType: MapType = 'Map-1-2-2'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-2'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

  const state = menu1_2_2Store.state

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

  const uitWMSLayer3 = new UitWMSLayer({
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

  const uitWMSLayer4 = new UitWMSLayer({
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

  const uitWMSLayer5 = new UitWMSLayer({
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
    new MapLayer({
      layer: uitWMSLayer3,
      userVisible: false,
    }),
    new MapLayer({
      layer: uitWMSLayer4,
      userVisible: false,
    }),
    new MapLayer({
      layer: uitWMSLayer5,
      userVisible: false,
    }),
  ])

  async function handleSwitchChange(categoryId) {
    // mapLayers.forEach((_, i) => {
    //   if (mapLayers[i].getLayer().getProperties()?.visibleIgnore) {
    //     return
    //   }
    //   mapLayers[i].userVisible = i === index && value
    //   mapLayers[i].setUserVisible(mapLayers[i].userVisible)
    // })

    await menu1_2_2Store.setActiveCategory(categoryId)
  }

  function load() {
    // mapLayers.forEach((item) => {
    //   if (item) {
    //     const uLayer = item.getLayer()
    //     if (uLayer instanceof UitWMSLayer) {
    //       mapWrap.value?.getUitMap().addWMSLayer(uLayer as UitWMSLayer)
    //     } else if (uLayer instanceof UitWFSLayer) {
    //       mapWrap.value?.getUitMap().addWFSLayer(uLayer as UitWFSLayer)
    //     } else if (uLayer instanceof UitWMTSLayer) {
    //       mapWrap.value?.getUitMap().addWMTSLayer(uLayer as UitWMTSLayer)
    //     }
    //
    //     mapWrap.value?.addViewLayer({
    //       key: layerGroupName!,
    //       layers: [item] as MapLayer[],
    //     })
    //   }
    // })
    //
    // mapWrap.value?.setViewLayersVisible(layerGroupName!, true)
  }

  async function zoneItemSelect(item: GisCiamsDistDTO.Search.Row) {
    await menu1_2_2Store.callSelectDist(item.distNo)
  }

  function clear() {
    // overview.value = null
    menu1_2_2Store.distVectorLayer.clear()
  }

  async function handleChildMounted() {
    mapWrap.value = await mapStore.getMapInstance()

    distListRef.value?.selectIndex()
  }

  onMounted(async () => {})

  onBeforeMount(async () => {
    await menu1_2_2Store.init(1)

    load()

    await handleSwitchChange(menu1_2_2Store.state.categories[0].id)
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

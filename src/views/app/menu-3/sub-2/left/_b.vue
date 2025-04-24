<template>
  <div style="display: flex; width: 100%; height: 100%; padding: 15px 12px; flex-direction: column">
    <MenuCollapse class="menuButton" title="산업육성 및 지원 방안" type="" :is-open="false">
      <template #content>
        <div style="height: 100px">AA</div>
      </template>
    </MenuCollapse>

    <MenuCollapse class="menuButton" title="공간관리방안" type="" :is-open="true">
      <template #content>
        <div style="height: 100px">AA</div>
        <div style="height: 100px">AA</div>

        <div style="height: 1000px">AA</div>
        <div style="height: 100px">AA</div>
      </template>
    </MenuCollapse>

    <MenuCollapse class="menuButton" title="환경관리방안" type="" :is-open="false">
      <template #content>
        <div style="height: 100px">AA</div>
        <div style="height: 100px">AA</div>

        <div style="height: 1000px">AA</div>
        <div style="height: 100px">AA</div>
      </template>
    </MenuCollapse>

    <!--    <button class="popButton" @click="showImage(1)">공간관리방안</button>-->
    <!--    <button class="popButton" @click="showImage(2)">환경관리방안</button>-->

    <el-image
      ref="imageRef"
      :preview-teleported="true"
      style="width: 0; height: 0"
      :preview-src-list="srcList"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    computed,
    DefineComponent,
    nextTick,
    onActivated,
    onMounted,
    reactive,
    ref,
    watch,
  } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useBoolean } from '@/hooks/useBoolean'
  import { useGlobalStore } from '@/stores/app'
  import { PlanZone } from '@/api/app/zone/model'
  import { useMenu3store } from '@/stores/app/menu-3'
  import { useMenu3Sub2Store } from '@/stores/app/menu-3/sub-2'
  import { MapLayer } from '@/js/layer'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'
  import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
  import { UitWFSLayer, UitWMSLayer } from '@uitgis/ol-ugis-test/layer'

  import type { ImageInstance } from 'element-plus'

  import { Stroke, Style } from 'ol/style'
  import Feature from 'ol/Feature'
  import { GeoJSON } from 'ol/format'
  import VectorSource from 'ol/source/Vector'
  import { like as likeFilter } from 'ol/format/filter'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'
  import UitWMTSLayer from '@uitgis/ol-ugis-test/layer/uitWMTSLayer'
  import { API_INFO_CIAMS } from '@/config/config'
  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'
  import { Menu3Sub2TabIdType } from '@/stores/app/menu-3/sub-2'
  import TabAComp from '@/components/app/menu-1/sub-1/left/Tab-A.vue'
  import TabBComp from 'src/components/app/menu-1/sub-1/left/tab-B'
  import TabCComp from '@/components/app/menu-1/sub-1/left/Tab-CC.vue'

  const menu3store = useMenu3store()
  const menu3Sub2Store = useMenu3Sub2Store()

  const globalStore = useGlobalStore()
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)

  // const mapType = MapType.MAP_3
  const mapType: MapType = 'Map-3'
  const mapLayerGroupType: MapLayerGroupType = 'Menu_3_Sub_1'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const components: Record<Menu3Sub2TabIdType, DefineComponent> = {
    TabA: TabAComp,
    TabB: TabBComp,
    TabC: TabCComp,
  }
  const currentTabComponent = computed(() => components[menu3Sub2Store.selectedTabId] || TabAComp)

  const r1 = ref(true)

  function test(value: string | number | boolean) {
    console.log(value)
  }

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '724A0C98-F8D5-E230-5713-A4B9EFAC4F51',
      LAYERS: ['CIAMS_ZONE'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_dist',
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
        color: '#4D7D99',
        width: 4,
      }),
      zIndex: 100,
    }),
  })

  const mapLayers = reactive<MapLayer[]>([
    new MapLayer({
      layer: uitWMSLayer1,
      title: '관리유형',
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

  // async function zoneAnalysisItemSelect(item: PlanZone.Search.Row) {
  //   layoutSelected.value?.right?.collapse?.on()
  //   mapStore.locationInfoVisible = false
  //
  //   mapStore.controlManager?.closeAll()
  //
  //   await menu3Sub1Store.setOverview({
  //     zoneNo: item.zoneNo,
  //   })
  //
  //   const res = await fetchFeatures({
  //     url: mapStudioUrl,
  //     key: '724A0C98-F8D5-E230-5713-A4B9EFAC4F51',
  //     featureRequestProps: {
  //       layers: 'CIAMS_ZONE',
  //       filter: likeFilter('zone_no', item.zoneNo),
  //       srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
  //     },
  //   })
  //   let text = await res.text()
  //   text = text.replace(/\n/gi, '\\r\n')
  //   const features = new GeoJSON().readFeatures(text) as Feature[]
  //
  //   uitVectorLayer2.clear()
  //   uitVectorLayer2.addFeatures(features)
  //
  //   mapWrap.value
  //     ?.getUitMap()
  //     .getView()
  //     .fit(uitVectorLayer2.getSource().getExtent(), {
  //       padding: [200, 100, 200, 100],
  //     })
  // }

  // function clear() {
  //   overview.value = null
  //   uitVectorLayer2.clear()
  // }

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'

  const imageRef = ref<ImageInstance>()
  const srcList = ref<string[]>([])

  function showImage(type) {
    if (type === 1) {
      srcList.value = [prefixPath + '2b4a606a-5fa4-4213-8546-c10426903dfb']
    } else if (type === 2) {
      srcList.value = [prefixPath + 'e05f587b-5d3b-4f24-a326-34389f7a209f']
    }

    nextTick(() => {
      imageRef.value?.showPreview()
    })
  }

  // watch(overview, async (value) => {
  // console.log(value)
  // })

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
    background: #7AAAD1;
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

  .menuButton {
    overflow-y: hidden;

    &:not(:first-child) {
      margin-top: 8px;
    }
  }
</style>

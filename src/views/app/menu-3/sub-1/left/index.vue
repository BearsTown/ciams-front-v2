<template>
  <div style="display: flex; width: 100%; height: 100%; padding: 15px 12px; flex-direction: column">
    <button class="popButton" @click="showImage(1)">
      <span style="padding: 5px 0">1. 도시공업지역 활성화 목표 및 전략</span>
    </button>
    <div
      style="
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        flex: 1;
        border-radius: 8px;
        color: #616161;
        background: #fff;
        margin-top: 8px;
        box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.12);
      "
    >
      <div
        style="
          font-size: 16px;
          padding: 10px;
          color: #616161;
          border-radius: 8px;
          background: #fff;
          text-align: left;
        "
      >
        <span style="padding: 5px 0">2. 도시공업지역 유형별 관리방향</span>
      </div>
      <div style="flex: 1; background: #fff; border-radius: 8px; overflow-y: hidden">
        <ZoneList
          :page-size="4"
          @item-select="zoneItemSelect"
          @clear="clear"
          :category="category"
        />
      </div>
    </div>
    <button class="popButton" @click="showImage(2)">
      <span style="padding: 5px 0">3. 도시공업지역 기본구상(안)</span>
    </button>

    <el-image
      ref="imageRef"
      :preview-teleported="true"
      style="width: 0; height: 0"
      :preview-src-list="srcList"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onActivated, onMounted, reactive, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import type { ImageInstance } from 'element-plus'

  import Feature from 'ol/Feature'
  import { GeoJSON } from 'ol/format'
  import { Stroke, Style } from 'ol/style'
  import VectorSource from 'ol/source/Vector'
  import { like as likeFilter } from 'ol/format/filter'

  import ZoneList from '@/components/common/ZoneTable/ZoneList.vue'

  import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
  import { UitWFSLayer, UitWMSLayer, UitWMTSLayer } from '@uitgis/ol-ugis-test/layer'

  import { MapLayer } from '@/js/layer'
  import { useBoolean } from '@/hooks/useBoolean'
  import { API_INFO_CIAMS, API_INFO_MAPSTUDIO } from '@/config/config'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'

  import { MapWrapper } from '@/js/mapWrapper'

  import { CiamsZoneDTO } from '@/api/app/zone/model'
  import { CiamsMenu3Sub1DetailsDto } from '@/api/app/menu-3/sub-1/model'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useMenu3Sub1Store } from '@/stores/app/menu-3/sub-1'

  const globalStore = useGlobalStore()
  const menu3Sub1Store = useMenu3Sub1Store()

  const state = menu3Sub1Store.state
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)
  const overview = computed<CiamsZoneDTO.Overview.Find.Result | undefined>(() => state.overview)

  const mapType: MapType = 'Map-3-1-1'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-3-1-1'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const imageRef = ref<ImageInstance>()
  const srcList = ref<string[]>([])
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'

  const category = ref({
    name: 'mngCd',
    title: '관리유형',
    list: computed(() => state.tags),
  })

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: 'F91A8E17-FA4F-81B6-D344-0FAFBB68DFF2',
      LAYERS: ['CIAMS_ZONE_3'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_zone',
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
        // color: '#4D7D99',
        color: '#FF0000',
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

  async function zoneItemSelect(item: CiamsZoneDTO.Search.Row) {
    layoutSelected.value?.right?.collapse?.on()
    mapStore.locationInfoVisible = false

    mapStore.controlManager?.closeAll()

    await menu3Sub1Store.setOverview({
      zoneNo: item.zoneNo,
    })

    const res = await fetchFeatures({
      url: API_INFO_MAPSTUDIO.PREFIX,
      key: '724A0C98-F8D5-E230-5713-A4B9EFAC4F51',
      featureRequestProps: {
        layers: 'CIAMS_ZONE',
        filter: likeFilter('zone_no', item.zoneNo),
        srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
      },
    })
    let text = await res.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    uitVectorLayer2.clear()
    uitVectorLayer2.addFeatures(features)

    const map = mapWrap.value!.getUitMap().getMap()!

    // 좌우 패널의 픽셀 크기
    const leftPanelWidth = layoutSelected.value?.left?.collapse?.status ? 355 : 0 // 왼쪽 패널의 픽셀 크기
    const rightPanelWidth = layoutSelected.value?.right?.collapse?.status ? 585 : 0 // 오른쪽 패널의 픽셀 크기
    const bottomPanelWidth = layoutSelected.value?.bottom?.collapse?.status ? 350 : 0 // 하단 패널의 픽셀 크기

    // 뷰포트 크기 가져오기
    const viewportSize = map.getTargetElement().getBoundingClientRect()
    const mapWidth = viewportSize.width
    const mapHeight = viewportSize.height

    mapWrap.value
      ?.getUitMap()
      .getView()
      .fit(uitVectorLayer2.getSource().getExtent(), {
        // size: [mapWidth + leftPanelWidth - rightPanelWidth, mapHeight - bottomPanelWidth],
        padding: [0, rightPanelWidth, bottomPanelWidth, leftPanelWidth],
      })
  }

  function clear() {
    menu3Sub1Store.clear()
    uitVectorLayer2.clear()
  }

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

  onMounted(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    await menu3Sub1Store.setTagList('AR0400')

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
    background: #7aaad1;
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

  .popButton {
    font-size: 16px;
    padding: 10px;
    color: #616161;
    border-radius: 8px;
    background: #fff;
    justify-content: left !important;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.12);
    transition: 0.2s;

    &:hover {
      color: var(--ugis-color-white);
      opacity: 0.95;
      background-color: var(--ugis-color-temp-2);
    }

    .title {
      padding: 5px 0;
    }

    &:not(:first-child) {
      margin-top: 8px;
    }
  }
</style>

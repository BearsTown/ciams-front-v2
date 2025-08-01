<template>
  <ZoneList :page-size="6" @item-select="zoneItemSelect" @clear="clear" :category="category" />
</template>

<script setup lang="ts">
  import { computed, onActivated, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import Feature from 'ol/Feature'
  import { GeoJSON } from 'ol/format'
  import { Stroke, Style } from 'ol/style'
  import VectorSource from 'ol/source/Vector'
  import { like as likeFilter } from 'ol/format/filter'

  import ZoneList from '@/components/common/ZoneTable/ZoneList.vue'

  import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
  import { UitWFSLayer, UitWMSLayer, UitWMTSLayer } from '@uitgis/ol-ugis-test/layer'

  import { MapLayer } from '@/js/layer'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useBoolean } from '@/hooks/useBoolean'
  import { API_INFO_MAPSTUDIO } from '@/config/config'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'

  import { CiamsZoneDTO } from '@/api/app/zone/model'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useClassifyAnalysisManagementStore } from '@/stores/app/classify-analysis/management'

  const globalStore = useGlobalStore()
  const classifyAnalysisManagementStore = useClassifyAnalysisManagementStore()

  const state = classifyAnalysisManagementStore.state
  const { layoutSelected } = storeToRefs(globalStore)
  const { status: isActive, toggle } = useBoolean(false)
  const overview = computed<CiamsZoneDTO.Overview.Find.Result | undefined>(() => state.overview)

  const mapType: MapType = 'Map-Classify'
  const mapLayerGroupType: MapLayerGroupType = 'Menu_2_Sub_3'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const category = ref({
    name: 'dvsCd',
    title: '유형구분',
    list: computed(() => state.tags),
  })

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: API_INFO_MAPSTUDIO.PREFIX,
    sourceParams: {
      KEY: 'F91A8E17-FA4F-81B6-D344-0FAFBB68DFF2',
      LAYERS: ['CIAMS_ZONE_2'],
    },
    crossOrigin: 'Anonymous',
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

  const mapLayers: MapLayer[] = [
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
  ]

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
      }
    })

    mapWrap.value?.addViewLayer({
      key: layerGroupName!,
      layers: mapLayers,
    })

    mapWrap.value?.setViewLayersVisible(layerGroupName!, true)

    mapWrap.value?.setTocViewLayerGroups(layerGroupName!, {
      title: '관리유형구분',
      layers: [mapLayers[0]],
    })
  }

  async function zoneItemSelect(item: CiamsZoneDTO.Search.Row) {
    layoutSelected.value?.right?.collapse?.on()
    mapStore.locationInfoVisible = false

    mapStore.controlManager?.closeAll()

    await classifyAnalysisManagementStore.setOverview({
      zoneNo: item.zoneNo,
    })

    const res = await fetchFeatures({
      url: API_INFO_MAPSTUDIO.PREFIX,
      key: 'F91A8E17-FA4F-81B6-D344-0FAFBB68DFF2',
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
    classifyAnalysisManagementStore.clear()
    uitVectorLayer2.clear()
  }

  onMounted(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    await classifyAnalysisManagementStore.setTagList('AR0300')

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
</style>

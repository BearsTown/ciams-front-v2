<template>
  <div class="border-container" style="display: flex; flex-direction: column">
    <div class="customScroll" style="flex: 1; overflow-y: auto">
      <template v-for="category in state.categories" :key="category.id">
        <InsideCollapse
          :title="category.title"
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

    <div style="flex: 1; overflow-y: hidden">
      <ZoneList :page-size="50" @item-select="zoneItemSelect" @clear="clear" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'

  import { useMenu1Sub2store } from '@/stores/app/menu-1/sub-2'
  import { useMenu1_2_3Store } from '@/stores/app/menu-1/sub-2/tab-c'

  // import { useManagementStore } from '@/stores/app/zoneEstablish/management'
  import { MapLayer } from '@/js/layer'
  import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'
  import { useGlobalStore } from '@/stores/app'
  import { MapWrapper } from '@/js/mapWrapper'
  import { useMapStore } from '@/stores/map/map'
  import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'
  import ZoneList from '@/components/common/DistList/DistList.vue'
  import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
  import { like as likeFilter } from 'ol/format/filter'
  import { GeoJSON } from 'ol/format'
  import Feature from 'ol/Feature'
  import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'
  import VectorSource from 'ol/source/Vector'
  import { Stroke, Style } from 'ol/style'
  import commonUtil from '@/utils/commonUtil'

  const globalStore = useGlobalStore()
  const menu1sub2store = useMenu1Sub2store()
  const menu1_2_3Store = useMenu1_2_3Store()

  // const mapType = MapType.MAP_1
  const mapType: MapType = 'Map-1-2-3'
  const mapLayerGroupType: MapLayerGroupType = 'Menu-1-2-3'
  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)
  const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

  const { state } = storeToRefs(menu1_2_3Store)

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

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
        width: 3,
      }),
      zIndex: 100,
    }),
  })

  // const mapLayers = reactive<MapLayer[]>([
  //   new MapLayer({
  //     layer: uitVectorLayer,
  //     userVisible: true,
  //   }),
  // ])

  // function userActiveChangeListener(value: boolean, index: number) {
  //   mapLayers.forEach((_, i) => {
  //     if (mapLayers[i].getLayer().getProperties()?.visibleIgnore) {
  //       return
  //     }
  //     mapLayers[i].userVisible = i === index && value
  //     mapLayers[i].setUserVisible(mapLayers[i].userVisible)
  //   })
  // }

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

    const targetLayer = new MapLayer({
      layer: uitVectorLayer,
      userVisible: true,
    })

    mapWrap.value?.getUitMap().addWFSLayer(targetLayer.getLayer() as UitWFSLayer)
  }

  function changeCategory(category) {
    menu1_2_3Store.setActiveCategory(category.id) // 스토어 메서드 호출
    if (category.years.length > 0) {
      menu1_2_3Store.state.activeYear = category.years[0].id
    }
  }

  // 스위치 변경 핸들러
  function handleSwitchChange(selectedCategory) {
    console.log(selectedCategory.title)
    console.log(selectedCategory.active.status)
    const cYears = selectedCategory.years

    console.log('To Do :: 다른 레이어 전체 삭제')

    if (selectedCategory.active.status) {
      console.log('최근년도로 설정 및 년도 변경 이벤트 트리거')
      menu1_2_3Store.state.activeYear = cYears[cYears.length - 1]?.id
      menu1_2_3Store.callChangeYear()

      // 선택된 카테고리가 ON이면 나머지 모두 OFF로 설정
      menu1_2_3Store.state.categories.forEach((category) => {
        if (category.id !== selectedCategory.id) {
          category.active.off()
        }
      })
      if (!commonUtil.isEmpty(menu1_2_3Store.state.activeYear)) {
        // debugger
        // menu1_2_3Store.state.selectYear = cYears[cYears.length - 1]?.id
      }
      // 선택된 카테고리의 첫 번째 년도를 기본 선택
      // if (selectedCategory.years.length > 0) {
      //   menu1_2_3Store.state.selectYear = selectedCategory.years[0].id
      // }
    } else {
      // 선택된 카테고리가 OFF로 변경되면 기본적으로 하나는 ON이어야 하므로 첫 번째 카테고리를 ON으로 설정
      const firstCategory = menu1_2_3Store.state.categories[0]
      if (firstCategory && !menu1_2_3Store.state.categories.some((cat) => cat.active.status)) {
        firstCategory.active.on()

        if (!commonUtil.isEmpty(menu1_2_3Store.state.activeYear)) {
          console.log('최근년도로 설정 및 년도 변경 이벤트 트리거')
          menu1_2_3Store.state.activeYear = cYears[cYears.length - 1]?.id
          menu1_2_3Store.callChangeYear()
        }
      }
    }
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

    if (!commonUtil.isEmpty(features)) {
      menu1_2_3Store.setSelectDist(features[0].getProperties()['DIST_NO'])
    }

    mapWrap.value
      ?.getUitMap()
      .getView()
      .fit(uitVectorLayer.getSource().getExtent(), {
        padding: [200, 100, 200, 100],
      })

    menu1_2_3Store.callSelectDist()
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

    await menu1_2_3Store.init()

    // menu1_2_3Store.state.categories[0].active.on()
    handleSwitchChange(menu1_2_3Store.state.categories[0])
  })

  onActivated(() => {
    mapStore.currentMapGroup = 'Menu-1-2-3'

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

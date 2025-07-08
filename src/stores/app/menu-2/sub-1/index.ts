import { computed, markRaw, reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import Feature from 'ol/Feature'
import { GeoJSON, WFS } from 'ol/format'
import { intersects, like as likeFilter } from 'ol/format/filter'

import { urlWithParams } from '@uitgis/ol-ugis-test/util'
import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
import { UitWFSLayer, UitWMSLayer } from '@uitgis/ol-ugis-test/layer'

import { dataUtil } from '@/utils'
import CommonUtil from '@/utils/commonUtil'
import { MapLayer } from '@/js/layer'
import { MapWrapper } from '@/js/mapWrapper'
import { Attribute, Item } from '@/utils/data.types'
import { API_INFO_MAPSTUDIO } from '@/config/config'
import { useBoolean, UseBoolean } from '@/hooks/useBoolean'
import { MapLayerGroupType, MapType, ViewLayerTypes } from '@/enums/mapEnum'

import { getMenu2ZoneOverView } from '@/api/app/menu-2'
import { Menu2ZoneDetailsDto } from '@/api/app/menu-2/model'
import { getDataConfig, getDataGroups } from '@/api/app/menu-1'

import { useMapStore } from '@/stores/map/map'
import UitUWMSLayer from '@/stores/map/uwmsLayer'

interface Category {
  id: number
  name: string
  years: YearDetail[]
  priority: number
  active: UseBoolean

  groupColumn: string
  useNoneColumn: boolean
  chartAxis: string
}

interface YearDetail {
  id: string
  layerVisible: boolean
  title: string
  layer: MapLayer | null
  features: Feature[]
  year?: string
  style: string
  layerName?: string
  tableData: Item[]
  chartData: {}
}

interface State {
  categories: Category[]
  attributes: Attribute[]

  mapWrap?: MapWrapper

  activeCategory?: Category
  activeYear?: YearDetail
  activeZoneId?: string
  activeZoneFeature?: Feature
}

const mapType: MapType = 'Map-2'
const mapLayerGroupType: MapLayerGroupType = 'Menu_2_Sub_1'
const layerGroupName = ViewLayerTypes[mapType]![mapLayerGroupType]

export const useMenu2Sub1Store = defineStore('menu2Sub1Store', () => {
  const overview = ref<Menu2ZoneDetailsDto.Overview.Find.Result | null>()

  const state: State = reactive({
    categories: ref([]),
    attributes: ref([]),
  })

  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)

  const columns = ref<any>([])

  async function setOverview(params: Menu2ZoneDetailsDto.Overview.Find.Params) {
    const { data } = await getMenu2ZoneOverView(params)
    overview.value = data
  }

  async function fetchAttributes() {
    const activeCategory = state.activeCategory
    if (CommonUtil.isEmpty(activeCategory)) return false

    const { data } = await getDataConfig(activeCategory!.id)

    state.attributes = data.attributes as Attribute[]

    activeCategory!.years = data.years.map((year) => ({
      ...year,
      id: year.year,
      title: `${year.year}년`,
    }))

    columns.value = data.columns
  }

  async function fetchCategories(id: number) {
    const { data: rawCategories } = await getDataGroups(id)

    state.categories = rawCategories.map((category) => ({
      ...category,
      active: useBoolean(false),
    }))
  }

  async function init(id: number) {
    mapWrap.value = await mapStore.getMapInstance()
    await fetchCategories(id)
  }

  function getSelectDetail() {
    const select = findSelect()
    if (select) {
      return select.years?.find((detail) => detail.id === state.activeYear?.id)
    }
  }

  function findSelect() {
    if (!CommonUtil.isEmpty(state.categories)) {
      return state.categories.find((category) => category.active.status)
    } else {
      return undefined
    }
  }

  async function setActiveCategory(categoryId: number) {
    if (CommonUtil.isEmpty(state.categories)) return false

    state.attributes = []

    const categoryExists = state.categories.some((category) => category.id === categoryId)
    if (!categoryExists) {
      console.warn(`Item with id ${categoryId} not found`)
      return
    }

    if (state.activeCategory?.id === categoryId) {
      state.activeCategory = undefined
      resetYearData()
      return
    }

    state.categories.forEach((category) => {
      if (category.id === categoryId) {
        category.active.on()
        state.activeCategory = category
      } else {
        category.active.off()
      }
    })

    await fetchAttributes()

    console.log('최근년도로 설정 및 년도 변경 이벤트 트리거')
    const cYears = findSelect()!.years
    state.activeYear = cYears[cYears.length - 1]

    resetYearData()
    await callChangeYear()
  }

  function setSelectZone(id: string) {
    state.activeZoneId = id
  }

  function setSelectZoneFeature(fe: Feature) {
    state.activeZoneFeature = fe
  }

  async function callSelectZone(zoneNo: string) {
    await loadZoneFeatures(zoneNo)

    console.log(`선택 사업체현황 분류 :: ${findSelect()?.name}`)
    console.log(`선택 년도 :: ${state.activeYear}`)
    console.log(`선택 대상지 :: ${state.activeZoneId}`)
    console.log('사업체분류(전체) feature 삭제')
    console.log(`데이터 API 호출`)

    resetYearData()

    await callChangeYear()
  }

  async function callChangeYear() {
    console.log(`년도 변경 이벤트`)
    console.log(`선택 사업체현황 분류 :: ${findSelect()?.name}`)
    console.log(`선택 년도 :: ${state.activeYear}`)
    console.log(`선택 대상지 :: ${state.activeZoneId}`)
    console.log(`데이터 API 호출`)

    const selectDetail = getSelectDetail()

    // if (selectDetail && state.activeYear && state.activeZoneId) {
    if (selectDetail && state.activeYear) {
      if (CommonUtil.isEmpty(selectDetail?.layer)) {
        const cYears = findSelect()!.years
        const index = cYears.findIndex((detail) => detail.id === state.activeYear?.id)

        const uWmsLayer = new UitUWMSLayer({
          baseUrl: API_INFO_MAPSTUDIO.PREFIX,
          useCQL_FILTER: true,
          sourceParams: {
            KEY: 'system',
            LAYERS: [state.activeYear!.layerName!],
            STYLES: `system:${state.activeYear!.style!}`,
            // CQL_FILTER: "ZONE_NO = 'TEMP_KEY_001'",
          },
          crossOrigin: 'Anonymous',
          properties: {
            id: 'ciams_analysis_in',
            type: 'wms',
          },
          layerType: 'wms',
          isSingleTile: true,
          opacity: 0.8,
          zIndex: 2222 + index,
        })

        selectDetail!.layer = markRaw<MapLayer>(
          new MapLayer({
            layer: uWmsLayer,
            userVisible: true,
          }),
        )

        mapWrap.value?.getUitMap().addWMSLayer(uWmsLayer as UitWMSLayer)

        mapWrap.value?.addViewLayer({
          key: layerGroupName!,
          layers: [selectDetail!.layer],
        })
      }

      await loadIndustryFeatures()

      const fLayer = selectDetail?.layer?.getLayer() as UitWFSLayer
      if (state.activeZoneId && fLayer) {
        selectDetail.tableData = dataUtil.processData({
          // features: fLayer.getSource().getFeatures(),
          features: selectDetail?.features,
          columns: columns.value,
          rows: state.attributes,
          groupName: state.activeCategory?.groupColumn,
          useNoneColumn: state.activeCategory?.useNoneColumn,
        })
      }
    }
  }

  async function loadZoneFeatures(zoneNo: string) {
    const res = await fetchFeatures({
      url: API_INFO_MAPSTUDIO.PREFIX,
      key: '1E2DA8DC-0446-15DB-5EF7-6C0CC955E694',
      featureRequestProps: {
        layers: 'CIAMS_ZONE',
        filter: likeFilter('zone_no', zoneNo),
        srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
      },
    })
    let text = await res.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    // zoneVectorLayer.clear()
    // zoneVectorLayer.addFeatures(features)

    // mapWrap.value
    //   ?.getUitMap()
    //   .getView()
    //   .fit(zoneVectorLayer.getSource().getExtent(), {
    //     padding: [200, 100, 200, 100],
    //   })

    if (!CommonUtil.isEmpty(features)) {
      setSelectZone(features[0].getProperties()['ZONE_NO'])
      setSelectZoneFeature(features[0])
    }
  }

  async function loadIndustryFeatures() {
    if (CommonUtil.isEmpty(state.activeZoneFeature)) return false

    const points = await fetch(
      urlWithParams(API_INFO_MAPSTUDIO.PREFIX + '/uwfs', {
        KEY: 'system',
      }),
      {
        method: 'POST',
        body: new XMLSerializer().serializeToString(
          new WFS().writeGetFeature({
            srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
            featureNS: 'http://www.opengis.net/wfs',
            featurePrefix: 'feature',
            outputFormat: 'application/json',
            featureTypes: [state.activeYear!.layerName!],
            filter: intersects(
              'SHAPE',
              state.activeZoneFeature!.getGeometry()!,
              mapWrap.value?.getUitMap().getView().getProjection().getCode(),
            ),
          }),
        ),
      },
    )

    let text = await points.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    // const fLayer = getSelectDetail()?.layer?.getLayer() as UitWFSLayer
    if (features) {
      // fLayer.clear()
      // fLayer.addFeatures(features)

      getSelectDetail()!.features = markRaw(features)
    }

    // const fLayer = getSelectDetail()?.layer?.getLayer() as UitWFSLayer
    // if (fLayer) {
    //   fLayer.clear()
    //   fLayer.addFeatures(features)
    //
    //   getSelectDetail()!.features = markRaw(features)
    // }
  }

  // 년도별 상세 데이터 초기화
  function resetYearData() {
    console.log('년도별 상세 데이터 초기화')
    state.categories.forEach((category) => {
      category.years?.forEach((detail) => {
        // detail.features = []
        detail.tableData = []
        // detail.chartData = {}
        detail.layerVisible = true

        if (detail.layer) {
          mapWrap.value?.getUitMap().removeLayer(detail.layer.getLayer().getLayerKey())
          detail.layer = null
        }
      })
    })

    // console.log(mapWrap.value?.getUitMap().getMap()?.getLayers().getArray())
  }

  async function updateYear(year) {
    layerVisible.value = false

    state.activeYear = findSelect()!.years?.find((detail) => detail.id === year)
    await callChangeYear()

    layerVisible.value = true
  }

  const years = computed(() => {
    return findSelect()?.years || []
  })

  const layerVisible = computed({
    get() {
      return getSelectDetail()?.layerVisible ?? false
    },
    set(visible) {
      getSelectDetail()!.layerVisible = visible
      getSelectDetail()?.layer?.setUserVisible(visible)
      return visible
    },
  })

  function clear() {
    overview.value = null
    state.activeZoneId = undefined
    const selectDetail = getSelectDetail()
    if (selectDetail) selectDetail.tableData = []
  }

  return {
    overview,
    setOverview,
    state,
    init,
    years,
    mapWrap: computed(() => mapWrap),
    // zoneVectorLayer: computed(() => zoneVectorLayer),
    findSelect,
    getSelectDetail,
    layerVisible,
    setActiveCategory,
    callSelectZone,
    callChangeYear,
    updateYear,
    clear,
  }
})

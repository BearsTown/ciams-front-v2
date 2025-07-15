import { computed, markRaw, reactive, ref } from 'vue'
import { defineStore } from 'pinia'

import Feature from 'ol/Feature'
import { GeoJSON, WFS } from 'ol/format'
import VectorSource from 'ol/source/Vector'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { intersects, like as likeFilter } from 'ol/format/filter'

import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'
import { urlWithParams } from '@uitgis/ol-ugis-test/util'
import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
import UitWMSLayer from '@uitgis/ol-ugis-test/layer/uitWMSLayer'

import { dataUtil } from '@/utils'
import CommonUtil from '@/utils/commonUtil'
import { MapLayer } from '@/js/layer'
import { MapType } from '@/enums/mapEnum'
import { MapWrapper } from '@/js/mapWrapper'
import { Attribute, Item } from '@/utils/data.types'
import { API_INFO_MAPSTUDIO } from '@/config/config'
import { useBoolean, UseBoolean } from '@/hooks/useBoolean'

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
  activeDistId?: string
  activeDistFeature?: Feature
}

const mapType: MapType = 'Map-1-2-4'

export const useMenu1_2_4Store = defineStore('menu1-2-4Store', () => {
  const state: State = reactive({
    categories: ref([]),
    attributes: ref([]),
  })

  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)

  const columns = ref<any>([])
  let distVectorLayer: UitWFSLayer = null

  async function fetchAttributes() {
    const activeCategory = state.activeCategory
    if (CommonUtil.isEmpty(activeCategory)) return false

    // const data = await test_getAttributes(activeCategory!.id)

    const { data } = await getDataConfig(activeCategory!.id)

    state.attributes = data.attributes as Attribute[]

    activeCategory!.years = data.years.map((year) => ({
      ...year,
      id: year.year,
      title: `${year.year}년`,
    }))

    columns.value = data.columns
    // columns.value = await test_getMenu1_2_3Data(state.activeCategory!.id)
  }

  async function fetchCategories(id: number) {
    // const rawCategories = await test_getMenu1_2_3(id)
    const { data: rawCategories } = await getDataGroups(id)

    state.categories = rawCategories.map((category) => ({
      ...category,
      active: useBoolean(false),
    }))
  }

  async function init(id: number) {
    mapWrap.value = await mapStore.getMapInstance()

    distVectorLayer = new UitWFSLayer({
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
          // color: '#4D7D99',
          color: '#FF0000',
          width: 4,
        }),
        zIndex: 100,
      }),
    })

    const targetLayer = new MapLayer({
      layer: distVectorLayer,
      userVisible: true,
    })

    mapWrap.value?.getUitMap().addWFSLayer(targetLayer.getLayer() as UitWFSLayer)

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

  function setSelectDist(id: string) {
    state.activeDistId = id
  }

  function setSelectDistFeature(fe: Feature) {
    state.activeDistFeature = fe
  }

  async function callSelectDist(distNo: string) {
    await loadDistFeatures(distNo)

    console.log(`선택 사업체현황 분류 :: ${findSelect()?.name}`)
    console.log(`선택 년도 :: ${state.activeYear}`)
    console.log(`선택 대상지 :: ${state.activeDistId}`)
    console.log('사업체분류(전체) feature 삭제')
    console.log(`데이터 API 호출`)

    resetYearData()

    await callChangeYear()
  }

  async function callChangeYear() {
    console.log(`년도 변경 이벤트`)
    console.log(`선택 사업체현황 분류 :: ${findSelect()?.name}`)
    console.log(`선택 년도 :: ${state.activeYear}`)
    console.log(`선택 대상지 :: ${state.activeDistId}`)
    console.log(`데이터 API 호출`)

    const selectDetail = getSelectDetail()

    // if (selectDetail && state.activeYear && state.activeDistId) {
    if (selectDetail && state.activeYear) {
      if (CommonUtil.isEmpty(selectDetail?.layer)) {
        const cYears = findSelect()!.years
        const index = cYears.findIndex((detail) => detail.id === state.activeYear?.id)

        // const vectorLayer = new UitWFSLayer({
        //   layerType: 'vector',
        //   source: new VectorSource(),
        //   visible: true,
        //   zIndex: 2222 + index,
        //   properties: {
        //     visibleIgnore: true,
        //   },
        //   style: dynamicStyle,
        // })
        //
        // selectDetail!.layer = markRaw<MapLayer>(
        //   new MapLayer({
        //     layer: vectorLayer,
        //     userVisible: true,
        //   }),
        // )

        // mapWrap.value?.getUitMap().addWFSLayer(vectorLayer)

        const uWmsLayer = new UitUWMSLayer({
          baseUrl: API_INFO_MAPSTUDIO.PREFIX,
          sourceParams: {
            KEY: 'system',
            LAYERS: [state.activeYear!.layerName!],
            STYLES: `system:${state.activeYear!.style!}`,
          },
          crossOrigin: 'Anonymous',
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
      }

      await loadIndustryFeatures()

      const fLayer = selectDetail?.layer?.getLayer() as UitWFSLayer
      // if (fLayer) {
      if (state.activeDistId && fLayer) {
        selectDetail.tableData = dataUtil.processData({
          // features: fLayer.getSource().getFeatures(),
          features: selectDetail?.features,
          columns: columns.value,
          rows: state.attributes,
          groupName: state.activeCategory?.groupColumn,
          useNoneColumn: state.activeCategory?.useNoneColumn,
        })

        selectDetail.chartData = dataUtil.processChartData({
          axis: state.activeCategory?.chartAxis,
          attributes: state.attributes,
          tableData: selectDetail.tableData,
        })
      }
    }
  }

  async function loadDistFeatures(distNo: string) {
    const featureRequestProps: any = {
      layers: 'CIAMS_DIST',
      srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
    }

    if (!CommonUtil.isEmpty(distNo)) {
      featureRequestProps.filter = likeFilter('dist_no', distNo)
    }

    const res = await fetchFeatures({
      url: API_INFO_MAPSTUDIO.PREFIX,
      key: '585C994F-2629-20C9-3EB8-619B3547E42F',
      featureRequestProps,
    })

    let text = await res.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    distVectorLayer.clear()
    distVectorLayer.addFeatures(features)

    mapWrap.value?.getUitMap().getView().fit(distVectorLayer.getSource().getExtent(), {
      // padding: [200, 100, 200, 100],
    })

    if (!CommonUtil.isEmpty(features) && !CommonUtil.isEmpty(distNo)) {
      setSelectDist(features[0].getProperties()['DIST_NO'])
      setSelectDistFeature(features[0])
    } else {
      setSelectDist('ALL')
      setSelectDistFeature(undefined)
    }
  }

  async function loadIndustryFeatures() {
    const projectionCode = mapWrap.value?.getUitMap().getView().getProjection().getCode()

    const filterCondition = !CommonUtil.isEmpty(state.activeDistFeature)
      ? intersects('SHAPE', state.activeDistFeature!.getGeometry()!, projectionCode)
      : undefined

    const wfsOptions: any = {
      srsName: projectionCode,
      featureNS: 'http://www.opengis.net/wfs',
      featurePrefix: 'feature',
      outputFormat: 'application/json',
      featureTypes: [state.activeYear!.layerName!],
    }

    if (filterCondition) {
      wfsOptions.filter = filterCondition
    }

    const points = await fetch(
      urlWithParams(API_INFO_MAPSTUDIO.PREFIX + '/uwfs', {
        KEY: 'system',
      }),
      {
        method: 'POST',
        body: new XMLSerializer().serializeToString(new WFS().writeGetFeature(wfsOptions)),
      },
    )

    let text = await points.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    // const fLayer = getSelectDetail()?.layer?.getLayer() as UitWFSLayer
    // if (fLayer) {
    //   fLayer.clear()
    //   fLayer.addFeatures(features)
    //
    //   // getSelectDetail()!.features = markRaw(features)
    // }

    if (features) {
      getSelectDetail()!.features = markRaw(features)
    }
  }

  // 년도별 상세 데이터 초기화
  function resetYearData() {
    console.log('년도별 상세 데이터 초기화')
    state.categories.forEach((category) => {
      category.years?.forEach((detail) => {
        // detail.features = []
        detail.tableData = []
        detail.chartData = {}
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

  // 스타일 함수 정의
  const dynamicStyle = function (feature) {
    if (CommonUtil.isEmpty(columns.value)) return false

    return new Style({
      image: new Circle({
        radius: 4,
        stroke: new Stroke({
          color: feature.get('color'),
        }),
        fill: new Fill({
          color: feature.get('color'),
        }),
      }),
    })
  }

  return {
    state,
    init,
    years,
    mapWrap: computed(() => mapWrap),
    distVectorLayer: computed(() => distVectorLayer),
    findSelect,
    getSelectDetail,
    layerVisible,
    setActiveCategory,
    callSelectDist,
    callChangeYear,
    updateYear,
  }
})

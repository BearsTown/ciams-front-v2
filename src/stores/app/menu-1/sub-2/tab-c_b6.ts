import { computed, markRaw, reactive, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'

import { useBoolean, UseBoolean } from '@/hooks/useBoolean'
import { Attribute, Item } from '@/utils/data.types'
import {
  test_getAttributes,
  test_getMenu1_2_3,
  test_getMenu1_2_3Data,
} from '@/api/app/menu-1/sub-2/tab-c'
import commonUtil from '@/utils/commonUtil'
import { MapLayer } from '@/js/layer'
import { dataUtil } from '@/utils'
import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'
import VectorSource from 'ol/source/Vector'
import { MapType } from '@/enums/mapEnum'
import { MapWrapper } from '@/js/mapWrapper'
import { useMapStore } from '@/stores/map/map'
import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
import { intersects, like as likeFilter } from 'ol/format/filter'
import { GeoJSON, WFS } from 'ol/format'
import Feature from 'ol/Feature'
import { urlWithParams } from '@uitgis/ol-ugis-test/util'
import { Stroke, Style } from 'ol/style.js'

interface Category {
  id: string
  title: string
  years: YearDetail[]
  priority: number
  active: UseBoolean
}

interface YearDetail {
  id: string
  title: string
  layerVisible: boolean
  layer: MapLayer | null
  features: []
  tableData: Item[]
  chartData: []
}

interface State {
  categories: Category[]
  attributes: Attribute[]

  mapWrap?: MapWrapper
  activeCategoryId?: string
  activeYear?: string
  activeDistId?: string
  activeDistFeature?: Feature
}

const mapType: MapType = 'Map-1-2-3'
const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

export const useMenu1_2_3Store = defineStore('useMenu1-2-3Store', () => {
  const state2 = {
    categories: shallowRef<Category[]>([]),
    attributes: reactive<Attribute[]>([]),
  }

  const state: State = reactive({
    categories: ref([]),
    attributes: ref([]),
  })

  // let rawCategories: Category[] = []
  // const rawCategories = shallowRef<Category[]>([])

  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(mapType)

  let distVectorLayer: UitWFSLayer = null

  async function fetchAttributes() {
    const rawAttributes: Attribute[] = await test_getAttributes()
    state.attributes = rawAttributes

    // state.categories.value = rawCategories.map((category) => ({
    //   ...category,
    //   active: useBoolean(false),
    //   years: category.years.map((year) => ({
    //     year: year.id,
    //     title: `${year}년`,
    //   })),
    // }))
  }

  async function fetchCategories() {
    const rawCategories = await test_getMenu1_2_3()

    state.categories = rawCategories.map((category) => ({
      ...category,
      active: useBoolean(false),
      years: category.years.map((year) => ({
        id: year,
        year: year,
        title: `${year}년`,
      })),
    }))
  }

  async function init() {
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
          color: '#4D7D99',
          width: 3,
        }),
        zIndex: 100,
      }),
    })

    const targetLayer = new MapLayer({
      layer: distVectorLayer,
      userVisible: true,
    })

    mapWrap.value?.getUitMap().addWFSLayer(targetLayer.getLayer() as UitWFSLayer)

    await fetchAttributes()
    await fetchCategories()
  }

  function getSelectDetail() {
    const select = findSelect()
    if (select) {
      return select.years.find((detail) => detail.id === state.activeYear)
    }
  }

  function findSelect() {
    if (!commonUtil.isEmpty(state.categories)) {
      return state.categories.find((category) => category.active.status)
    } else {
      return undefined
    }
  }

  async function setActiveCategory(categoryId: string) {
    if (commonUtil.isEmpty(state.categories)) return false

    const categoryExists = state.categories.some((category) => category.id === categoryId)
    if (!categoryExists) {
      console.warn(`Item with id ${categoryId} not found`)
      state.activeCategoryId = ''
      return
    }

    if (state.activeCategoryId === categoryId) {
      state.activeCategoryId = ''
      // resetYearData()
      return
    }

    state.activeCategoryId = categoryId
    state.categories.forEach((category) => {
      if (category.id === categoryId) {
        category.active.on()
      } else {
        category.active.off()
        // resetYearData()
      }
    })

    console.log('최근년도로 설정 및 년도 변경 이벤트 트리거')
    const cYears = findSelect()!.years
    state.activeYear = cYears[cYears.length - 1]?.id

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

    console.log(`선택 사업체현황 분류 :: ${findSelect()?.title}`)
    console.log(`선택 년도 :: ${state.activeYear}`)
    console.log(`선택 대상지 :: ${state.activeDistId}`)
    console.log('사업체분류(전체) feature 삭제')
    console.log(`데이터 API 호출`)

    resetYearData()

    await callChangeYear()

    // await loadIndustryFeatures()

    // 사업체분류(전체) 레이어 있으면 feature 삭제
    // state.categories.forEach((category) => {
    //   category.years.forEach((year) => {
    //     console.log(year)
    //   })
    // })
  }

  async function callChangeYear() {
    console.log(`년도 변경 이벤트`)
    console.log(`선택 사업체현황 분류 :: ${findSelect()?.title}`)
    console.log(`선택 년도 :: ${state.activeYear}`)
    console.log(`선택 대상지 :: ${state.activeDistId}`)
    console.log(`데이터 API 호출`)

    console.log(getSelectDetail()!.tableData)

    const selectDetail = getSelectDetail()

    if (state.activeYear && state.activeDistId) {
      const data = await test_getMenu1_2_3Data()

      selectDetail!.tableData = markRaw(
        dataUtil.calculateRatios(data, state.attributes, { round: 1 }),
      )

      if (commonUtil.isEmpty(selectDetail?.layer)) {
        const cYears = findSelect()!.years
        const index = cYears.findIndex((detail) => detail.id === state.activeYear)

        const vectorLayer = new UitWFSLayer({
          layerType: 'vector',
          source: new VectorSource(),
          visible: true,
          zIndex: 2222 + index,
          properties: {
            visibleIgnore: true,
          },
          // style: new Style({
          //   stroke: new Stroke({
          //     color: '#4D7D99',
          //     width: 3,
          //   }),
          //   zIndex: 100,
          // }),
        })

        selectDetail!.layer = markRaw<MapLayer>(
          new MapLayer({
            layer: vectorLayer,
            userVisible: true,
          }),
        )

        mapWrap.value?.getUitMap().addWFSLayer(vectorLayer)
      }

      await loadIndustryFeatures()
    }
  }

  async function loadDistFeatures(distNo: string) {
    const res = await fetchFeatures({
      url: mapStudioUrl,
      key: '585C994F-2629-20C9-3EB8-619B3547E42F',
      featureRequestProps: {
        layers: 'CIAMS_DIST',
        filter: likeFilter('dist_no', distNo),
        srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
      },
    })
    let text = await res.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    distVectorLayer.clear()
    distVectorLayer.addFeatures(features)

    mapWrap.value
      ?.getUitMap()
      .getView()
      .fit(distVectorLayer.getSource().getExtent(), {
        padding: [200, 100, 200, 100],
      })

    if (!commonUtil.isEmpty(features)) {
      setSelectDist(features[0].getProperties()['DIST_NO'])
      setSelectDistFeature(features[0])
    }
  }

  async function loadIndustryFeatures() {
    if (commonUtil.isEmpty(state.activeDistFeature)) return false

    const points = await fetch(
      urlWithParams(mapStudioUrl + '/uwfs', {
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
            featureTypes: [`CIAMS_INDUSTRY_${state.activeYear}`],
            filter: intersects(
              'SHAPE',
              state.activeDistFeature!.getGeometry()!,
              mapWrap.value?.getUitMap().getView().getProjection().getCode(),
            ),
          }),
        ),
      },
    )

    let text = await points.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    const fLayer = getSelectDetail()?.layer?.getLayer() as UitWFSLayer
    fLayer.clear()
    fLayer.addFeatures(features)
  }

  // 년도별 상세 데이터 초기화
  function resetYearData() {
    console.log('년도별 상세 데이터 초기화')
    state.categories.forEach((category) => {
      category.years.forEach((detail) => {
        detail.features = []
        detail.tableData = []
        detail.chartData = []
        detail.layerVisible = true

        if (detail.layer) {
          mapWrap.value?.getUitMap().removeLayer(detail.layer.getLayer().getLayerKey())
          detail.layer = null
        }
      })
    })

    console.log(mapWrap.value?.getUitMap().getMap()?.getLayers().getArray())
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

  return {
    // ...toRefs(state),

    state,

    init,

    years,

    mapWrap: computed(() => mapWrap),

    distVectorLayer: computed(() => distVectorLayer),

    findSelect,
    getSelectDetail,
    layerVisible,
    setActiveCategory,
    // setSelectDist,

    callSelectDist,
    callChangeYear,

    // loadDistFeatures,
  }
})

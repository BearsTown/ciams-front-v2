import { computed, reactive } from 'vue'
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
import { fetchFeatures } from '@uitgis/ol-ugis-test/api/feature'
import { like as likeFilter } from 'ol/format/filter'
import { GeoJSON } from 'ol/format'
import Feature from 'ol/Feature'

interface Menu1_2_3 {
  categories: Category[]
  attributes: Attribute[]
  activeCategoryId?: string
  activeDistId?: string
  activeYear?: string
}

interface Category {
  id: string
  title: string
  years: Detail[]
  priority: number
  active: UseBoolean
}

interface Detail {
  id: string
  title: string
  layerVisible: boolean
  layer: MapLayer
  features: []
  tableData: Item[]
  chartData: []
}

export const useMenu1_2_3Store = defineStore('useMenu1-2-3Store', () => {
  const state = reactive<Menu1_2_3>({
    categories: [],
    attributes: [],
  })

  // let targetFeature: Feature

  const mapLayers: MapLayer[] = []

  async function init() {
    const categories = await test_getMenu1_2_3()

    categories.forEach((category) => {
      const c = {
        ...category,
        years: category.years.map((year) => ({
          id: year,
          title: `${year}년`,
          layerVisible: true,
          // active: useBoolean(false),
        })),
        active: useBoolean(false),
      }

      state.categories.push(c)
    })

    // state.value.categories = categories

    state.attributes = await test_getAttributes()

    // state.value.categories[0].active.on()
  }

  function getSelectDetail() {
    const select = findSelect()
    if (select) {
      return select.years.find((detail) => detail.id === state.activeYear)
    }
  }

  function findSelect() {
    if (!commonUtil.isEmpty(state.categories)) {
      return state.categories.find((category) => category.active.status === true)
    } else {
      return undefined
    }
    // if (
    //   !commonUtil.isEmpty(state.value.selectYear) &&
    //   state.value.categories[state.value.selectYear!]
    // ) {
    //   return state.value.categories.find((detail) => detail.id === state.value.)
    // } else {
    //   return {}
    // }
  }

  async function setActiveCategory(categoryId: string) {
    const categoryExists = state.categories.some((category) => category.id === categoryId)
    if (!categoryExists) {
      console.warn(`Item with id ${categoryId} not found`)
      state.activeCategoryId = ''
      return
    }

    if (state.activeCategoryId === categoryId) {
      state.activeCategoryId = ''
      resetYearData()
      return
    }

    state.activeCategoryId = categoryId
    state.categories.forEach((category) => {
      if (category.id === categoryId) {
        category.active.on()
      } else {
        category.active.off()
        resetYearData()
      }
    })

    console.log('최근년도로 설정 및 년도 변경 이벤트 트리거')
    const cYears = findSelect()!.years
    state.activeYear = cYears[cYears.length - 1]?.id

    await callChangeYear()
  }

  function setSelectDist(id: string) {
    state.activeDistId = id
  }

  function callSelectDist() {
    console.log('사업체분류(전체) feature 삭제')

    // 사업체분류(전체) 레이어 있으면 feature 삭제
    state.categories.forEach((category) => {
      category.years.forEach((year) => {
        console.log(year)
      })
    })
  }

  async function callChangeYear() {
    console.log(`년도 변경 이벤트`)
    console.log(`선택 사업체현황 분류 :: ${findSelect()?.title}`)
    console.log(`선택 년도 :: ${state.activeYear}`)
    console.log(`선택 대상지 :: ${state.activeDistId}`)

    console.log(`데이터 API 호출`)

    console.log(getSelectDetail()!.tableData)

    const data = await test_getMenu1_2_3Data()

    getSelectDetail()!.tableData = dataUtil.calculateRatios(data, state.attributes, { round: 1 })
  }

  async function loadFeatures() {
    const res = await fetchFeatures({
      url: import.meta.env.VITE_API_MAPSTUDIO_URL,
      key: '585C994F-2629-20C9-3EB8-619B3547E42F',
      featureRequestProps: {
        layers: 'CIAMS_DIST',
        filter: likeFilter('dist_no', item.distNo),
        srsName: mapWrap.value?.getUitMap().getView().getProjection().getCode(),
      },
    })
    let text = await res.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]
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
      })
    })
  }

  const years = computed(() => {
    return findSelect()?.years
  })

  const layerVisible = computed(() => {
    return getSelectDetail()?.layerVisible
  })

  return {
    // ...toRefs(state),

    state,

    init,

    years,

    findSelect,
    getSelectDetail,
    layerVisible,
    setActiveCategory,
    setSelectDist,

    callSelectDist,
    callChangeYear,
  }
})

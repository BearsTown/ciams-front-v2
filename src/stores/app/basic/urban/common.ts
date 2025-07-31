import { computed, markRaw, reactive, Ref, ref } from 'vue'
import { defineStore } from 'pinia'

import Feature from 'ol/Feature'
import { GeoJSON, WFS } from 'ol/format'
import VectorSource from 'ol/source/Vector'
import { Stroke, Style } from 'ol/style'
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
import { API_INFO_MAPSTUDIO } from '@/config/config'
import { useBoolean } from '@/hooks/useBoolean'

import { Category, State, YearDetail } from '@/models/services/app/basic/urban/data'

import { getDataGroups, getMetaData } from '@/api/app/basic/urban/data'

import UitUWMSLayer from '@/stores/map/uwmsLayer'
import { useMapStore } from '@/stores/map/map'
import { CiamsDataColumn } from '@/models/api/app/basic/urban'

const storeInstances = new Map<
  MapType,
  {
    state: State
    mapWrap: Ref<MapWrapper | undefined>
    columns: Ref<CiamsDataColumn[]>
    distVectorLayer: Ref<UitWFSLayer | null>
  }
>()

export const useBasicUrbanInstanceStore = (mapType: MapType) => {
  return defineStore(`basicUrbanInstanceStore-${mapType}`, () => {
    if (!storeInstances.has(mapType)) {
      storeInstances.set(mapType, {
        state: reactive<State>({
          categories: [],
          attributes: [],
        }),
        mapWrap: ref<MapWrapper>(),
        columns: ref<CiamsDataColumn[]>([]),
        distVectorLayer: ref<UitWFSLayer | null>(null),
      })
    }

    const { state, mapWrap, columns, distVectorLayer } = storeInstances.get(mapType)!
    const mapStore = useMapStore(mapType) // 동적 mapType 사용

    async function fetchAttributes() {
      const activeCategory = state.activeCategory
      if (CommonUtil.isEmpty(activeCategory)) return false

      const { data } = await getMetaData(activeCategory!.id)

      state.attributes = data.attributes

      activeCategory!.years = data.years.map(
        (year): YearDetail => ({
          ...year,
          id: year.year,
          title: `${year.year}년`,
          layer: null,
          layerVisible: false,
          features: [],
          tableData: [],
          chartData: {},
        }),
      )

      columns.value = data.columns
      return true
    }

    async function fetchCategories(id: number) {
      const { data: rawCategories } = await getDataGroups(id)

      state.categories = rawCategories.map(
        (category): Category => ({
          ...category,
          years: [],
          active: useBoolean(false),
        }),
      )
    }

    async function init(id: number) {
      mapWrap.value = await mapStore.getMapInstance()

      distVectorLayer.value = new UitWFSLayer({
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
            color: '#FF0000',
            width: 4,
          }),
          zIndex: 100,
        }),
      })

      const targetLayer = new MapLayer({
        layer: distVectorLayer.value,
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
      }
      return undefined
    }

    async function setActiveCategory(categoryId: number) {
      if (CommonUtil.isEmpty(state.categories)) return false

      state.attributes = []

      const categoryExists = state.categories.some((category) => category.id === categoryId)
      if (!categoryExists) {
        console.warn(`Item with id ${categoryId} not found`)
        return false
      }

      if (state.activeCategory?.id === categoryId) {
        state.activeCategory = undefined
        resetYearData()
        return false
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

      const cYears = findSelect()!.years
      state.activeYear = cYears[cYears.length - 1]

      resetYearData()
      await callChangeYear()
      return true
    }

    function setSelectDist(id: string) {
      state.activeDistId = id
    }

    function setSelectDistFeature(fe: Feature | undefined) {
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

      if (selectDetail && state.activeYear) {
        if (CommonUtil.isEmpty(selectDetail?.layer)) {
          const cYears = findSelect()!.years
          const index = cYears.findIndex((detail) => detail.id === state.activeYear?.id)

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
        if (state.activeDistId && fLayer) {
          selectDetail.tableData = dataUtil.processData({
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
      text = text.replace(/\n/gi, '\\r\\n')
      const features = new GeoJSON().readFeatures(text) as Feature[]

      distVectorLayer.value?.clear()
      distVectorLayer.value?.addFeatures(features)

      mapWrap.value?.getUitMap().getView().fit(distVectorLayer.value!.getSource().getExtent(), {})

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
      text = text.replace(/\n/gi, '\\r\\n')
      const features = new GeoJSON().readFeatures(text) as Feature[]

      if (features) {
        getSelectDetail()!.features = markRaw(features)
      }
    }

    function resetYearData() {
      console.log('년도별 상세 데이터 초기화')
      state.categories.forEach((category) => {
        category.years?.forEach((detail) => {
          detail.tableData = []
          detail.chartData = {}
          detail.layerVisible = true

          if (detail.layer) {
            mapWrap.value?.getUitMap().removeLayer(detail.layer.getLayer().getLayerKey())
            detail.layer = null
          }
        })
      })
    }

    async function updateYear(year: number) {
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
        const detail = getSelectDetail()
        if (detail) {
          detail.layerVisible = visible
          detail.layer?.setUserVisible(visible)
        }
        return visible
      },
    })

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
  })()
}

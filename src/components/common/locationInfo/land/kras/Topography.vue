<template>
  <div style="width: 100%; height: 100%">
    <div v-if="!isView" style="display: flex; height: 100%">
      <Empty title="해당 위치는 조회 대상에 해당되지 않습니다." style="flex: 1" />
    </div>

    <div
      v-else
      class="locationInfo-content geographic"
      style="display: flex; flex-direction: column; height: 100%"
    >
      <ul class="customTab top">
        <li class="customTab-item" @click="inspectionClick" :class="{ active: inspection }">
          경사분석
        </li>
        <li class="customTab-item" @click="elevationClick" :class="{ active: elevation }">
          표고분석
        </li>
      </ul>

      <div class="container">
        <div class="customCard" style="height: 100%">
          <div class="card-title">
            <span>면적 : {{ commonUtil.comma(featureArea(searchAddressFeature)) }}㎡</span>
            <span>5m x 5m</span>
          </div>
          <table class="customTable">
            <colgroup>
              <col width="22%" />
              <col width="24%" />
              <col width="26%" />
              <col width="28%" />
            </colgroup>
            <tbody>
              <tr>
                <th>{{ menuType === 'SLOPE' ? '평균경사' : '평균고도' }}</th>
                <td>{{ info.average }}{{ info.unit }}</td>
                <th>{{ menuType === 'SLOPE' ? '급경사지(25°이상)' : '표고차' }}</th>
                <td>
                  {{ menuType === 'SLOPE' ? info.percent : info.diffCnt
                  }}{{ menuType === 'SLOPE' ? '%' : 'm' }}
                </td>
              </tr>
              <tr>
                <th>최소</th>
                <td>{{ info.min }}{{ info.unit }}</td>
                <th>최대</th>
                <td>{{ info.max }}{{ info.unit }}</td>
              </tr>
            </tbody>
          </table>

          <div
            class="chart"
            style="display: flex; flex-direction: column; height: auto; background-color: white"
          >
            <VueEchart
              ref="chartRef"
              position="RIGHT"
              view-type="CHART"
              :option="chartOptions"
              :height="230"
              @handle-click="handleChartClick"
            />
            <div style="font-weight: bold; font-size: 14px; text-align: center; padding: 10px 0">
              {{ info.chartTitle }}
            </div>
          </div>

          <div class="color-box">
            <div
              class="color-select customSelect"
              style="width: 383px; min-width: 383px"
              :class="{ active: selectActive }"
            >
              <div class="customSelect-label" @click="selectActive = !selectActive">
                <span class="customSelect-value">
                  <!-- <img src="@/assets/img/ex_colorchip01.png" alt="" /> -->
                  <div class="el-row" style="height: 20px; width: 100%">
                    <div
                      class="el-col el-col-4"
                      v-for="color in colorArr"
                      :key="color"
                      :style="{ 'background-color': color }"
                    ></div>
                  </div>
                </span>
                <span class="customSelect-arrow">
                  <svg
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 5L5.5 1L10 5"
                      stroke="#98A8BA"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </div>
              <div class="customSelect-dropdown">
                <ul class="customScroll scrollY">
                  <li class="customSelect-item" v-for="itemArr in colorArrEx" :key="itemArr">
                    <div
                      class="el-row"
                      style="height: 20px; width: 100%"
                      @click="clickColorItem(itemArr)"
                    >
                      <div
                        class="el-col el-col-4"
                        v-for="color in itemArr"
                        :key="color"
                        :style="{ 'background-color': color }"
                      ></div>
                    </div>
                  </li>
                  <!-- <li class="customSelect-item">
                    <img src="@/assets/img/ex_colorchip02.png" alt="" />
                  </li> -->
                </ul>
              </div>
            </div>
            <div class="btn-group" style="width: calc(100% - 383px)">
              <button type="button" style="width: 68px" class="btn-color" @click="reverseCall">
                뒤집기
              </button>
              <button
                type="button"
                style="width: 88px; cursor: auto; margin-left: 10px; background: #7AAAD1"
                class="btn-color"
              >
                <input
                  :checked="showModel"
                  @click="toggleShowModel"
                  style="margin-right: 5px"
                  type="checkbox"
                />
                도형
              </button>
            </div>
          </div>
          <div class="slider-wrap">
            <span class="slider-label">투명도: </span>
            <span class="slider-num">{{ opacityMarks.min }}%</span>
            <Vue3Slider
              v-model="tempOpacity"
              :handleScale="1"
              :tooltip="true"
              :alwaysShowHandle="true"
              :max="opacityMarks.max"
              color="#44619b"
              track-color="#98A8BA"
              tooltipText="%v%"
              tooltipColor="#fff"
              tooltipTextColor="#44619b"
              @change="setOpacity"
            />
            <span class="slider-num" style="text-align: right">{{ opacityMarks.max }}%</span>
            <!-- <button type="button" class="btn-tool" @click="setOpacity">적용</button> -->
          </div>
          <div class="three-dimension-container">
            <button type="button" class="btn-color" @click="map3DModalBtn">
              <SvgIcon name="full-screen" />
            </button>
            <iframe ref="childFrame" id="iframe3d" :src="v3durl" title="3d"></iframe>
          </div>

          <!-- <div class="btn-wrap popup" :class="{ active: showOpacity }">
            <div class="dropdown bgMap">
              <div class="dropdown-header">
                격자 레이어 투명도 설정
                <button type="button" class="btn-close" @click="closeOpacityPop">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M13.5 4.5L4.5 13.5M13.5 13.5L4.5 4.5"
                      stroke="#212121"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              </div>
              <div class="slider-wrap">
                <span class="slider-num">{{ opacityMarks.min }}%</span>
                <Vue3Slider
                  v-model="tempOpacity"
                  :handleScale="1"
                  :tooltip="true"
                  :alwaysShowHandle="true"
                  :max="opacityMarks.max"
                  color="#44619b"
                  track-color="#98A8BA"
                  tooltipText="%v%"
                  tooltipColor="#fff"
                  tooltipTextColor="#44619b"
                />
                <span class="slider-num" style="text-align: right">{{ opacityMarks.max }}%</span>
              </div>
              <button type="button" class="btn-tool" @click="setOpacity">적용</button>
            </div>
          </div> -->

          <div v-if="tableVisible" style="display: flex; flex-direction: column; height: 100%">
            <table class="customTable">
              <colgroup>
                <col width="10%" />
                <col width="35%" />
                <col width="35%" />
                <col width="20%" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col" style="text-align: center"></th>
                  <th scope="col" style="text-align: center">X</th>
                  <th scope="col" style="text-align: center">Y</th>
                  <th scope="col" style="text-align: center">경사</th>
                </tr>
              </thead>
            </table>

            <!-- 데이터 없을때 -->
            <div v-if="commonUtil.isEmpty(tableData)" class="no-data table">
              데이터가 존재하지 않습니다.
            </div>

            <!-- 데이터 있을때 -->
            <el-scrollbar v-if="!commonUtil.isEmpty(tableData)" style="max-height: 203px">
              <!-- <div
              class="container customScroll"
              v-if="!commonUtil.isEmpty(tableData)"
              style="max-height: 203px"
            > -->
              <table class="customTable body">
                <colgroup>
                  <col width="10%" />
                  <col width="35%" />
                  <col width="35%" />
                  <col width="20%" />
                </colgroup>
                <tbody>
                  <tr
                    v-for="(item, index) in tableData"
                    :key="index"
                    @click="handleTableClick(item)"
                    style="cursor: pointer"
                    :class="item.idx == selectedTableIdx ? 'seleted' : ''"
                  >
                    <td style="text-align: center">{{ index + 1 }}</td>
                    <td style="text-align: center">{{ item.x }}</td>
                    <td style="text-align: center">{{ item.y }}</td>
                    <td style="text-align: center">{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </el-scrollbar>
            <!-- </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import chartUtil from '@/utils/chartUtil'
  import { onActivated, onBeforeMount, onDeactivated, onMounted, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import commonUtil from '@/utils/commonUtil'
  import { mapApi } from '@/api/map/mapService'
  import { transform, transformExtent } from 'ol/proj'
  import mapUtil from '@/utils/mapUtil'
  import _mapUtil from '@/js/map/map'
  import Map from '@/js/map/map'
  import { getCenter } from 'ol/extent'
  import { WKT } from 'ol/format'
  // import { useGmpssStore } from '@/stores/app'
  import { cloneDeep } from 'lodash-es'
  import VueEchart from '@/components/chart/VueEchart.vue'
  import { useMapStore } from '@/stores/map/map'
  // import { useMapConfig } from '@/stores/map/mapConfig'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { LayerType, MapType } from '@/enums/mapEnum'
  import VectorLayer from 'ol/layer/Vector'
  import VectorSource from 'ol/source/Vector'
  import SvgIcon from '@/components/common/SvgIcon.vue'
  import { getArea } from 'ol/sphere'
  import { Feature } from 'ol'
  import { MapWrapper } from '@/js/mapWrapper'
  import { wfsVectorStyle } from '@/js/map/mapStyle'

  // const gmpStore = useGmpssStore()
  const cmmConfigStore = useCmmConfigStore()

  const childFrame = ref<HTMLIFrameElement>()
  const showModel = ref(true)

  const props = withDefaults(
    defineProps<{
      mapType: MapType
      tabCategory: string
    }>(),
    {},
  )

  const mapWrap = ref<MapWrapper>()
  const mapStore = useMapStore(props.mapType)
  const { searchAddress, searchAddressFeature } = storeToRefs(mapStore)

  const isActive = ref<boolean>(false)
  const menuType = ref('SLOPE')
  const tableData = ref([])
  const featureTurfData = ref([])
  const featureData = ref<any[]>([])
  const loading = ref(false)
  const isMapMoveBtn = ref(false)
  const chartFilter = ref([])
  // const limitWtkLength = 6500
  const limitWtkLength = 6500
  const isView = ref(false)
  const selectedTableIdx = ref(-1)
  const tableVisible = ref(false)

  const chartRef = ref()
  const info = ref({
    average: 0,
    percent: 0,
    min: 0,
    max: 0,
    diffCnt: 0,
    chartTitle: '',
    chartData: [],
    tableData: [],
    featureData: [],
    unit: '˚',
  })
  const isColorReverse = ref(false)
  const colorArr = ref(['#fffba4', '#ffea7b', '#ffe141', '#ffca41', '#fd8c3b', '#fc4e2b'])
  const colorArrEx = ref([
    ['#fffba4', '#ffea7b', '#ffe141', '#ffca41', '#fd8c3b', '#fc4e2b'],
    ['#f6f4f9', '#e7e0ef', '#d3b9da', '#c994c7', '#df65b0', '#e7298a'],
  ])
  const chartOptions = ref({})
  const opacity = ref(0)
  const tempOpacity = ref(0)
  const opacityMarks = ref({
    min: 0,
    max: 100,
  })

  const showOpacity = ref(false)
  const closeOpacityPop = () => {
    showOpacity.value = false
    tempOpacity.value = opacity.value
  }

  const toggleShowModel = () => {
    // const currentMap = Map.getCurrentMapFromMapStore()
    const currentMap = mapWrap.value?.getUitMap().getMap()
    if (currentMap) {
      const wfsLayer = Map.getLayerById(currentMap, LayerType.WFSVECTOR)
      wfsLayer?.setVisible(!showModel.value)
      showModel.value = !showModel.value
    }
  }

  const v3durl = ref('')

  /**
   * 투명도 적용
   */
  const setOpacity = () => {
    showOpacity.value = false
    opacity.value = tempOpacity.value
    colorAction(colorArr.value)
  }

  /* 지형정보: 검사분석, 표고분석 탭 */
  const inspection = ref(true)
  const elevation = ref(false)
  /* 지형정보: 셀렉트 */
  const selectActive = ref(false)

  function handleChartClick(event) {
    //chartFilter.value 에 존재하는 label값만 표출
    let labelName = event.name
    let isExist = chartFilter.value.findIndex((a) => a == labelName) > -1
    if (isExist) {
      chartFilter.value = chartFilter.value.filter((a) => a != labelName)
    } else {
      chartFilter.value.push(labelName)
    }

    let exceptIdx = []
    //차트
    info.value.chartData.forEach((a) => {
      if (!chartFilter.value.includes(a.label)) {
        exceptIdx = exceptIdx.concat(a.tableDataArr)
      }
    })
    //예외 idx만 추출
    exceptIdx = exceptIdx.map((a) => a.idx)

    //table
    tableData.value = info.value.tableData.filter((a) => !exceptIdx.includes(a.idx))

    //feature
    featureData.value = info.value.featureData.filter(
      (a) => !exceptIdx.includes(a.getProperties()['idx']),
    )

    makeChart()
    if (isMapMoveBtn.value) {
      mapCall(false)
    }
  }

  function initCall() {
    opacity.value = 0
    tempOpacity.value = 0
    selectedTableIdx.value = -1
    clearMapCall()
    isColorReverse.value = false
    isMapMoveBtn.value = false
    apiCall()
  }

  async function reverseCall() {
    isColorReverse.value = !isColorReverse.value
    // let oldColorArr = cloneDeep(colorArr.value)
    colorArr.value = colorArr.value.reverse()
    colorAction()
  }

  async function clickColorItem(_colorArr) {
    let oldColorArr = cloneDeep(_colorArr)
    // colorArr.value = reColorArr
    selectActive.value = false
    colorArr.value = oldColorArr
    await colorAction()
  }

  async function colorAction() {
    //피쳐 변환용
    // let modColorObj = {}
    // colorArr.value.forEach((a, idx) => {
    //   modColorObj[a] = _oldColorArr[idx]
    // })

    //차트
    info.value.chartData.forEach((a, index) => {
      // let _color = a.color
      // let modifyColor = modColorObj[_color]
      // a.color = modifyColor
      a.color = colorArr.value[index]
    })

    //피쳐
    info.value.featureData.forEach((_feature) => {
      let _colorIdx = _feature.getProperties()['color_idx']
      let modifyColor = colorArr.value[_colorIdx]
      modifyColor = modifyColor + commonUtil.getHexOpacity(1 - opacity.value / 100)
      _feature.set('color', modifyColor)
    })

    let exceptIdx = []
    //차트
    info.value.chartData.forEach((a) => {
      if (!chartFilter.value.includes(a.label)) {
        exceptIdx = exceptIdx.concat(a.tableDataArr.map((a) => a.idx))
      }
    })
    featureData.value = info.value.featureData.filter(
      (a) => !exceptIdx.includes(a.getProperties()['idx']),
    )

    //현재피쳐
    // featureData.value.forEach((_feature) => {
    //   let _color = _feature.getProperties()['color']
    //   let modifyColor = modColorObj[_color]
    //   _feature.set('color', modifyColor)
    // })

    makeChart()
    if (isMapMoveBtn.value) {
      await mapCall(false)
    }
  }

  function mapViewBtn() {
    isMapMoveBtn.value = !isMapMoveBtn.value
    if (isMapMoveBtn.value) {
      mapCall()
    } else {
      clearMapCall()
    }
  }

  function map3DModalBtn() {
    if (featureData.value.length === 0) {
      commonUtil.errorMessage('데이터를 확인해주세요')
      return
    }
    map3DViewBtn()
    // const mapStore = useMapStore()
    // const mapKey = mapStore.getCurrentMapKey()!
    // mapStore.state[mapKey].map3d.isUse = !mapStore.state[mapKey].map3d.isUse

    mapStore.map3d.isUse = !mapStore.map3d.isUse
  }

  function map3DViewBtn() {
    if (featureData.value.length === 0) {
      commonUtil.errorMessage('데이터를 확인해주세요')
      return
    }
    // const mapStore = useMapStore()
    // const mapKey = mapStore.getCurrentMapKey()!
    const array: any[] = []

    featureData.value.forEach((feature: Feature) => {
      const color = feature.getProperties()['color']
      const coordinates = feature.getGeometry().getCoordinates()[0]
      let tempArr: Array<number[]> = []
      coordinates.forEach((coordinate) => {
        const [_x, _y] = transform(coordinate, 'EPSG:3857', 'EPSG:4326')
        tempArr.push([_x, _y])
      })
      array.push({
        color: { ...commonUtil.hex2rgb(color), a: ((100 - tempOpacity.value) * 255) / 100 },
        coordinates: tempArr,
      })
    })
    mapStore.map3d.feature = { data: array }
  }

  /**
   * 지도 화면에 feature데이터 전달
   * @param {*} isExtent
   */
  function mapCall(isExtent = true) {
    isMapMoveBtn.value = true
    Map.addFeatureWithProperty(featureData.value, true, isExtent)
  }

  /**
   * 지도 화면에 feature 데이터 삭제
   */
  function clearMapCall() {
    Map.addFeatureWithProperty([], true, false, mapWrap.value?.getUitMap().getMap())
  }

  /**
   * 차트 생성
   */
  function makeChart() {
    chartOptions.value = chartUtil.makeChartOption('BAR', {
      isHorizontal: false,
      titleName: '',
      filter: chartFilter.value,
      data: info.value.chartData,
    })

    chartRef.value.reloadOption(chartOptions.value)
  }

  /**
   * 피쳐 면적
   */
  function featureArea(feature) {
    Map.addFeatureWithProperty([feature], true, false)
    // const currentMap = Map.getCurrentMapFromMapStore()

    const currentMap = mapWrap.value?.getUitMap().getMap()

    let area = getArea(feature.getGeometry(), {
      projection: currentMap!.getView().getProjection().getCode(),
    })
    return Number(area.toFixed(2))
  }

  /**
   * 테이블 리스트 클릭시 호출
   * @param {*} obj
   */
  function handleTableClick(obj) {
    if (obj == null || !isMapMoveBtn.value) return
    let clickIdx = obj.idx

    featureData.value.forEach((_feature) => {
      let _idx = _feature.getProperties()['idx']
      if (clickIdx == _idx) {
        _feature.set('isClick', true)
      } else {
        _feature.set('isClick', false)
      }
    })

    mapCall(false)

    selectedTableIdx.value = obj.idx
  }

  async function apiCall() {
    let layer = ''
    switch (menuType.value) {
      case 'SLOPE': {
        layer = 'SlopeByRegion.tif'
        info.value.chartTitle = '<경사 분포도>'
        info.value.unit = '˚'
        break
      }
      case 'ALTITUDE': {
        layer = 'AltitudeByRegion.tif'
        info.value.chartTitle = '<표고 분포도>'
        info.value.unit = 'm'
        break
      }
      default: {
        return null
      }
    }

    //현재 지도객체
    // const currentMap = Map.getCurrentMapFromMapStore()

    const currentMap = mapWrap.value?.getUitMap().getMap()

    let _searchAddressFeature = mapUtil.transformFeature(
      searchAddressFeature.value,
      currentMap!.getView().getProjection().getCode(),
      'EPSG:5186',
    )

    const wktGeomety = new WKT().writeGeometry(_searchAddressFeature.getGeometry())

    if (wktGeomety.length > limitWtkLength) {
      commonUtil.errorMessage('해당 위치의 버텍스 개수가 초과되어 조회 대상에 해당되지 않습니다.')
      isView.value = false
      return false
    } else {
      isView.value = true
    }

    loading.value = true
    await mapApi
      .getRegionData({
        key: 'system',
        layer: layer,
        geometryWKT: wktGeomety,
        crs: 'EPSG:5186',
      })
      .then((res) => res.json())
      .then((data) => {
        const apiResult = data.data
        let array = apiResult.objVal

        //5m x 5m
        const height = apiResult.height

        //배열 합치기
        let flattenedArray = array.flat()
        console.log('mapStudio 리턴 받은 배열 갯수 : ' + flattenedArray.length)
        flattenedArray = flattenedArray.filter((a) => a > -1)

        // 최대값
        let _max = flattenedArray.reduce((previous, current) => {
          return previous > current ? previous : current
        })
        // 최소값
        let _min = flattenedArray.reduce((previous, current) => {
          return previous > current ? current : previous
        })
        // 평균
        let _average = flattenedArray.reduce((sum, curVal) => {
          return sum + curVal
        })
        _average = _average / flattenedArray.length
        // 급경사지(25이상)
        let _scarp = flattenedArray.filter((val) => val >= 25)
        _scarp = (_scarp.length / flattenedArray.length) * 100

        //info정보 세팅
        info.value.max = _max.toFixed(3)
        info.value.min = _min.toFixed(3)
        info.value.average = _average.toFixed(3)
        info.value.percent = _scarp.toFixed(1)
        info.value.diffCnt = (_max - _min).toFixed(3)

        //현재 지도객체
        // const currentMap = Map.getCurrentMapFromMapStore()
        const currentMap = mapWrap.value?.getUitMap().getMap()

        const orgCrs = 'EPSG:5186'
        const newCrs = currentMap!.getView().getProjection().getCode()

        //좌표변환
        const extent = transformExtent(
          apiResult.bbox.split(',').map((coordinate) => Number(coordinate)),
          orgCrs,
          newCrs,
        )

        let idxFeatures = mapUtil.makeFeaturesToBbox(extent, array[0].length, array.length)
        idxFeatures = mapUtil.sortIdxArrPerRow(idxFeatures, array[0].length)

        featureTurfData.value = array
          .flat()
          .map((val, idx) => {
            return {
              feature: idxFeatures[idx],
              value: val.toFixed(3),
              idx,
            }
          })
          .filter((obj) => obj.value > -1)

        //table데이터(원본)
        info.value.tableData = array
          .flat()
          .map((val, idx) => {
            const center = getCenter(idxFeatures[idx].getGeometry().getExtent())
            return {
              x: center[0],
              y: center[1],
              value: val.toFixed(3),
              idx,
            }
          })
          .filter((obj) => obj.value > -1)
        //table데이터(실제보여줄)
        tableData.value = cloneDeep(info.value.tableData)

        const min = Math.floor(_min)
        const max = Math.ceil(_max)
        const numOfInterval = 6
        let gap = 0

        if (max - min < 1) {
          gap = 1
        } else {
          gap = Math.ceil((_max - _min + 1) / numOfInterval)
        }

        let labelArr = []
        let gapArr = []
        for (var i = 1; min + i * gap < max + gap; i++) {
          let _result = min + i * gap
          _result = Math.round(_result * 100) / 100
          labelArr.push(_result - gap + info.value.unit + '~' + _result + info.value.unit)
          gapArr.push(_result)
        }

        info.value.chartData = [...Array(labelArr.length)].map((obj, idx) => {
          let _valueArray = tableData.value.filter((a) => {
            return min + idx * gap <= a.value && a.value < gapArr[idx]
          })

          return {
            label: labelArr[idx],
            value: _valueArray.length,
            color: colorArr.value[idx],
            tableDataArr: _valueArray, //나중에 filter용
          }
        })

        //feature데이터 가공
        featureData.value = []
        featureTurfData.value.forEach((obj) => {
          let _feature = obj.feature
          let _value = obj.value

          _feature.set('idx', obj.idx)

          for (let i = 0; i < gapArr.length; i++) {
            if (min + i * gap <= _value && _value < gapArr[i]) {
              _feature.set('color', colorArr.value[i])
              _feature.set('color_idx', i)
            }
          }

          featureData.value.push(_feature)
        })

        info.value.featureData = cloneDeep(featureData.value)

        //filter 초기세팅
        chartFilter.value = info.value.chartData.map((a) => {
          return a.label
        })
        //차트 재호출
        makeChart()
      })
      .catch((err) => {
        console.log(err)
        commonUtil.errorMessage('분석 데이터를 가져오는데 문제가 발생되었습니다.')
        clearMapCall()
      })
      .finally(() => {
        loading.value = false
        mapCall()
      })
  }

  /**
   * 경사분석
   */
  function inspectionClick() {
    if (inspection.value) return

    inspection.value = true
    if (inspection.value) {
      elevation.value = false
      menuType.value = 'SLOPE'
    }
    initCall()
  }

  /**
   * 표고분석
   */
  function elevationClick() {
    if (elevation.value) return

    elevation.value = true
    if (elevation.value) {
      inspection.value = false
      menuType.value = 'ALTITUDE'
    }
    initCall()
  }
  // const mapStore = useMapStore()
  async function init3d() {
    // try {
    //   await cmmConfigStore.loadMapConfig()
    // } catch (err) {
    //   CommonUtil.errorMessage(err)
    // }
    //
    // const mapConfig = useMapConfig()

    const vWorldApiKey = cmmConfigStore.mapConfigState['VWORLD_KEY'].confValue
    const apiKey = import.meta.env.DEV ? import.meta.env.VITE_APP_KEY_VWORLD_LOCAL : vWorldApiKey
    v3durl.value = `/${import.meta.env.VITE_APP_CONTEXT}/3d.html?apiKey=${apiKey}`
  }

  watch(
    () => featureData.value,
    (newVal) => {
      map3DViewBtn()
      const currentMap = mapStore.getCurrentMap()
      const zoom = (23 - (currentMap?.getView().getZoom() as number)) * 100
      if (!currentMap) return
      const wfsLayer = _mapUtil.getLayerById(
        currentMap,
        LayerType.HIGHLIGHT,
      ) as VectorLayer<VectorSource>
      const _center = wfsLayer.getSource()?.getExtent() as Array<number>
      const center = transform(
        [(_center[0] + _center[2]) / 2, (_center[1] + _center[3]) / 2],
        'EPSG:3857',
        'EPSG:4326',
      )
      let count = 0
      new Promise((resolve) => {
        const checkState = () => {
          if (count > 5) throw new Error('다시 검색해주세요.')
          if (childFrame.value?.contentWindow) {
            resolve(
              childFrame.value?.contentWindow?.postMessage(
                JSON.stringify({
                  ...mapStore.map3d.feature,
                  center,
                  zoom,
                  id: featureData.value[0].ol_uid,
                }),
                '*',
              ),
            )
          } else {
            count++
            setTimeout(() => checkState(), 300) // 일정 시간마다 재시도
          }
        }
        checkState()
      })
    },
  )

  onMounted(async () => {
    await init3d()
  })

  watch(searchAddressFeature, () => {
    if (isActive.value) {
      clearMapCall()
      initCall()
    }
  })

  onActivated(() => {
    isActive.value = true
    showModel.value = false
    toggleShowModel()

    // initCall()
  })

  onDeactivated(() => {
    isActive.value = false
    showModel.value = true
    toggleShowModel()
  })

  onBeforeMount(async () => {
    mapWrap.value = await mapStore.getMapInstance()

    const wfsVectorLayer = (source: VectorSource) =>
      new VectorLayer({
        source,
        properties: {
          id: LayerType.WFSVECTOR,
          type: LayerType.WFSVECTOR,
        },
        zIndex: 1000,
        style: wfsVectorStyle,
      })

    mapWrap.value?.getUitMap().getMap()?.addLayer(wfsVectorLayer(new VectorSource()))

    initCall()
  })

  defineExpose({
    // initCall,
  })
</script>

<style scoped lang="scss">
  .customCard {
    padding: 20px !important;
  }
  .seleted {
    background: #7AAAD1;
    border-color: #7AAAD1;
    color: #fff;
  }

  .btn-wrap.popup .dropdown {
    flex-flow: column;
    padding: 20px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 10px #0003;
  }

  .btn-wrap.popup .dropdown-header {
    width: 100%;
    padding-bottom: 16px;
    position: relative;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.21;
    color: #000;
  }

  .btn-wrap.popup .btn-close {
    position: absolute;
    top: 0;
    right: 0;
  }

  .btn-wrap .dropdown {
    position: absolute;
    top: 610px;
    right: calc(100% - 550px);
    display: flex;
    opacity: 0;
    visibility: hidden;
    transform: translateY(0);
    transition: 0.3s;
    z-index: 21;
  }

  .btn-wrap.active.popup .dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(10%);
    transition: 0.3s;
  }

  .slider-wrap {
    display: flex;
    align-items: center;
    height: 30px;
  }

  .vue3-slider {
    width: 380px;
  }
  .slider-label {
    font-weight: bold;
    color: #4D7D99;
    width: 50px;
  }

  .slider-num {
    width: 40px;
    display: flex;
    justify-content: center;
  }

  .slider-num:last-child {
    text-align: right;
  }

  .btn-tool {
    margin-left: 20px;
    height: 28px;
    padding: 0 16px;
    border-radius: 4px;
    background: #44619b;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #fff;
  }

  .btn-close {
    // margin: 10px;
    z-index: 100;
    position: absolute;
    right: 0;
  }

  .three-dimension-container {
    left: 0;
    top: 0;
    width: 511px;
    height: 260px;
    border-radius: 5px;
    position: relative;
    button {
      width: 35px !important;
      top: 10px;
      right: 11px;
      position: absolute;
    }
    iframe {
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }
</style>

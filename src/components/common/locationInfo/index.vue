<template>
  <div class="locationInfo active">
    <div class="locationInfo-top customCard">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-right: 7px;
        "
      >
        <span class="title">
          <svg
            width="17"
            height="22"
            viewBox="0 0 17 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Group 15654">
              <g id="Group 286">
                <path
                  id="Exclude"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.5 1C12.9625 1 17 4.33789 17 9.50021C17 12.7966 14.3969 16.6736 9.20125 21.1414C8.7975 21.4834 8.19187 21.4834 7.78812 21.1414C2.60312 16.6736 0 12.7966 0 9.50021C0 4.33789 4.0375 1 8.5 1ZM8.49944 13.2351C10.6119 13.2351 12.3244 11.5643 12.3244 9.50328C12.3244 7.44227 10.6119 5.77148 8.49944 5.77148C6.38695 5.77148 4.67444 7.44227 4.67444 9.50328C4.67444 11.5643 6.38695 13.2351 8.49944 13.2351Z"
                  fill="#7AAAD1"
                />
              </g>
            </g>
          </svg>
          {{ addressTxt }}
        </span>
        <el-button
          size="small"
          type="primary"
          v-if="mapStore.currentMapGroup === 'Menu_2_Sub_4'"
          :disabled="!hasZoneFeature"
          @click="test()"
        >
          보고서
        </el-button>
      </div>
      <div class="search-map-btn">
        <button type="button" class="btn-basic" @click="openApiMapWindow('naver')">네이버</button>
        <button type="button" class="btn-basic" @click="openApiMapWindow('eum')">이음지도</button>
      </div>
      <button type="button" class="btn-close" @click="close">
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
    <ul class="locationInfo-tab customTab">
      <li
        v-for="(item, index) in tabList.filter((a) => a.visible.value == true)"
        :key="index"
        @click.prevent="handleTabChange(item.key)"
        :class="{ active: tabCategory === item.key }"
        class="customTab-item"
      >
        {{ item.title }}
      </li>
    </ul>

    <div style="display: flex; flex-direction: column; height: 100%">
      <transition name="slide-fade" mode="out-in">
        <keep-alive>
          <component :is="tabComponent" ref="current" v-bind="{ mapType: props.mapType }" />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, markRaw, onMounted, ref, shallowRef, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import html2canvas from 'html2canvas'
  import { getCenter, getHeight, getWidth } from 'ol/extent'

  import DetailsAside from '@/components/common/DetailsAside.vue'
  import Land from '@/components/common/locationInfo/land/Land.vue'
  import Build from '@/components/common/locationInfo/build/Build.vue'

  import UitDrawInteraction from '@uitgis/ol-ugis-test/interaction/uitDraw'

  import { MapType } from '@/enums/mapEnum'
  import CommonUtil from '@/utils/commonUtil'

  import { getConfig } from '@/api/app/config'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { intersects } from 'ol/format/filter'
  import { urlWithParams } from '@uitgis/ol-ugis-test/util'
  import { API_INFO_MAPSTUDIO } from '@/config/config'
  import { GeoJSON, WFS } from 'ol/format'
  import Feature from 'ol/Feature'
  import { downLoadReport } from '@/api/app/report'
  import { MapWrapper } from '@/js/mapWrapper'

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const globalStore = useGlobalStore()
  const mapStore = useMapStore(props.mapType)
  const cmmConfigStore = useCmmConfigStore()
  const { searchAddress, searchAddressFeature } = storeToRefs(mapStore)

  const mapWrap = ref<MapWrapper>()
  const tab = ref()
  const current = ref()
  const tabComponent = ref()
  const detailsAsideRef = ref<typeof DetailsAside>()
  const tabCategory = ref<string>('')
  const dstplanInfo = ref({
    areaNum: '해당없음',
    areaType: '',
  })
  // const limitInfo = ref('해당없음')
  const limitInfo = ref([
    {
      text: '',
      feature: null,
    },
  ])

  const searchEitherMap = (type: 'naver' | 'eum', searchValue) => {
    switch (type) {
      case 'naver': {
        // window.open(
        //   (cmmConfig.state?.NAVER_SEARCH_URL?.confValue ?? 'https://map.naver.com/p/search/') +
        //     searchValue,
        // )
        break
      }
      case 'eum': {
        window.open('https://www.eum.go.kr/web/mp/mpMapDet.jsp?detType=luLand&pnu=' + searchValue)
      }
    }
  }

  const tabList = shallowRef([
    {
      key: 'LAND',
      title: '토지정보',
      content: Land,
      visible: ref(true),
    },
    {
      key: 'BUILD',
      title: '건축물정보',
      content: Build,
      visible: ref(false),
    },
    // {
    //   key: 'TOPOGRAPHY',
    //   title: '지형정보',
    //   content: Topography,
    //   visible: ref(false),
    // },
  ])

  const addressTxt = computed(() =>
    searchAddress ? (searchAddress.value.address ? searchAddress.value.address.parcel : '') : '',
  )

  const useReportBtn = computed(() =>
    searchAddress ? (searchAddress.value.address ? searchAddress.value.address.parcel : '') : '',
  )

  const hasZoneFeature = computed(() => {
    return !!zoneFeature.value
  })

  const zoneFeature = ref<Feature | null>()

  function exclusionVisibleChange(data) {
    if (detailsAsideRef.value) detailsAsideRef.value.openCollapse(true)
  }

  function handleTabChange(key) {
    const find = tabList.value.find((item) => key === item.key)
    if (find) {
      tabCategory.value = find.key
      tabComponent.value = markRaw(find.content)
    }
  }

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      const vworldKey = computed(() => cmmConfigStore.mapConfigState['NAVER_SEARCH_URL'].confValue)
      // vworldKey.value = cmmConfigStore.mapConfigState['VWORLD_KEY'].confValue
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  // watch(searchAddressFeature, async () => {
  // if (currentType === 'analysis' && mapStore.getCurrentMapKey() === currentType) {
  //   await getWfsDstplan()
  //   await getWfsLimit()
  // }
  // })

  // let _watch
  // onActivated(() => {
  //   _watch = watch(searchAddressFeature, async () => {
  //     await getWfsDstplan()
  //     await getWfsLimit()
  //   })
  // })

  // onDeactivated(() => {
  //   if (_watch) {
  //     _watch()
  //   }
  // })

  // onMounted(() => {
  //   handleTabChange('KRAS')
  //   tab.value = 'KRAS'
  // })

  function close() {
    mapStore.locationInfoVisible = false
  }

  const openApiMapWindow = (type: 'naver' | 'eum') => {
    switch (type) {
      case 'naver': {
        window.open('https://map.naver.com/p/search/' + searchAddress.value.address?.parcel)
        break
      }
      case 'eum': {
        window.open(
          'https://www.eum.go.kr/web/mp/mpMapDet.jsp?detType=luLand&pnu=' + searchAddress.value.id,
        )
        break
      }
    }
  }
  const imgUrl = ref('')
  const test = async () => {
    globalStore.loadingOn()

    const mapWrap = await mapStore.getMapInstance()

    const uitMap = mapWrap?.getUitMap()
    const olMap = uitMap!.getMap()

    // const mapType: MapType = 'Map-Classify'
    // const mapStore = useMapStore(mapType)
    // // const mapWrap = ref<MapWrapper>()
    //
    // const mapWrap = await mapStore.getMapInstance()
    //
    // const uitMap = mapWrap?.getUitMap()
    // const olMap = uitMap.getMap()
    //
    // console.log(uitMap?.getMap()?.getTargetElement())
    //
    // const filter = intersects(
    //   'SHAPE',
    //   searchAddressFeature.value.getGeometry(),
    //   olMap!.getView().getProjection().getCode(),
    // )
    //
    // const res = await fetch(
    //   urlWithParams(API_INFO_MAPSTUDIO.PREFIX + '/uwfs', {
    //     KEY: 'system',
    //   }),
    //   {
    //     method: 'POST',
    //     body: new XMLSerializer().serializeToString(
    //       new WFS().writeGetFeature({
    //         srsName: olMap?.getView().getProjection().getCode(),
    //         featureNS: 'http://www.opengis.net/wfs',
    //         featurePrefix: 'feature',
    //         outputFormat: 'application/json',
    //         featureTypes: ['CIAMS_ZONE'],
    //         filter,
    //       }),
    //     ),
    //   },
    // )
    //
    // let text = await res.text()
    // text = text.replace(/\n/gi, '\\r\n')
    // const features = new GeoJSON().readFeatures(text) as Feature[]
    //
    // if (CommonUtil.isEmpty(features)) {
    //   zoneSelected.value = false
    //   return false
    // }

    olMap!.once('rendercomplete', async () => {
      try {
        const mapContainer = document.querySelector('.mapContainer') as HTMLElement
        // 전체 화면 캡처
        const fullCanvas = await getImgCanvasFromPrint(mapContainer)

        // 저장해둔 정사각형 Extent를 다시 가져옴 (또는 재계산)
        const feature = zoneFeature.value
        const originalExtent = feature!.getGeometry()!.getExtent()
        const squareExtent = getSquaredBufferedExtent(originalExtent, 0.1) // 아래 헬퍼 함수 참고

        // 2. 지도 좌표 -> 픽셀 좌표 변환
        const bottomLeft = olMap!.getPixelFromCoordinate([squareExtent[0], squareExtent[1]])
        const topRight = olMap!.getPixelFromCoordinate([squareExtent[2], squareExtent[3]])

        // 3. 자를 영역 계산
        // Math.floor/ceil을 사용하여 1px이라도 덜 잘리거나 더 잘리는 것 방지
        const cropX = Math.floor(bottomLeft[0])
        const cropY = Math.floor(topRight[1])

        // 가로/세로 중 작은 값을 기준으로 크기 설정
        // 이론상 정사각형이므로 width와 height가 같아야 하지만, 줌 레벨에 따라 1~2px 오차 발생 가능
        const width = Math.ceil(topRight[0] - bottomLeft[0])
        const height = Math.ceil(bottomLeft[1] - topRight[1])
        const cropSize = Math.max(width, height) // 혹은 Math.min 사용

        // 4. 캔버스 범위 밖 참조 방지
        // fit을 squareExtent로 했더라도 1px 정도 오차가 있을 수 있으므로 방어 코드 작성
        const safeX = Math.max(0, cropX)
        const safeY = Math.max(0, cropY)

        // 5. 이미지 자르기
        const croppedCanvas = cropCanvas(fullCanvas, safeX, safeY, cropSize, cropSize)

        imgUrl.value = croppedCanvas.toDataURL()

        // try {
        //   const { data, headers } = await downLoadReport({
        //     pnu: searchAddress.value.id,
        //     address: addressTxt.value,
        //     zoneNo: feature!.get('ZONE_NO'),
        //     imageBase64: imgUrl.value,
        //   })
        //
        //   const fileName = headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
        //   CommonUtil.download(new Blob([data]), decodeURI(fileName))
        // } catch (e) {
        //   CommonUtil.errorMessage('존재하지 않는 파일입니다.')
        // }

        try {
          // 1. 전체 response 객체를 받아야 header에 접근 가능
          const response = await downLoadReport({
            pnu: searchAddress.value.id,
            address: addressTxt.value,
            zoneNo: feature!.get('ZONE_NO'),
            imageBase64: imgUrl.value,
          })

          const { data, headers } = response

          const contentDisposition = headers['content-disposition']
          let fileName = '도시공업지역_보고서.doc'

          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]*)/)

            if (fileNameMatch && fileNameMatch[1]) {
              fileName = decodeURIComponent(fileNameMatch[1])
            } else {
              const fileNameLegacy = contentDisposition.match(/filename="?([^"]*)"?/)
              if (fileNameLegacy && fileNameLegacy[1]) {
                fileName = decodeURIComponent(fileNameLegacy[1])
              }
            }
          }

          CommonUtil.download(data, fileName)
        } catch (e: any) {
          if (
            e.response &&
            e.response.data instanceof Blob &&
            e.response.data.type === 'application/json'
          ) {
            const reader = new FileReader()
            reader.onload = () => {
              try {
                const errorJson = JSON.parse(reader.result as string)
                CommonUtil.errorMessage(
                  errorJson.message || '파일 다운로드 중 오류가 발생했습니다.',
                )
              } catch {
                CommonUtil.errorMessage('알 수 없는 오류가 발생했습니다.')
              }
            }
            reader.readAsText(e.response.data)
          } else {
            console.error(e)
            CommonUtil.errorMessage('파일 생성에 실패했습니다.')
          }
        }

        globalStore.loadingOff()
      } catch (e) {
        console.error(e)
        globalStore.loadingOff()
      }
    })

    const feature = zoneFeature.value
    const geometry = feature!.getGeometry()

    if (geometry) {
      // 1. 정사각형 Extent 계산
      const squareExtent = getSquaredBufferedExtent(geometry.getExtent(), 0.1)

      // 2. [중요] '피처'가 아니라 '정사각형 Extent'를 기준으로 fit 해야 함
      olMap!.getView().fit(squareExtent, {
        padding: [0, 0, 0, 0],
        duration: 0,
        nearest: false,
      })
    }

    // setTimeout(async () => {
    //   olMap!.getView().fit(features[0]!.getGeometry()!.getExtent(), {
    //     padding: [200, 100, 200, 100],
    //   })
    //
    //   const canvas = await getImgCanvasFromPrint(document.querySelector('.mapContainer')!)
    //   // document.getElementById('mapContainer') as HTMLElement
    //
    //   imgUrl.value = canvas.toDataURL()
    // }, 1)

    // const canvas = await getImgCanvasFromPrint(uitMap!.getMap()!.getTargetElement()!)

    // const canvas = await getImgCanvasFromPrint(document.querySelector('.mapContainer')!)
    // // document.getElementById('mapContainer') as HTMLElement
    //
    // imgUrl.value = canvas.toDataURL()
  }

  function cropCanvas(
    sourceCanvas: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number,
  ): HTMLCanvasElement {
    // 1. 잘라낸 이미지를 담을 새 캔버스 생성
    const destCanvas = document.createElement('canvas')
    destCanvas.width = width
    destCanvas.height = height
    const ctx = destCanvas.getContext('2d')

    if (!ctx) {
      throw new Error('Canvas context를 가져올 수 없습니다.')
    }

    // 2. 원본에서 특정 영역만 새 캔버스에 그리기 (drawImage 인자 9개 활용)
    // drawImage(source, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH)
    ctx.drawImage(
      sourceCanvas,
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height, // 새 캔버스에 그릴 영역 (0,0 부터 가득 채움)
    )

    return destCanvas
  }

  function getSquaredBufferedExtent(originalExtent: number[], bufferRatio: number) {
    const width = getWidth(originalExtent)
    const height = getHeight(originalExtent)
    const center = getCenter(originalExtent)

    // 가로, 세로 중 더 긴 쪽을 찾아서 정사각형의 한 변으로 설정
    const maxDim = Math.max(width, height)
    const newSide = maxDim * (1 + bufferRatio * 2) // 여백 추가

    return [
      center[0] - newSide / 2,
      center[1] - newSide / 2,
      center[0] + newSide / 2,
      center[1] + newSide / 2,
    ]
  }

  async function getImgCanvasFromPrint(printTarget: HTMLElement): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
      html2canvas(printTarget, {
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          if (element.classList.contains('no-print')) return true
          return false
        },
      }).then((canvas) => {
        resolve(canvas)
      })
    })
  }

  const visible = computed(() => mapStore.locationInfoVisible)

  watch(visible, () => {
    if (!visible.value) {
      const draw = mapStore.interactionManager?.getInteraction(
        'location-info',
      ) as UitDrawInteraction
      draw.clear()
    }
  })

  watch(searchAddressFeature, async () => {
    // const mapType: MapType = 'Map-Classify'
    // const mapStore = useMapStore(mapType)
    // // const mapWrap = ref<MapWrapper>()
    //
    // const mapWrap = await mapStore.getMapInstance()
    //

    // const mapStore = useMapStore(mapType)
    // // // const mapWrap = ref<MapWrapper>()
    // //
    const mapWrap = await mapStore.getMapInstance()
    const uitMap = mapWrap?.getUitMap()
    const olMap = uitMap!.getMap()
    //
    // console.log(uitMap?.getMap()?.getTargetElement())
    //
    const filter = intersects(
      'SHAPE',
      searchAddressFeature.value.getGeometry(),
      olMap!.getView().getProjection().getCode(),
    )

    const res = await fetch(
      urlWithParams(API_INFO_MAPSTUDIO.PREFIX + '/uwfs', {
        KEY: 'system',
      }),
      {
        method: 'POST',
        body: new XMLSerializer().serializeToString(
          new WFS().writeGetFeature({
            srsName: olMap?.getView().getProjection().getCode(),
            featureNS: 'http://www.opengis.net/wfs',
            featurePrefix: 'feature',
            outputFormat: 'application/json',
            featureTypes: ['CIAMS_ZONE'],
            filter,
          }),
        ),
      },
    )

    let text = await res.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    if (CommonUtil.isEmpty(features)) {
      zoneFeature.value = null
    } else {
      zoneFeature.value = features[0]
    }
  })

  onMounted(async () => {
    await loadConfig()

    handleTabChange('LAND')
    // tab.value = 'PLAN'

    const tabs = [
      {
        key: 'BUILD',
        code: 'KRAS_USE',
      },
      {
        key: 'BDREG',
        code: 'BUILD_REG_USE',
      },
      {
        key: 'TOPOGRAPHY',
        code: 'SYSTEM_TOPOGRAPHY',
      },
    ]

    for (let o of tabs) {
      const ft = tabList.value.find((tab) => tab.key === o.key)
      try {
        const config = await getConfig(o.code)
        ft!.visible.value = config.data.used
      } catch (e) {
        ft!.visible.value = false
      }
    }
  })

  defineExpose({
    exclusionVisibleChange,
  })
</script>

<style lang="scss">
  @import '@/assets/css/locationInfo.css';

  .locationInfo {
    top: 0;
    z-index: 10;
    position: absolute;
    background: #f4f4f4;
    font-family: 'Pretendard', sans-serif;

    .locationInfo-top {
      align-items: center;
      justify-content: space-between;
    }

    .locationInfo-content {
      .customCard {
        padding: 0;
      }

      .customTable.use-plan tr th {
        text-align: center;
      }
    }

    .btn-report {
      height: 24px;
      padding: 0 7px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: -0.24px;
      background: #7aaad1;
      color: #fff;
      margin-right: 5px;
    }

    .search-map-btn {
      display: flex;
      flex-direction: row;

      .btn-basic {
        height: 24px;
        padding: 0 7px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: -0.24px;
        background: #44619b;
        color: #fff;
        margin-right: 5px;
        width: max-content;
      }
    }
  }
</style>

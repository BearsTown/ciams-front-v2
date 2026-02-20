<template>
  <div class="customModal customModal-overlay printModal">
    <div class="customModal-window">
      <div class="customModal-header">
        <p class="title">출력</p>
        <button @click="printDialog = false" type="button" class="btn-close">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L13 13" stroke="black" stroke-width="2" stroke-linecap="round" />
            <path d="M13 1L0.999999 13" stroke="black" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="customModal-body" id="customModal">
        <div class="print-header">
          <div class="checkbox-wrap">
            <label class="customCheckbox">
              <input v-model="hasTitle" type="checkbox" />
              <span class="customCheckbox-text">제목</span>
            </label>
            <label class="customCheckbox">
              <input v-model="hasExtra" type="checkbox" />
              <span class="customCheckbox-text">비고</span>
            </label>
          </div>
          <div class="btn-group">
            <button type="button" @click="printMapPage" class="btn-tool">프린트 출력</button>
            <button type="button" @click="getMapImage" class="btn-tool">이미지 파일 다운</button>
          </div>
        </div>

        <div class="print-content">
          <div
            class="print-title ssd"
            :class="{
              notActive: !hasTitle,
            }"
          >
            <input v-model="inputTitle" type="text" class="customInput" placeholder="제목" />
          </div>

          <div class="print-wrap">
            <div style="margin: auto 0" id="modal-content" class="map">
              <div ref="dialog" id="staticMap"></div>
              <div ref="dialog" id="modalBaseMap"></div>
              <div ref="dialog" id="modalMap"></div>
            </div>
          </div>

          <div
            class="print-memo ssd"
            :class="{
              notActive: !hasExtra,
            }"
          >
            <textarea
              v-model="inputExtra"
              class="customTextarea customScroll"
              placeholder="메모"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import { MapType } from '@/enums/mapEnum'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import UitMap from '@uitgis/ol-ugis-test/uitMap'
  import UitBaseMap from '@uitgis/ol-ugis-test/baseMap/uitBaseMap'
  import UitMapPrint from '@uitgis/ol-ugis-test/util/uitMapPrint'
  import Collection from 'ol/Collection'
  import VectorLayer from 'ol/layer/Vector'
  import TileLayer from 'ol/layer/Tile'
  import ImageLayer from 'ol/layer/Image'
  import VectorSource from 'ol/source/Vector'
  import { Circle, Fill, Stroke, Style, Text } from 'ol/style'
  import BaseLayer from 'ol/layer/Base'
  import CommonUtil from '@/utils/commonUtil'

  const globalStore = useGlobalStore()
  const { currentMapType, printDialog } = storeToRefs(globalStore)

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const inputTitle = ref<string>('')
  const inputExtra = ref<string>('')
  const hasTitle = ref<boolean>(true)
  const hasExtra = ref<boolean>(true)

  let printUitMap: UitMap
  let printUitBaseMap: UitBaseMap
  let mapPrint: UitMapPrint

  async function init() {
    const mapStore = useMapStore(props.mapType)
    const mapWrap = await mapStore.getMapInstance()

    const uitMap = mapWrap.getUitMap()
    const olMap = uitMap.getMap()

    console.log(olMap?.getTarget())

    // olMap?.setTarget('modalMap')

    printUitMap = new UitMap({
      target: 'modalMap',
      layers: [],
      view: olMap!.getView(),
      // layers: uitMap.getLayers().map((l) => l),
      // layers: [...uitMap.getLayers()],
      // view: new View({
      //   constrainResolution: true,
      //   zoom: olMap?.getView().getZoom(),
      //   center: olMap?.getView().getCenter(),
      //   projection: olMap?.getView().getProjection(),
      // }),
    })
    printUitMap.init()

    printUitBaseMap = new UitBaseMap({
      target: 'modalBaseMap',
      uitMap: printUitMap,
      baseMapKey: mapWrap.getUitBaseMap().getBaseMapKey(),
      baseMapApiKey: mapWrap.getUitBaseMap().getBaseMapApiKey(),
    })

    await printUitBaseMap.firstInit()

    const element = document.getElementById('modalBaseMap')

    element!.className = element!.className
      .split(' ')
      .filter((cls) => !cls.startsWith('map-filter-'))
      .join(' ')

    element!.classList.add(`map-filter-${mapStore.mapInfo.state.baseMapOption}`)

    mapPrint = new UitMapPrint({
      baseMap: printUitBaseMap,
      printTarget: 'print',
      kakaoStaticTarget: 'staticMap',
      openlayersTarget: 'modalMap',
    })

    const controls = printUitMap!.getMap()!.getControls().getArray()
    for (let i = controls.length - 1; i >= 0; i--) {
      printUitMap!.getMap()!.removeControl(controls[i])
    }

    await initLayers(olMap!.getLayers())
  }

  function createPrintDOM() {
    const wrapper = document.createElement('div')
    const title = document.createElement('h2')
    title.className = 'title'
    title.textContent = hasTitle.value ? inputTitle.value : ''

    const body = document.createElement('div')
    body.id = 'printImage'

    const footer = document.createElement('div')
    const footerContext = document.createElement('p')

    footerContext.textContent = hasExtra.value ? inputExtra.value : ''
    footerContext.className = 'context'
    footer.appendChild(footerContext)
    wrapper.append(title, body, footer)
    return wrapper
  }

  function printMapPage() {
    const code = printUitBaseMap.getBaseMapKey().split('_')[0]
    const dom = createPrintDOM()
    if (code === 'kakao') {
      mapPrint!.print(
        code,
        { DOM: dom, imgTarget: 'printImage' },
        { useProxy: false, proxyUrl: '' },
      )
    } else {
      mapPrint!.print(
        code,
        { DOM: dom, imgTarget: 'printImage', contentId: 'modal-content' },
        { useProxy: false, proxyUrl: '' },
      )
    }
  }

  function getMapImage() {
    const code = printUitBaseMap.getBaseMapKey().split('_')[0]
    if (code === 'kakao') {
      CommonUtil.warningMessage('카카오맵 출력 미지원.')
      // mapPrint!.image(code, { contentId: 'modal-content' }, { proxyUrl: '/' })
    } else {
      mapPrint!.image(code, { contentId: 'modal-content' })

      // const canvas = await mapPrint!.getImgCanvasFromPrint(
      //   document.getElementById('modal-content') as HTMLElement,
      // )
      // canvas.toDataURL()
    }
  }

  async function initLayers(layers: Collection<BaseLayer>) {
    layers.forEach((layer) => {
      let newLayer

      if (layer instanceof TileLayer) {
        const source = layer.getSource()
        newLayer = new TileLayer({
          source: source,
          opacity: layer.getOpacity(),
          visible: layer.getVisible(),
          zIndex: layer.getZIndex(),
          properties: layer.getProperties(),
        })
      }
      // VectorLayer 복제
      else if (layer instanceof VectorLayer) {
        const source = layer.getSource()
        const style = layer.getStyle()

        let newStyle
        if (typeof style === 'function') {
          newStyle = style
        } else if (style instanceof Style) {
          newStyle = new Style({
            fill: style.getFill()
              ? new Fill({
                  color: style.getFill().getColor(),
                })
              : null,
            stroke: style.getStroke()
              ? new Stroke({
                  color: style.getStroke().getColor(),
                  width: style.getStroke().getWidth(),
                })
              : null,
            image:
              style.getImage() instanceof Circle
                ? new Circle({
                    radius: style.getImage().getRadius(),
                    fill: style.getImage().getFill()
                      ? new Fill({
                          color: style.getImage().getFill().getColor(),
                        })
                      : null,
                  })
                : null,
            text: style.getText()
              ? new Text({
                  text: style.getText().getText(),
                  font: style.getText().getFont(),
                  fill: style.getText().getFill()
                    ? new Fill({
                        color: style.getText().getFill().getColor(),
                      })
                    : null,
                })
              : null,
          })
        }

        newLayer = new VectorLayer({
          source: new VectorSource({
            features: source.getFeatures(),
          }),
          style: newStyle,
          opacity: layer.getOpacity(),
          visible: layer.getVisible(),
          zIndex: layer.getZIndex(),
          properties: layer.getProperties(),
        })
      } else if (layer instanceof ImageLayer) {
        const source = layer.getSource()
        newLayer = new ImageLayer({
          source: source,
          opacity: layer.getOpacity(),
          visible: layer.getVisible(),
          zIndex: layer.getZIndex(),
          properties: layer.getProperties(),
        })
      }

      if (newLayer) {
        printUitMap.getMap()!.addLayer(newLayer)
      }
    })
  }

  onMounted(async () => {
    await init()
  })

  onUnmounted(async () => {
    const mapStore = useMapStore(props.mapType)
    const mapWrap = await mapStore.getMapInstance()

    const uitMap = mapWrap.getUitMap()
    const olMap = uitMap.getMap()

    // olMap!.setTarget(`ol-map-${currentMapType.value}`)
  })
</script>

<style lang="scss">
  @import '@/assets/css/printModal.css';

  @media print {
    body * {
      opacity: 0 !important;
      visibility: hidden !important;
      box-shadow: none !important;
      -webkit-print-color-adjust: exact !important; /* Chrome, Safari, Edge */
      color-adjust: exact !important;
    }
    @page {
      size: landscape;
    }

    .title {
      margin-left: 10px;
      font-size: 32px;
      text-align: center;
    }
    .cur-dev-title {
      position: absolute;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 24px;
      text-align: cetner;
    }

    .customScroll::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    .context {
      position: absolute;
      top: 89%;
      font-size: 20px;
      margin-left: 10px;
      margin-right: 10px;
      word-wrap: break-word;
    }
    #print,
    #print * {
      opacity: 1 !important;
      visibility: visible !important;
    }
    #print {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
    }

    #devPlanPrint,
    #devPlanPrint * {
      opacity: 1 !important;
      visibility: visible !important;
    }
    #devPlanPrint {
      position: absolute;
      width: 100%;
      height: 100%;

      top: 0;
    }
    #printImage {
      margin-top: 25px;
    }
    #imgWrapper {
      top: 60px;
      left: 25px;
      position: absolute;
      z-index: 10;

      img {
        filter: invert(100%);
        width: 70%;
        height: 70%;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .map-filter-NORMAL {
    filter: none;
  }

  .map-filter-GRAY {
    filter: grayscale(1);
  }

  .map-filter-LIGHT {
    filter: brightness(1.2);
  }

  .map-filter-DARK {
    filter: brightness(0.5);
  }

  .customModal {
    .mapLocation {
      right: 10px;
      width: auto;

      span {
        width: 100%;
      }
    }
  }

  .ssd {
    height: auto;
    background: none;

    &.notActive {
      background: #e0e0e0;

      input {
        text-decoration: line-through;
      }

      textarea {
        text-decoration: line-through;
      }
    }
  }

  .map {
    width: 924px;
    height: 500px;
    position: relative;
    display: flex;
    overflow: hidden;
  }

  #staticMap {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  #modalBaseMap {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  #modalMap {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
  }

  .customModal.customModal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .customModal-window {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
  }

  .customModal-header {
    position: relative;
  }

  .customModal-header .title {
    padding-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.18;
    color: #000;
  }

  .customModal-header .btn-close {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

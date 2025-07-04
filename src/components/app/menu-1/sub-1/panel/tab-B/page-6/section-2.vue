<template>
  <PagePane :title="['기술업종별 LQ분석', '기술집약정도']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            <div>
              <div style="display: flex; margin-bottom: 5px">
                <div class="header-title" style="margin: 0">
                  {{ lqName }}
                </div>
                <el-text size="default">: {{ lqDesc }}</el-text>
              </div>
            </div>

            <el-divider border-style="dashed" style="margin: 5px 0" />

            <div style="display: flex; flex-direction: column">
              <div style="margin-bottom: 3px">
                <el-tag type="info">사업체</el-tag>

                <el-text v-if="0 < corpLqs.length" style="margin-left: 5px">
                  {{ sggTxt }}
                  <span style="color: blue">
                    {{ corpLqsText }}
                  </span>
                  {{ endTxt }}
                </el-text>
              </div>
              <div>
                <el-tag type="info">종사자</el-tag>

                <el-text v-if="0 < workerLqs.length" style="margin-left: 5px">
                  {{ sggTxt }}
                  <span style="color: blue">
                    {{ workerLqsText }}
                  </span>
                  {{ endTxt }}
                </el-text>
              </div>
            </div>
          </div>
        </div>
        <div class="center">
          <div class="left">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
                position: relative;
              "
            >
              <div
                style="
                  position: absolute;
                  top: 10px;
                  z-index: 10;
                  left: calc(50%);
                  transform: translateX(-50%);
                "
              >
                <el-radio-group v-model="lqMapType" size="default" @change="handleRadioChange">
                  <el-radio-button label="사업체" value="corpLq" />
                  <el-radio-button label="종사자" value="workerLq" />
                </el-radio-group>
              </div>

              <div style="position: absolute; bottom: 10px; z-index: 21; left: 10px">
                <Legend :list="legendList" />
              </div>

              <MapWrapperView v-if="mapConfig" :map-type="mapType" :map-config="mapConfig">
                <template #control>
                  <Controls :map-type="mapType" :use-land="false" />
                </template>
              </MapWrapperView>
            </div>
          </div>

          <div class="right">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <LQPane
                ref="lqPaneRef"
                :lq-parent-code="lqParentCode"
                :layer="uitVectorLayer"
                :lq-map-type="lqMapType"
                @update-legend="updateLegend"
                style="flex: 1"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, reactive, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub1Tab2Page6Store } from '@/stores/app/menu-1/sub-1/tab-B/page-6'
  import PagePane from '@/components/common/PagePane.vue'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import CommonUtil from '@/utils/commonUtil'
  import Controls from '@/components/map/control/Controls.vue'
  import MapWrapperView from '@/components/map/MapWrapper.vue'
  import { CommonLayerGroup, MapType, MapWrapperConfig } from '@/enums/mapEnum'
  import { useMapStore } from '@/stores/map/map'
  import { MapWrapper } from '@/js/mapWrapper'
  import LQPane from '@/components/app/menu-1/sub-1/panel/tab-B/page-6/LQPane.vue'
  import { getCode } from '@/api/app/common'
  import { MapLayer } from '@/js/layer'
  import UitWMSLayer from '@uitgis/ol-ugis-test/layer/uitWMSLayer'
  import { UitWFSLayer } from '@uitgis/ol-ugis-test/layer'
  import UitWMTSLayer from '@uitgis/ol-ugis-test/layer/uitWMTSLayer'
  import { getHighTech } from '@/api/app/menu-1/sub-1/tab-b/page-6'
  import { urlWithParams } from '@uitgis/ol-ugis-test/util'
  import { GeoJSON, WFS } from 'ol/format'
  import Feature from 'ol/Feature'
  import VectorSource from 'ol/source/Vector'
  import { Style } from 'ol/style'
  import Legend from '@/components/app/menu-1/sub-1/panel/tab-B/page-6/Legend.vue'
  import Source from '@/components/common/Source.vue'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getSources } from '@/api/app/source'
  import { storeToRefs } from 'pinia'

  const globalStore = useGlobalStore()
  const menu1Sub1Tab2Page6Store = useMenu1Sub1Tab2Page6Store()
  const cmmConfigStore = useCmmConfigStore()

  const { currentMapType } = storeToRefs(globalStore)

  const mapConfig = ref<MapWrapperConfig>()

  const mapType: MapType = 'Map-1-1-3'
  const commonLayerType: CommonLayerGroup = 'COMMON_LAYER_GROUP_1-1-3'
  const mapStore = useMapStore(mapType)
  const mapWrap = ref<MapWrapper>()

  const mapStudioUrl = import.meta.env.VITE_API_MAPSTUDIO_URL

  const lqParentCode = ref('TCH0003')

  const lqName = ref('')
  const lqDesc = ref('')

  const corpLqs = ref([])
  const workerLqs = ref([])

  const lqMapType = ref('corpLq')
  const lqPaneRef = ref<LQPane>()

  const legendList = ref([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  const sggTxt = computed(() => `${cmmConfigStore.cmmConfigState['SGG_NAME']?.confValue}는 `)
  const corpLqsText = computed(() => corpLqs.value.join(', '))
  const workerLqsText = computed(() => workerLqs.value.join(', '))
  const endTxt = computed(() => ` 업종의 지역 집적도가 높음`)

  async function loadConfig() {
    try {
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  const uitWMSLayer1 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '5CE56438-29A3-83A2-F5EC-157133C5E823',
      LAYERS: ['CIAMS_P1_SGG'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_p1_sgg',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    visible: true,
    opacity: 1,
    zIndex: 1110,
  })

  const uitWMSLayer2 = new UitWMSLayer({
    baseUrl: mapStudioUrl,
    sourceParams: {
      KEY: '5CE56438-29A3-83A2-F5EC-157133C5E823',
      LAYERS: ['CIAMS_P1_EMD'],
    },
    crossOrigin: 'Anonymous',
    properties: {
      id: 'ciams_p1_sgg',
      type: 'wms',
    },
    layerType: 'wms',
    isSingleTile: false,
    visible: true,
    opacity: 1,
    zIndex: 1110,
  })

  const uitVectorLayer = new UitWFSLayer({
    baseUrl: '',
    layerType: 'vector',
    source: new VectorSource(),
    visible: true,
    zIndex: 2222,
    properties: {
      visibleIgnore: true,
    },
    declutter: true,
  })

  async function init() {
    await loadConfig()

    mapConfig.value = {
      center: JSON.parse(cmmConfigStore.mapConfigState['MAP_INIT_CENTER'].confValue),
      zoom: Number(cmmConfigStore.mapConfigState['MAP_INIT_ZOOM'].confValue),
      kakao: cmmConfigStore.mapConfigState['KAKAO_KEY'].confValue,
      vWorld: cmmConfigStore.mapConfigState['VWORLD_KEY'].confValue,
      baseMapKey: 'vWorld_satellite',
      baseMapOption: 'NORMAL',
      olMapId: `ol-map-${mapType}`,
      baseMapId: `base-map-${mapType}`,
      isMapLocation: true,
    }

    mapWrap.value = await mapStore.getMapInstance()

    const uitMap = mapWrap.value?.getUitMap()

    const mapLayers = reactive<MapLayer[]>([
      new MapLayer({
        layer: uitWMSLayer1,
        title: '시군구',
        userVisible: true,
        useLegend: true,
        useLayerSetting: true,
      }),
      new MapLayer({
        layer: uitWMSLayer2,
        title: '읍면동',
        userVisible: true,
        useLegend: true,
        useLayerSetting: true,
      }),
      new MapLayer({
        layer: uitVectorLayer,
        userVisible: true,
      }),
    ])

    mapLayers.forEach((item) => {
      if (item) {
        const uLayer = item.getLayer()
        if (uLayer instanceof UitWMSLayer) {
          uitMap.addWMSLayer(uLayer as UitWMSLayer)
        } else if (uLayer instanceof UitWFSLayer) {
          uitMap.addWFSLayer(uLayer as UitWFSLayer)
        } else if (uLayer instanceof UitWMTSLayer) {
          uitMap.addWMTSLayer(uLayer as UitWMTSLayer)
        }

        mapWrap.value?.addCommonLayer({
          key: commonLayerType!,
          layers: [item] as MapLayer[],
        })
      }
    })

    mapWrap.value?.setCommonLayersVisible(commonLayerType!, true)

    const tocLayerGroups = {
      title: '행정구역',
      layers: [mapLayers[0], mapLayers[1]] as MapLayer[],
    }

    mapWrap.value?.setTocCommonLayerGroups(commonLayerType, tocLayerGroups)

    await loadSidoFeatures()
  }

  async function loadSidoFeatures() {
    const sidoFeatures = await fetch(
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
            featureTypes: ['CIAMS_SIDO'],
          }),
        ),
      },
    )

    let text = await sidoFeatures.text()
    text = text.replace(/\n/gi, '\\r\n')
    const features = new GeoJSON().readFeatures(text) as Feature[]

    const fLayer = uitVectorLayer as UitWFSLayer
    if (fLayer) {
      fLayer.clear()
      fLayer.addFeatures(features)
    }

    mapWrap.value?.getUitMap().getView().fit(uitVectorLayer.getSource().getExtent())
  }

  function handleRadioChange() {
    lqPaneRef.value?.updateMapType()
  }

  function updateLegend(styleInfo) {
    legendList.value = styleInfo.legend ? styleInfo.legend : []
  }

  onMounted(async () => {
    const { data: sourceData } = await getSources({
      category: '산업현황분석',
      targetId: lqParentCode.value,
    })

    sources.value = sourceData[0]?.sources

    const { data: code } = await getCode(lqParentCode.value)
    const { data: tech } = await getHighTech({
      parentTechCd: lqParentCode.value,
    })

    lqName.value = code.codeName
    lqDesc.value = code.codeDesc

    corpLqs.value = tech.techs
      .filter((tech) => tech.corpQualified === true)
      .map((tech) => tech.techNm)
    workerLqs.value = tech.techs
      .filter((tech) => tech.workerQualified === true)
      .map((tech) => tech.techNm)
  })

  onBeforeMount(() => {
    init()
  })

  onActivated(async () => {
    currentMapType.value = mapType
    mapStore.currentMapGroup = 'Menu-1-1-3'

    // mapWrap.value?.setViewLayersVisible(layerGroupName!, true)

    mapWrap.value = await mapStore.getMapInstance()
    mapWrap.value?.getUitBaseMap().updateSize()
    mapWrap.value?.getUitMap()?.refresh()
  })
</script>

<style lang="scss"></style>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .center {
      flex: 1;
      display: flex;
      flex-direction: row;
      overflow-y: hidden;
      height: 100%;

      .left {
        width: 50%;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;
        padding: 10px;
        background: #fff;
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        border-radius: 8px;
        overflow: hidden;
      }

      .right-top {
      }

      .right-bottom {
      }
    }

    .top {
      height: 80px;
      margin-bottom: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .customScroll {
      height: max-content;
      overflow-y: auto;
    }

    .text-wrap {
      color: #616161;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.5;
    }
  }

  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 5px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>

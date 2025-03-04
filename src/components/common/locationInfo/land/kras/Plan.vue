<template>
  <div class="locationInfo-content notice">
    <div class="container customScroll">
      <div
        v-if="limitArray(dstplanInfoArr).length == 0 || planAreaMultiCnt.value > 1"
        class="customCard"
      >
        <div class="no-data">
          {{ planAreaMulti }}
        </div>
      </div>
      <div
        v-for="(dstplanInfo, index) in limitArray(dstplanInfoArr)"
        :key="index"
        class="customCard"
      >
        <div class="card-title">고시정보</div>
        <table class="customTable">
          <colgroup>
            <col width="80%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">고시제목</th>
              <th scope="col"></th>
            </tr>
          </thead>
        </table>

        <div class="customScroll scrollY" style="max-height: 99px">
          <table class="customTable body">
            <colgroup>
              <col width="80%" />
              <col width="20%" />
            </colgroup>
            <tbody>
              <tr>
                <td>{{ dstplanInfo?.gosiInfo?.text }}</td>
                <td class="btn" style="text-align: center">
                  <button
                    type="button"
                    class="btn-basic"
                    @click="gosiUrlAction(dstplanInfo?.gosiInfo.url)"
                  >
                    상세정보
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="dstplanInfo.info?.areaNum" class="card-title" style="padding-top: 20px">
          성장관리계획 구역
          <span style="font-size: 12px; padding-left: 10px">(인접지역 포함)</span>
        </div>
        <table v-if="dstplanInfo.info?.areaNum" class="customTable">
          <colgroup>
            <col width="22%" />
            <col width="28%" />
            <col width="22%" />
            <col width="28%" />
          </colgroup>
          <tbody>
            <tr>
              <th>명칭</th>
              <td colspan="3" class="map">
                {{ dstplanInfo.info?.areaNum }}
                <button
                  type="button"
                  class="btn-basic"
                  @click="featureMove(dstplanInfo?.info?.feature, false, 'plan', 0)"
                >
                  지도
                </button>
              </td>
            </tr>
            <tr>
              <th>유형</th>
              <td>{{ dstplanInfo.info?.areaType }}</td>
              <th>면적</th>
              <td>{{ dstplanInfo.info?.areaArea }}</td>
            </tr>
            <tr>
              <th>위치</th>
              <td colspan="3">{{ dstplanInfo.info?.areaLoc }}</td>
            </tr>
            <tr>
              <th>지정사유</th>
              <td colspan="3">{{ dstplanInfo.info?.areaCause }}</td>
            </tr>
          </tbody>
        </table>

        <div class="card-title" style="padding-top: 20px">
          구역설정사유<span style="font-size: 12px; padding-left: 10px">(인접지역 포함)</span>
        </div>
        <table class="customTable">
          <colgroup>
            <col width="84%" />
            <col width="16%" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="col">유형</th>
              <th scope="col"></th>
            </tr>
            <!-- <span v-if="dstplanInfo['limitList'].length > 2"> -->
            <tr v-if="dstplanInfo?.limitList?.length == 0">
              <td colspan="2" style="text-align: center">해당없음</td>
            </tr>
            <tr
              v-else
              v-for="(item, idx) in dstplanInfo?.limitList"
              :key="item.text"
              :class="{ active: limitToggle.idx === idx && limitToggle.active === true }"
            >
              <td>
                {{ item.text }}
              </td>
              <td style="text-align: center">
                <button
                  type="button"
                  class="btn-basic"
                  @click="featureMove(item.feature, false, 'limit', idx)"
                >
                  지도
                </button>
              </td>
            </tr>
            <!-- </span> -->
          </tbody>
        </table>
      </div>
      <!-- <div v-if="dstplanInfo" class="customCard"></div> -->
    </div>
    <CustomLoading v-if="customLoading" />
  </div>
</template>
<script setup lang="ts">
  import { onActivated, onMounted, ref, watch } from 'vue'

  import { intersects } from 'ol/format/filter'

  import { storeToRefs } from 'pinia'

  import configService from '@/api/app/config'
  import { mapApi } from '@/api/map/mapService'
  import CustomLoading from '@/components/CustomLoading.vue'
  import { useManagementStore } from '@/stores/app/zoneEstablish/management'
  import { useGmpssStore } from '@/stores/app'
  import useKeyLayerStore from '@/stores/map/keyLayer'
  import { useMapStore } from '@/stores/map/map'
  import JstsUtil from '@/utils/jstsUtil'
  import mittBus from '@/utils/mittBus'
  import { computed } from 'vue'
  import { Fill, Stroke, Style, Text } from 'ol/style'
  import { Feature } from 'ol'
  const keyLayerStore = useKeyLayerStore()
  const zoneEstablishManagementStore = useManagementStore()
  const gmpStore = useGmpssStore()
  const { searchAddress, searchAddressFeature, mainTab } = storeToRefs(gmpStore)
  //   const ssearchAddress = ref<any>(null)
  const { planId } = storeToRefs(zoneEstablishManagementStore)

  const dstplanInfoArr = ref<any[]>([])
  // const dstplanInfo = ref()

  const gosiInfo = ref({
    num: '해당없음',
    title: '',
  })
  // const limitInfo = ref('해당없음')
  const limitInfo = ref([])
  const planToggle = ref({ idx: -1, active: false })
  const limitToggle = ref({ idx: -1, active: false })
  const customLoading = ref(false)

  const planAreaMultiCnt = ref(0)
  const planAreaMulti = computed(() => {
    return planAreaMultiCnt.value > 1
      ? `${planAreaMultiCnt.value}건의 성장관리계획 구역이 존재합니다. 데이터 확인이 필요합니다.`
      : '해당없음'
  })

  const gosiList = ref()
  /**아직 미정 */
  const { getPlanState } = useKeyLayerStore()
  const mapStore = useMapStore()
  const currentType = mapStore.getCurrentMapKey()

  //계획 지역
  async function getWfsDstplan() {
    let key = ''
    if (!keyLayerStore.get('PLAN')) {
      await keyLayerStore.initState()
    }
    key = keyLayerStore.get('PLAN').key

    let feature = searchAddressFeature.value
    //근접 라인이 겹쳐져서 제척이 두개가 되는 경우가 발생함 buffer 줌
    let bufferGeometry = JstsUtil.addBuffer(feature.getGeometry(), -0.001)
    // feature.setGeometry(bufferGeometry)

    let layers
    if (mainTab.value == 'zoneEstablish') {
      layers = 'GMPSS_' + getPlanState().analysis + '_PLAN'
    } else if (mainTab.value == 'operation') {
      layers = 'GMPSS_PLAN'
    } else {
      layers = 'GMPSS_PLAN'
    }

    const options = {
      KEY: key,
      LAYERS: layers,
      filterdOptions: intersects('SHAPE', bufferGeometry, 'EPSG:3857'),
    }

    return await mapApi.getWFS(options).then((features) => {
      if (features.length > 1) {
        planAreaMultiCnt.value = features.length
      } else {
        planAreaMultiCnt.value = 0
      }

      if (features.length > 0) {
        return {
          areaNum: features[0].getProperties()['AREA_NAME'],
          areaType: features[0].getProperties()['AREA_TYPE'],
          areaArea: features[0].getProperties()['AREA_AREA'],
          areaCause: features[0].getProperties()['AREA_CAUSE'],
          areaLoc: features[0].getProperties()['AREA_LOC'],
          planId: features[0].getProperties()['PLAN_ID'],
          feature: features[0],
        }
      }
    })
  }

  //제척 지역
  async function getWfsLimit(plan_id) {
    let key = ''
    if (!keyLayerStore.get('LIMIT', plan_id)) {
      await keyLayerStore.initState()
    }
    key = keyLayerStore.get('LIMIT', plan_id).key

    const options = {
      KEY: key,
      LAYERS: 'GMPSS_' + plan_id + '_LIMIT',
      filterdOptions: intersects('SHAPE', searchAddressFeature.value.getGeometry(), 'EPSG:3857'),
    }
    return mapApi.getWFS(options).then((features) => {
      let limitList: any[] = []
      if (features.length > 0) {
        features.forEach((_feature) => {
          limitList.push({
            text: _feature.getProperties()['CDNM'],
            feature: _feature,
          })
        })
        // limitInfo.value = text.join(', ')
      }

      return limitList
    })
  }

  function doToggle(something, idx) {
    if (something.value.idx === idx) {
      if (something.value.active) {
        something.value.active = false
        return true
      } else {
        something.value.active = true
      }
    } else {
      something.value = { idx, active: true }
    }
    return false
  }
  /**
   * 선택시 지도이동
   */
  function featureMove(feature: Feature, isExtent = true, type = 'limit', idx?: any) {
    console.log('선택시 지도이동')
    let option: null | { stroke; fill } = null
    //toggle
    if (type === 'limit') {
      //제척지역 feature 삭제
      dstplanInfoArr.value.forEach((obj) => {
        mittBus.emit('higlight-remove-layer-by-features', {
          features: [obj.feature],
        })

        //제척지역 feature 삭제
        mittBus.emit('higlight-remove-layer-by-features', {
          features: obj.limitList.map((a) => a.feature),
        })
      })
      if (doToggle(limitToggle, idx)) return

      feature.setProperties({
        gmpssLabel: `${feature.getProperties()['STEP2NM']}<${feature.getProperties()['CDNM']}>`,
      })

      feature.setStyle(
        new Style({
          fill: new Fill({
            color: 'rgba(255, 0, 0, 0.3)',
          }),
          stroke: new Stroke({
            color: 'rgba(255, 0, 0, 1.0)',
            width: 2,
          }),
          text: new Text({
            font: 'bold 0.8rem sans-serif',
            backgroundFill: new Fill({
              color: 'rgba(110, 110, 110, 1)',
            }),
            backgroundStroke: new Stroke({
              color: 'rgba(110, 110, 110, 0.5)',
              width: 1,
            }),
            padding: [5, 5, 1, 5],
            fill: new Fill({ color: '#ffffff' }),
            overflow: true,
            text: feature?.get('gmpssLabel') || '',
          }),
        }),
      )
    } else {
      dstplanInfoArr.value.forEach((obj) => {
        if (!obj.info) return
        //제척지역 feature 삭제
        mittBus.emit('higlight-remove-layer-by-features', {
          features: [obj.info.feature],
        })
      })
      if (doToggle(planToggle, idx)) return
    }
    //선택된 제척지역 feature 추가
    mittBus.emit('higlight-add-layer-by-features', {
      features: [feature],
      isClear: true,
      isExtent: isExtent,
      isStyled: true,
    })
  }

  async function init() {
    console.log('init')
    await configService.getConfigList({ confType: 'GOSI_CONFIG', used: true }).then((res) => {
      gosiList.value = res.data.map((a) => {
        return {
          key: a.id,
          value: a.id,
          gosiUrl: a.confValue,
          title: a.confName,
          planAreaCode: a.confDesc,
        }
      })
    })

    dstplanInfoArr.value = [gosiList.value.length]
    customLoading.value = true
    try {
      planAreaMultiCnt.value = 0

      let planInfo
      //성장관리계획
      planInfo = await getWfsDstplan()

      await gosiList.value.forEach(async (element, idx) => {
        dstplanInfoArr.value[idx] = {}

        if (planInfo && planInfo.planId == element.key) dstplanInfoArr.value[idx]['info'] = planInfo

        //고시정보
        dstplanInfoArr.value[idx]['gosiInfo'] = {
          planId: element.key,
          text: element.title,
          url: element.gosiUrl,
        }

        //제척
        dstplanInfoArr.value[idx]['limitList'] = await getWfsLimit(element.key)
      })

      // let dstPlanObj = await getWfsDstplan()
      // if (!commonUtil.isEmpty(dstPlanObj) && dstPlanObj && dstPlanObj.planId) {
      //   dstPlanObj['limitList'] = await getWfsLimit(dstPlanObj?.planId)

      //   //고시정보
      //   let gosiInfo = gosiList.value.filter((a) => a.key == dstPlanObj?.planId)[0]
      //   dstPlanObj['gosiInfo'] = {
      //     text: gosiInfo.title,
      //     url: gosiInfo.gosiUrl,
      //   }
      // }
      // dstplanInfoArr.value.push(cloneDeep(dstPlanObj))
    } catch (e) {
      console.log(e)
    } finally {
      customLoading.value = false
    }
  }

  function gosiUrlAction(url) {
    window.open(url, '_blank')
  }

  function limitArray(arr) {
    //해당 고시정보만
    if (mainTab.value == 'zoneEstablish')
      return arr.filter(
        (a) => a.info || (a.limitList?.length > 0 && a.gosiInfo.planId == planId.value),
      )
    else return arr.filter((a) => a.info || a.limitList?.length > 0)
  }

  watch(
    () => searchAddress.value,
    () => {
      if (searchAddress.value) {
        init()
      }
    },
  )

  onActivated(() => {
    // init()
  })

  onMounted(async () => {
    await configService.getConfigList({ confType: 'GOSI_CONFIG', used: true }).then((res) => {
      gosiList.value = res.data.map((a) => {
        return {
          key: a.id,
          value: a.id,
          gosiUrl: a.confValue,
          title: a.confName,
          planAreaCode: a.confDesc,
        }
      })
    })

    // init()
  })
</script>
<style scoped lang="scss">
  .locationInfo-content .customCard {
    padding: 20px !important;
  }
  tr.active {
    background-color: #52b597;
    td {
      color: white !important;
    }
  }
</style>

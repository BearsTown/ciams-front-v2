<template>
  <div class="container customScroll">
    <div class="customCard">
      <InsideCollapse title="토지(임야) 대장" :is-open="true">
        <template v-if="detailItem" #content>
          <div class="table-group">
            <table class="customTable">
              <colgroup>
                <col width="22%" />
                <col width="28%" />
                <col width="22%" />
                <col width="28%" />
              </colgroup>
              <tbody>
                <tr>
                  <th>본번</th>
                  <td>{{ detailItem.SV0000000136?.lnmMnnm || '' }}</td>
                  <th>부번</th>
                  <td>{{ detailItem.SV0000000136?.lnmSlno || '' }}</td>
                </tr>
                <tr>
                  <th>지목</th>
                  <td>{{ detailItem.SV0000000136?.lndcgrCodeNm || '' }}</td>
                  <th>면적(m²)</th>
                  <td>{{ detailItem.SV0000000136?.lndpclAr || '' }}</td>
                </tr>
                <tr>
                  <th>토지등급</th>
                  <td>{{ detailItem.SV0000000136?.gradCode || '' }}</td>
                  <th>토지이동일</th>
                  <td>{{ detailItem.SV0000000136?.ladMvmnDe || '' }}</td>
                </tr>
                <tr>
                  <th>토지이동사유</th>
                  <td colspan="3">{{ detailItem.SV0000000136?.ladMvmnResnCodeNm || '' }}</td>
                </tr>
              </tbody>
            </table>

            <table class="customTable">
              <colgroup>
                <col width="22%" />
                <col width="28%" />
                <col width="22%" />
                <col width="28%" />
              </colgroup>
              <tbody>
                <tr>
                  <th>소유구분</th>
                  <td>{{ detailItem.SV0000000136?.posesnTyCodeNm || '' }}</td>
                  <th>소유자</th>
                  <td>{{ detailItem.SV0000000136?.ownerNm || '' }}</td>
                </tr>
                <tr>
                  <th>소유권변동일</th>
                  <td>{{ detailItem.SV0000000136?.ownshipChangeDe || '' }}</td>
                  <th>공유인원수</th>
                  <td>
                    {{
                      (detailItem.SV0000000136?.pblonsipNmprCo ?? '') === ''
                        ? '0'
                        : detailItem.SV0000000136?.pblonsipNmprCo
                    }}
                  </td>
                </tr>
                <tr>
                  <th>소유권변동사유</th>
                  <td colspan="3">
                    {{ detailItem.SV0000000136?.ownshipChgcsCodeNm || '' }}
                  </td>
                </tr>
              </tbody>
            </table>

            <table class="customTable">
              <colgroup>
                <col width="22%" />
                <col width="28%" />
                <col width="22%" />
                <col width="28%" />
              </colgroup>
              <tbody>
                <tr>
                  <th style="padding-right: 0px">공시지가(원/m²)</th>
                  <td colspan="3">
                    {{
                      CommonUtil.comma(detailItem.SV0000000136?.indvdlzPblntfPclnd + '') +
                        '원 (' +
                        detailItem.SV0000000136?.stdrYearMt +
                        ')' || ''
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </InsideCollapse>
    </div>

    <div class="customCard">
      <InsideCollapse title="개별공시지가" :is-open="true">
        <template v-if="detailItem" #content>
          <div class="table-group">
            <table class="customTable center">
              <colgroup>
                <col span="1" />
                <col span="1" />
                <col span="1" />
              </colgroup>
              <tbody>
                <tr>
                  <th>기준년월</th>
                  <th>공시일자</th>
                  <th>공시지가(원)</th>
                </tr>
                <template v-for="(item, idx) in detailItem.SV0000000155" :key="idx">
                  <tr>
                    <td>{{ `${item.crtrYear}년 ${item.crtrMm}월` || '' }}</td>
                    <td>{{ CommonUtil.convertDateFormat(item.pblntfYmd) || '' }}</td>
                    <td>{{ CommonUtil.comma(item.indivOalp) || '' }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
      </InsideCollapse>
    </div>

    <div class="customCard">
      <InsideCollapse title="토지이용계획" :is-open="true">
        <template #sub>
          <div style="display: flex; justify-content: end">
            <button type="button" class="btn-basic" @click.prevent.stop="getSV0000000167()">
              조회
            </button>
          </div>
        </template>
        <template #content>
          <div class="table-group">
            <table class="customTable center">
              <colgroup>
                <col style="width: 90px; min-width: 90px" />
                <col style="width: 100px; min-width: 100px" />
                <col style="width: auto" />
                <col style="width: auto" />
              </colgroup>
              <tbody>
                <tr>
                  <th :rowspan="ladUsePlanLawB?.length * 2 + 2">지역지구 등 지정여부</th>
                  <th>「국토의 계획 및 이용에 관한 법률」<br />에 따른 지역·지구 등</th>
                  <td colspan="2">{{ SV0000000167?.base?.ladUsePlanLawA || '-' }}</td>
                </tr>
                <tr>
                  <th :rowspan="ladUsePlanLawB?.length * 2 + 1">
                    다른 법령 등<br />에 따른 지역·지구 등
                  </th>
                </tr>

                <template v-for="item in ladUsePlanLawB" :key="item.KEY">
                  <tr>
                    <td rowspan="2">{{ item.KEY }}</td>
                  </tr>
                  <tr>
                    <td>{{ item.VALUE }}</td>
                  </tr>
                </template>

                <tr>
                  <th colspan="2">추가기재사항</th>
                  <td colspan="2">{{ SV0000000167?.base?.ladUsePlanLawC || '-' }}</td>
                </tr>

                <tr>
                  <th colspan="2">
                    「토지이용규제 기본법 시행령」<br />제9조 제4항<br />
                    각 호에 해당하는 사항
                  </th>
                  <td colspan="2">{{ SV0000000167?.base?.ladUsePlanLawD || '-' }}</td>
                </tr>
              </tbody>
            </table>

            <table class="customTable center">
              <colgroup>
                <col style="width: 90px; min-width: 90px" />
                <col style="width: 100px; min-width: 100px" />
                <col style="width: auto" />
                <col style="width: auto" />
              </colgroup>
              <tbody>
                <tr>
                  <th colspan="4">확인도면</th>
                </tr>
                <tr>
                  <td colspan="4">
                    <img
                      style="width: 100%; height: 100%; padding: 0"
                      v-if="SV0000000167?.base?.drwImage"
                      :src="drwImage(SV0000000167?.base?.drwImage!)"
                    />
                  </td>
                </tr>
                <tr>
                  <th colspan="4">범례</th>
                </tr>
                <tr>
                  <td colspan="4">
                    <div class="legendArea">
                      <template v-for="(item, idx) in SV0000000167?.legend" :key="idx">
                        <div class="legend">
                          <span class="box">
                            <img v-if="item" :src="drwImage(item.lgdImage)" />
                          </span>
                          <span class="txt">{{ item.lgdNm }}</span>
                        </div>
                      </template>
                      <div class="legend" v-if="SV0000000167?.base?.scCode">
                        <span class="box"></span>
                        <span class="txt">{{ `축척 1:${SV0000000167?.base?.scCode}` }}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </InsideCollapse>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onDeactivated, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import { InsideCollapse } from '@/components/common/collapse'

  import Map from '@/js/map/map'
  import { MapType } from '@/enums/mapEnum'
  import CommonUtil from '@/utils/commonUtil'

  import Kgeo from '@/api/app/kgeo/model'
  import { getKgeoServiceData } from '@/api/app/kgeo'

  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useOpenApiStore } from '@/stores/app/openapi'

  interface KeyValue {
    KEY: string
    VALUE: string
  }

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const loaded = ref<boolean>(false)
  const isActive = ref<boolean>(false)

  const mapStore = useMapStore(props.mapType)
  const globalStore = useGlobalStore()
  const openApiStore = useOpenApiStore()

  const { locInfo } = storeToRefs(mapStore)
  const { kgeoInfoItem: detailItem } = storeToRefs(openApiStore)

  const ladUsePlanLawB = ref([] as KeyValue[])
  const SV0000000167 = ref({} as Kgeo.SV0000000167.Result)

  function loadData() {
    Map.getLandVworld('KGEO', props.mapType)
    loaded.value = true
  }

  async function getSV0000000167() {
    globalStore.loadingOn()

    const { pnu } = mapStore.locInfo
    const { data } = await getKgeoServiceData('SV0000000167', { pnu })

    if (data.code === 200) {
      SV0000000167.value = data.result as Kgeo.SV0000000167.Result
      if (!CommonUtil.isEmpty(SV0000000167.value)) {
        ladUsePlanLawB.value = getLawStr(SV0000000167.value.base.ladUsePlanLawB)
      }
    } else {
      ladUsePlanLawB.value = [] as KeyValue[]
      SV0000000167.value = {} as Kgeo.SV0000000167.Result
    }

    globalStore.loadingOff()
  }

  function getLawStr(str: string): KeyValue[] {
    const items = str.split(', ')

    return items.map((item) => {
      const keyMatch = item.match(/<(.+?)>/)
      const KEY = keyMatch ? keyMatch[1] : ''
      const VALUE = item.replace(/<.+?>/, '').trim()
      return { KEY, VALUE }
    })
  }

  function drwImage(base64: string) {
    if (base64) {
      return `data:image/png;base64,${base64}`
    } else {
      return ''
    }
  }

  onActivated(() => {
    isActive.value = true

    if (!loaded.value && locInfo.value?.pnu) {
      loadData()
    }
  })

  onDeactivated(() => {
    isActive.value = false
  })

  watch(locInfo, () => {
    openApiStore.setKgeoInfoItem({})
    ladUsePlanLawB.value = [] as KeyValue[]
    SV0000000167.value = {} as Kgeo.SV0000000167.Result
    loaded.value = false
    if (isActive.value) {
      loadData()
    }
  })

  // watch(detailItem, () => {
  //   if (!CommonUtil.isEmpty(detailItem)) {
  //     ladUsePlanLawB.value = getLawStr(detailItem.value.SV0000000167?.base.ladUsePlanLawB)
  //   }
  // })
</script>

<style scoped lang="scss">
  .border-box-round {
    border: none;
  }

  .customTable tbody th,
  .customTable tbody td {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }

  .center td,
  .center th {
    text-align: center !important;
    vertical-align: middle !important;
  }

  .btn-basic {
    width: auto;
    padding: 0 16px;
    height: 24px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.24px;
    background: #44619b;
    color: #fff;
    margin-right: 5px;

    &:not(:disabled):hover {
      opacity: 0.8;
    }
  }

  .legendArea {
    display: flex;
    flex-wrap: wrap;

    .legend {
      flex: 50%;
      display: flex;
      align-items: center;

      .box {
        display: flex;
        width: 16px;
        height: 16px;
        margin-right: 7px;
        box-sizing: border-box;

        &.default {
          border: 1.5px solid #bebe0b;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .txt {
        font-size: 16px;
        color: #666;
      }
    }
  }
</style>

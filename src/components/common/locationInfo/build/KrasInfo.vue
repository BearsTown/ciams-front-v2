<template>
  <div class="container customScroll">
    <div class="customCard">
      <InsideCollapse title="토지(임야) 대장" :is-open="true">
        <template v-if="detailItem && detailItem.krasLandInfo" #content>
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
                  <td>{{ detailItem.krasLandInfo?.bobn || '' }}</td>
                  <th>부번</th>
                  <td>{{ detailItem.krasLandInfo?.bubn || '' }}</td>
                </tr>
                <tr>
                  <th>지목</th>
                  <td>{{ detailItem.krasLandInfo?.jimok_nm || '' }}</td>
                  <th>면적(m²)</th>
                  <td>{{ detailItem.krasLandInfo?.parea || '' }}㎡</td>
                </tr>
                <tr>
                  <th>토지등급</th>
                  <td>{{ detailItem.krasLandInfo?.grd || '' }}</td>
                  <th>토지이동일</th>
                  <td>{{ detailItem.krasLandInfo?.land_mov_ymd || '' }}</td>
                </tr>
                <tr>
                  <th>토지이동사유</th>
                  <td colspan="3">{{ detailItem.krasLandInfo?.land_mov_rsn_cd_nm || '' }}</td>
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
                  <td>
                    {{
                      detailItem.krasLandInfo?.pann_jiga +
                        '(' +
                        detailItem.krasLandInfo?.jiga_base_mon +
                        ')' || ''
                    }}
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
                  <th>주소</th>
                  <td>{{ detailItem.krasLandInfo?.owner_addr || '' }}</td>
                  <th>변동일자</th>
                  <td>{{ detailItem.krasLandInfo?.owndymd || '' }}</td>
                </tr>
                <tr>
                  <th>소유구분명</th>
                  <td>{{ detailItem.krasLandInfo?.own_gbn_nm || '' }}</td>
                  <th>소유자명</th>
                  <td>{{ detailItem.krasLandInfo?.owner_nm || '' }}</td>
                </tr>
                <tr>
                  <th>공유인수(명)</th>
                  <td>{{ detailItem.krasLandInfo?.shr_cnt || '' }}</td>
                  <th>변동원인명</th>
                  <td>{{ detailItem.krasLandInfo?.own_rgt_chg_rsn_cd_nm || '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </InsideCollapse>
    </div>

    <div class="customCard">
      <InsideCollapse title="토지 이용계획 규제사항" :is-open="true">
        <template #content v-if="detailItem && detailItem.krasLandUsePlanBase">
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
                  <th>소재지</th>
                  <td colspan="3">{{ detailItem.krasLandUsePlanBase.land_loc_nm || '' }}</td>
                </tr>
                <tr>
                  <th>지목</th>
                  <td>{{ detailItem.krasLandUsePlanBase.jimok_nm || '' }}</td>
                  <th>면적(m²)</th>
                  <td>{{ detailItem.krasLandUsePlanBase.parea || '' }}㎡</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template #content v-else>
          <div class="no-data table">데이터가 존재하지 않습니다.</div>
        </template>
      </InsideCollapse>
    </div>
    <div class="customCard">
      <InsideCollapse title="토지이용계획" :is-open="true">
        <template #content v-if="detailItem && detailItem.krasLandUsePlanBase">
          <div class="table-group">
            <table class="customTable center">
              <colgroup>
                <col width="100%" />
              </colgroup>
              <tbody>
                <tr>
                  <th>⌜국토의 계획 및 이용에 관한 법률⌟ 에 따른 지역 지구 등</th>
                </tr>
                <tr>
                  <td>{{ detailItem.krasLandUsePlanBase?.uselaw_a || '' }}</td>
                </tr>
                <tr>
                  <th>다른 법령 등에 따른 지역 지구 등</th>
                </tr>
                <tr>
                  <td>{{ detailItem.krasLandUsePlanBase.uselaw_b || '' }}</td>
                </tr>
                <tr>
                  <th>⌜토지이용규제기본법 시행령⌟ 제9조 제4항 각 호에 해당되는 사항</th>
                </tr>
                <tr>
                  <td>{{ detailItem.krasLandUsePlanBase?.uselaw_d || '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

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
                    v-if="detailItem && detailItem.krasLandUsePlanBase?.img"
                    :src="drwImage(detailItem?.krasLandUsePlanBase.img)"
                  />
                </td>
              </tr>
              <tr>
                <th colspan="4">범례</th>
              </tr>
              <tr>
                <td colspan="4">
                  <div class="legendArea">
                    <template
                      v-for="(item, idx) in detailItem?.krasLandUsePlanBase?.legend"
                      :key="idx"
                    >
                      <div class="legend">
                        <span class="box">
                          <img v-if="item" :src="drwImage(item.img)" />
                        </span>
                        <span class="txt">{{ item.lgdNm }}</span>
                      </div>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template #content v-else>
          <div class="no-data table">데이터가 존재하지 않습니다.</div>
        </template>
      </InsideCollapse>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { computed, onActivated, onDeactivated, ref, watch } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'

  import Map from '@/js/map/map'

  import { useMapStore } from '@/stores/map/map'
  import { useOpenApiStore } from '@/stores/app/openapi'
  import { MapType } from '@/enums/mapEnum'

  const loaded = ref<boolean>(false)
  const isActive = ref<boolean>(false)

  const openApiStore = useOpenApiStore()

  const { krasInfoItem: detailItem } = storeToRefs(openApiStore)

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const mapStore = useMapStore(props.mapType)
  const { locInfo } = storeToRefs(mapStore)

  const img = computed(() => {
    return (
      'data:image/png;base64,' +
      detailItem.value?.krasLandUsePlanBase.img.replace(/ /g, '').replace(/\r?\n|\r/g, '')
    )
  })

  function legendImg(base64: string) {
    return 'data:image/png;base64,' + base64.replace(/ /g, '').replace(/\r?\n|\r/g, '')
  }

  function loadData() {
    Map.getLandVworld('KRAS', props.mapType)
    loaded.value = true
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
    loaded.value = false
    openApiStore.setKrasInfoItem({})
    if (isActive.value) {
      loadData()
    }
  })
</script>

<style scoped lang="scss">
  .border-box-round {
    border: none;
  }

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

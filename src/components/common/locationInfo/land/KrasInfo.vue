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
                <tr>
                  <th>개별공시지가</th>
                  <td colspan="3">
                    {{
                      detailItem?.jigaList
                        ? `${commonUtil.comma(detailItem?.jigaList[0].pann_jiga)}`
                        : ''
                    }}
                  </td>
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
      <InsideCollapse title="지역지구등 지정여부" :is-open="true">
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
                  <th colspan="2">⌜국토의 계획 및 이용에 관한 법률⌟<br />에 따른 지역 지구 등</th>
                  <td colspan="2">{{ detailItem.krasLandUsePlanBase?.uselaw_a || '' }}</td>
                </tr>
                <tr>
                  <th colspan="2">다른 법령 등에 따른 지역 지구 등</th>
                  <td colspan="2">{{ detailItem.krasLandUsePlanBase.uselaw_b || '' }}</td>
                </tr>
                <tr>
                  <th colspan="2">⌜토지이용규제기본법 시행령⌟ 제9조 제4항 각 호에 해당되는 사항</th>
                  <td colspan="2">{{ detailItem.krasLandUsePlanBase?.uselaw_d || '' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
        <template #content v-else>
          <div class="no-data table">데이터가 존재하지 않습니다.</div>
        </template>
      </InsideCollapse>
      <InsideCollapse title="도면 및 범례" :is-open="true">
        <template #content v-if="detailItem && detailItem.krasLandUsePlanBase">
          <div class="table-group">
            <table class="customTable">
              <colgroup>
                <col width="65%" />
                <col width="35%" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">확인도면</th>
                  <th scope="col">범례</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 5px">
                    <img
                      v-if="detailItem?.krasLandUsePlanBase.img"
                      :src="img"
                      style="width: 100%"
                    />
                  </td>
                  <td style="vertical-align: top">
                    <div v-for="(data, idx) in detailItem?.krasLandUsePlanLegends" :key="idx">
                      <span class="box" style="background: none">
                        <img :src="legendImg(data.img)" />
                      </span>
                      <span class="text">
                        {{ data.text }}
                      </span>
                    </div>
                  </td>
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
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { computed, onActivated, onDeactivated, ref, watch } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'

  import Map from '@/js/map/map'
  import commonUtil from '@/utils/commonUtil'
  // import { useGmpssStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useOpenApiStore } from '@/stores/app/openapi'
  import { MapType } from '@/enums/mapEnum'

  const loaded = ref<boolean>(false)
  const isActive = ref<boolean>(false)
  // const gmpStore = useGmpssStore()
  const openApiStore = useOpenApiStore()
  // const { locInfo } = storeToRefs(gmpStore)
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
</style>

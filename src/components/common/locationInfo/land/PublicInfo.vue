<template>
  <div class="container customScroll">
    <div class="customCard">
      <InsideCollapse title="토지 기본정보" :is-open="true">
        <template #content>
          <div class="table-group">
            <template v-if="detailItem && detailItem.ladfrlVOList">
              <table class="customTable">
                <colgroup>
                  <col width="22%" />
                  <col width="28%" />
                  <col width="22%" />
                  <col width="28%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>지목</th>
                    <td>{{ wrapValue(detailItem.ladfrlVOList?.lndcgrCodeNm || '') }}</td>
                    <th>축척</th>
                    <td>{{ wrapValue(detailItem.ladfrlVOList?.ladFrtlScNm || '') }}</td>
                  </tr>
                  <tr>
                    <th>면적</th>
                    <td>{{ wrapValue(detailItem.ladfrlVOList?.lndpclAr || '') }}㎡</td>
                    <th>소유구분</th>
                    <td>{{ wrapValue(detailItem.ladfrlVOList?.posesnSeCodeNm || '') }}</td>
                  </tr>
                  <tr>
                    <th>공유인수</th>
                    <td>{{ wrapValue(detailItem.ladfrlVOList?.cnrsPsnCo || '') }}</td>
                    <th></th>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </template>
            <template v-if="detailItem && detailItem.ladgrdVOList">
              <table class="customTable">
                <colgroup>
                  <col width="22%" />
                  <col width="28%" />
                  <col width="22%" />
                  <col width="28%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>토지등급</th>
                    <td>
                      {{ wrapValue(detailItem.ladgrdVOList[0]?.ladGrad || '') }}
                    </td>
                    <th>등급변동일자</th>
                    <td>
                      {{ wrapValue(detailItem.ladgrdVOList[0]?.ladGradChangeDe || '') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <template v-if="detailItem && detailItem.landCharacteristicss">
              <table class="customTable">
                <colgroup>
                  <col width="22%" />
                  <col width="28%" />
                  <col width="22%" />
                  <col width="28%" />
                </colgroup>
                <tbody>
                  <tr>
                    <th>토지이용상황</th>
                    <td>
                      {{ wrapValue(detailItem.landCharacteristicss[0]?.lndcgrCodeNm || '') }}
                    </td>
                    <th>지형높이</th>
                    <td>
                      {{ wrapValue(detailItem.landCharacteristicss[0]?.tpgrphHgCodeNm || '') }}
                    </td>
                  </tr>
                  <tr>
                    <th>지형형상</th>
                    <td>
                      {{ wrapValue(detailItem.landCharacteristicss[0]?.tpgrphFrmCodeNm || '') }}
                    </td>
                    <th>도로접면</th>
                    <td>
                      {{ wrapValue(detailItem.landCharacteristicss[0]?.roadSideCodeNm || '') }}
                    </td>
                  </tr>
                  <tr>
                    <th>용도지역(주)</th>
                    <td>
                      {{ wrapValue(detailItem.landCharacteristicss[0]?.prposArea1Nm || '') }}
                    </td>
                    <th>용도지역(부)</th>
                    <td>
                      {{ wrapValue(detailItem.landCharacteristicss[0]?.prposArea2Nm || '') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
        </template>
      </InsideCollapse>
    </div>

    <div class="customCard">
      <InsideCollapse title="토지 이용계획" :is-open="true">
        <template #content v-if="detailItem && detailItem.landUses">
          <div class="table-group">
            <table class="customTable use-plan">
              <colgroup>
                <col width="100%" />
              </colgroup>

              <tbody>
                <tr>
                  <th>국토의 계획 및 이용에 관한 법률에 따른 지역·지구등</th>
                </tr>
                <tr>
                  <td>
                    <template v-if="detailItem.landUses.UQ && detailItem.landUses.UQ.size > 0">
                      <template
                        v-for="(landUse, index) in detailItem.landUses.UQ"
                        :key="'UQ' + index"
                      >
                        <span>{{ landUse.prposAreaDstrcCodeNm }}</span>
                        <!-- <template
                          v-for="(use, idx) in landUse.field"
                          :key="'UQ' + index + '-' + idx"
                        >
                          <el-popover
                            placement="bottom"
                            :title="use.spcfcuCdNm"
                            :width="300"
                            trigger="click"
                            :content="use.joSubCns"
                          >
                            <template #reference> </template>
                          </el-popover>

                          &nbsp;&nbsp;
                        </template> -->
                      </template>
                    </template>
                    <template v-else> - </template>
                  </td>
                </tr>
                <tr>
                  <th>다른 법령 등에 따른 지역·지구등</th>
                </tr>
                <tr>
                  <td>
                    <template v-if="detailItem.landUses.UM && detailItem.landUses.UM.size > 0">
                      <template
                        v-for="(landUse, index) in detailItem.landUses.UM"
                        :key="'UM' + index"
                      >
                        <span>{{ landUse }}</span>
                        <!-- <template v-if="landUse.field.length > 0">
                          <template
                            v-for="(use, idx) in landUse.field"
                            :key="'UM' + index + '-' + idx"
                          >
                            <el-popover
                              placement="bottom"
                              :title="use.spcfcuCdNm"
                              :width="300"
                              trigger="click"
                              :content="use.joSubCns"
                            >
                              <template #reference>
                              </template>
                            </el-popover>
                          </template>
                        </template> -->
                        <!-- <template v-else>
                          {{ landUse.prposAreaDstrcCodeNm }}
                        </template> -->
                        &nbsp;&nbsp;
                      </template>
                    </template>
                    <template v-else> - </template>
                  </td>
                </tr>
                <tr>
                  <th>토지이용규제 기본법 시행령 제9조 제4항 각 호에 해당되는 사항</th>
                </tr>
                <tr>
                  <td>-</td>
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
      <InsideCollapse title="토지 이동연혁" :is-open="true">
        <template #content v-if="detailItem && detailItem.landMoves">
          <div class="table-group">
            <table class="customTable">
              <colgroup>
                <col width="22%" />
                <col width="22%" />
                <col width="22%" />
                <col width="36%" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">지목</th>
                  <th scope="col">면적(m)</th>
                  <th scope="col">토지이동일자</th>
                  <th scope="col">토지이동사유</th>
                </tr>
              </thead>

              <tbody>
                <template v-for="(move, idx) in detailItem.landMoves" :key="idx">
                  <tr>
                    <td>{{ move.lndcgrCodeNm }}</td>
                    <td>{{ move.lndpclAr }}</td>
                    <td>{{ move.ladMvmnDe }}</td>
                    <td>{{ move.ladMvmnPrvonshCodeNm }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
        <template #content v-else>
          <div class="no-data table">데이터가 존재하지 않습니다.</div>
        </template>
      </InsideCollapse>
    </div>
    <!--    </el-scrollbar>-->
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { onActivated, onDeactivated, ref, watch } from 'vue'

  import { InsideCollapse } from '@/components/common/collapse'

  import Map from '@/js/map/map'
  import { useGlobalStore } from '@/stores/app'
  // import { useGmpssStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { useOpenApiStore } from '@/stores/app/openapi'
  import { MapType } from '@/enums/mapEnum'

  const loaded = ref<boolean>(false)
  const isActive = ref<boolean>(false)
  // const gmpStore = useGmpssStore()
  const globalStore = useGlobalStore()
  const openApiStore = useOpenApiStore()
  // const { locInfo } = storeToRefs(gmpStore)
  const { publicDataInfoItem: detailItem } = storeToRefs(openApiStore)

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )

  const mapStore = useMapStore(props.mapType)
  const { locInfo } = storeToRefs(mapStore)

  const wrapValue = (value) => {
    if (Array.isArray(value)) {
      return value[0]
    }
    return value
  }

  function loadData() {
    Map.getLandVworld('PUBLIC', props.mapType)
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
    openApiStore.setPublicDataInfotem({})
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

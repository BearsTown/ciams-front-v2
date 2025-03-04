<template>
  <div class="locationInfo-content land">
    <div class="container customScroll">
      <template v-if="buildData.length > 0">
        <div class="customCard" style="padding: 5px 0">
          <InsideCollapse title="기본정보" :is-open="true">
            <template #content>
              <div style="margin-bottom: 20px" class="table-group">
                <table class="customTable selectable">
                  <colgroup>
                    <col />
                    <col width="15%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                  </colgroup>
                  <thead>
                    <th>건물명</th>
                    <th>동명</th>
                    <th>주용도</th>
                    <th>연면적(㎡)</th>
                    <th>승인일자</th>
                  </thead>
                  <tbody>
                    <template v-for="(buildInfo, idx) in buildData" :key="idx">
                      <tr
                        style="cursor: pointer"
                        :onclick="() => selectHandler(idx)"
                        :class="{ clickRowClass: idx === selectIdx }"
                      >
                        <td>{{ buildInfo.buildInfo.bldgNm }}</td>
                        <td>{{ buildInfo.buildInfo.dongNm }}</td>
                        <td>{{ buildInfo.buildInfo.mainUse }}</td>
                        <td>{{ buildInfo.buildInfo.grossFloorArea }}</td>
                        <td>{{ buildInfo.buildInfo.useAprvDate }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
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
                      <th>주용도</th>
                      <td>{{ buildData[selectIdx].buildInfoDetail.mainUse }}</td>
                      <th>대지면적</th>
                      <td>{{ buildData[selectIdx].buildInfoDetail.siteArea }}㎡</td>
                    </tr>
                    <tr>
                      <th>건축면적</th>
                      <td>{{ buildData[selectIdx].buildInfoDetail.bldgArea }}㎡</td>
                      <th>연면적</th>
                      <td>{{ buildData[selectIdx].buildInfoDetail.grossFloorArea }}㎡</td>
                    </tr>
                    <tr>
                      <th>건폐율</th>
                      <td>
                        {{ Number(buildData[selectIdx].buildInfoDetail.bldgLandRatio).toFixed(2) }}%
                      </td>
                      <th>용적률</th>
                      <td>
                        {{
                          Number(buildData[selectIdx].buildInfoDetail.floorAreaRatio).toFixed(2)
                        }}%
                      </td>
                    </tr>
                    <tr>
                      <th>사용승인일자</th>
                      <td>{{ buildData[selectIdx].buildInfoDetail.useAprvDate }}</td>
                      <th></th>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </InsideCollapse>
        </div>
      </template>
      <template v-else>
        <div class="customCard" style="padding: 20px">
          <div class="no-data">조회된 데이터가 없습니다</div>
        </div>
      </template>
    </div>
    <CustomLoading v-if="loading" />
  </div>
</template>

<script setup lang="ts">
  import { mapApi } from '@/api/map/mapService'
  import CustomLoading from '@/components/CustomLoading.vue'
  import { InsideCollapse } from '@/components/common/collapse'
  import { useGmpssStore } from '@/stores/app'
  import { storeToRefs } from 'pinia'
  import { onMounted } from 'vue'
  import { ref } from 'vue'
  import { watch } from 'vue'
  const gmpStore = useGmpssStore()
  const { searchAddressFeature } = storeToRefs(gmpStore)

  const buildData = ref<Array<BuildData>>([])
  const selectIdx = ref(0)

  const loading = ref(false)

  function selectHandler(idx: number) {
    selectIdx.value = idx
  }

  async function getBuildData(pnu: number): Promise<BuildData[] | []> {
    loading.value = true
    selectIdx.value = 0
    let _buildData: BuildData[] = []
    try {
      const response = await mapApi.getTestBuildData(pnu)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      _buildData = (await response.json()) as BuildData[]
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
      return _buildData as []
    }
  }

  export interface BuildData {
    buildInfo: BuildInfo
    buildInfoDetail: BuildInfoDetail
  }

  export interface BuildInfo {
    bldgNm: string
    dongNm: string
    mainUse: string
    grossFloorArea: string
    useAprvDate: Date
  }

  export interface BuildInfoDetail {
    mainUse: string
    siteArea: string
    bldgArea: string
    grossFloorArea: string
    bldgLandRatio: string
    floorAreaRatio: string
    useAprvDate: Date
  }
  onMounted(() => {
    const pnu = searchAddressFeature.value.get('PNU')
    getBuildData(pnu).then((res) => {
      buildData.value = res
    })
  })

  watch(searchAddressFeature, () => {
    const pnu = searchAddressFeature.value.get('PNU')
    getBuildData(pnu).then((res) => {
      buildData.value = res
    })
  })
</script>
<style scoped lang="scss">
  .border-box-round {
    border: none;
  }
  .locationInfo-content .customTable td,
  .locationInfo-content .customTable th {
    padding: 10px 3px 10px 14px;
  }

  .clickRowClass {
    background-color: var(--ugis-color-temp-2);

    td {
      color: white;
    }
  }
  .selectable {
    tr {
      &:not(.clickRowClass):hover {
        background-color: #7ac2ac;
        td {
          color: white;
        }
      }
    }
  }
</style>

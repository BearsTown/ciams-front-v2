<template>
  <div class="customScroll scrollY" style="height: calc(100% - 100px)">
    <Empty v-if="commonUtil.isEmpty(list)" style="flex: 1; height: 100%" />

    <div v-else class="customCard" v-for="item in list" :key="item">
      <InsideCollapse :is-open="true" :title="item.regNo">
        <template #content>
          <table class="customTable">
            <colgroup>
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
              <col width="25%" />
            </colgroup>
            <tbody>
              <tr>
                <th>민원접수번호</th>
                <td colspan="3">
                  <b>{{ item?.regNo || '-' }}</b>
                </td>
              </tr>
              <tr>
                <th>대표위치</th>
                <td colspan="3">
                  {{ item?.repLoc || '-' }}
                </td>
              </tr>

              <tr>
                <th>신청면적</th>
                <td>{{ commonUtil.comma(item?.area) || '-' }}㎡</td>
                <th>공사물구조</th>
                <td>{{ item?.strucNm || '-' }}</td>
              </tr>

              <tr>
                <th>용도지역</th>
                <td colspan="3">
                  {{ item?.areaUseNm || '-' }}
                </td>
              </tr>

              <tr>
                <th>개발행위허가</th>
                <td colspan="3">
                  {{ item?.licDevelopNm || '-' }}
                </td>
              </tr>
              <tr>
                <th>건축인허가</th>
                <td colspan="3">
                  {{ item?.licBuildingNm || '-' }}
                </td>
              </tr>
            </tbody>
          </table>

          <br />

          <table class="customTable">
            <colgroup>
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
              <col width="20%" />
            </colgroup>
            <tbody>
              <tr>
                <th>인센티브</th>
                <th colspan="2">건폐율</th>
                <th colspan="2">용적률</th>
              </tr>
              <tr>
                <th>기준</th>
                <td colspan="2">{{ item.summary['standard_bcr'] }}%</td>
                <td colspan="2">{{ item.summary['standard_far'] }}%</td>
              </tr>
              <tr>
                <th>상한</th>
                <td colspan="2">{{ item.summary['limit_bcr'] }}%</td>
                <td colspan="2">{{ item.summary['limit_far'] }}%</td>
              </tr>
              <tr>
                <th>산정</th>
                <td colspan="2" :style="{ color: checkOver(item.summary, IncentiveGroupType.BCR) }">
                  {{ item.summary['sum_bcr'] }}%
                </td>
                <td colspan="2" :style="{ color: checkOver(item.summary, IncentiveGroupType.FAR) }">
                  {{ item.summary['sum_far'] }}%
                </td>
              </tr>
            </tbody>
          </table>
        </template>
      </InsideCollapse>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useGmpssStore } from '@/stores/app'
  import { storeToRefs } from 'pinia'

  import { InsideCollapse } from '@/components/common/collapse'

  import { getPnuIncentive } from '@/api/app/incentive'
  import { Incentive } from '@/api/app/incentive/model'
  import commonUtil from '@/utils/commonUtil'
  import { IncentiveGroupType } from '@/types/incentive'

  const gmpStore = useGmpssStore()
  const { searchAddressFeature } = storeToRefs(gmpStore)

  const list = ref<Incentive.PNUIncentive[]>([])

  onMounted(() => {
    const pnu = searchAddressFeature.value.get('PNU')
    get(pnu)
  })
  watch(searchAddressFeature, () => {
    const pnu = searchAddressFeature.value.get('PNU')
    get(pnu)
  })

  async function get(pnu: string) {
    if (!pnu?.trim()) {
      reset()
      return
    }

    const { data } = await getPnuIncentive(`${pnu}`)
    list.value = data
  }

  function reset() {
    list.value = []
  }

  function checkOver(summary: object, type: IncentiveGroupType) {
    if (type === IncentiveGroupType.BCR) {
      return summary['sum_bcr']! > summary['limit_bcr']! - summary['standard_bcr']! ? 'red' : 'blue'
    } else if (type === IncentiveGroupType.FAR) {
      return summary['sum_far']! > summary['limit_far']! - summary['standard_far']! ? 'red' : 'blue'
    }
  }
</script>

<style scoped lang="scss">
  .border-box-round {
    border: none;
  }

  .customTable th {
    vertical-align: middle;
    border-bottom: 1px solid #eee;
    color: #616161;
  }
  .customTable th:not(:first-child) {
    border-left: 1px solid #eee;
  }

  .customTable th:first-child:last-child {
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
  }

  .customTable td {
    vertical-align: middle;
    color: #212121;
  }

  .customTable td,
  .customTable thead tr:nth-child(2) th:first-child {
    border-left: 1px solid #eee;
  }

  .customTable tbody th {
    color: #424242;
  }

  .customTable td:first-child:last-child {
    border-left: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
</style>

<template>
  <div class="urbanInfo active" style="display: flex; flex-direction: column">
    <div style="display: flex; flex-direction: column; height: 100%">
      <div class="container" style="height: 54px; margin-bottom: 8px">
        <div
          class="row"
          style="
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div
            class="title"
            style="align-items: center; display: flex; font-weight: 700; padding-bottom: 0"
          >
            <SvgIcon name="loc" style="color: #7aaad1; margin-right: 3px" />
            {{ overview ? `${overview.zoneName}` : '' }}
          </div>
          <div>
            <div
              v-if="overview"
              class="tag"
              :style="{ 'background-color': tagColor(overview.locReCd) }"
            >
              {{ overview.locResult }}
            </div>
          </div>
        </div>
      </div>

      <div class="container customScroll" style="flex: 1">
        <table class="customTable analysis">
          <colgroup>
            <col style="" />
            <col style="" />
            <col style="" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" style="text-align: center">구분</th>
              <th scope="col" style="text-align: center">산업시설 노후도</th>
              <th scope="col" style="text-align: center">도로율</th>
            </tr>
          </thead>
          <tbody>
            <tr :class="{ active: overview?.locReCd === 'AR0210' }" :style="getRowStyle('AR0210')">
              <td style="text-align: center; vertical-align: middle">양호</td>
              <td style="text-align: center; vertical-align: middle">50% 미만</td>
              <td style="text-align: center; vertical-align: middle">10% 이상</td>
            </tr>
            <tr :class="{ active: overview?.locReCd === 'AR0220' }" :style="getRowStyle('AR0220')">
              <td style="text-align: center; vertical-align: middle">불량</td>
              <td style="text-align: center; vertical-align: middle">50% 이상</td>
              <td style="text-align: center; vertical-align: middle">10% 미만</td>
            </tr>
          </tbody>
        </table>

        <el-divider border-style="dashed" style="margin: 10px 0" />

        <PieChartItem
          style="margin-top: 0"
          title="산업시설 노후도"
          :items="[
            {
              label: '대상지 산업시설',
              value: overview?.csB,
              unit: '동',
            },
            {
              label: '20년 이상 산업시설',
              value: overview?.csB20,
              unit: '동',
            },
            {
              label: '노후도',
              value: overview?.deterio,
              unit: '%',
            },
          ]"
          :data="{ value: overview?.deterio, names: ['20년 이상', '20년 미만'] }"
          :sources="source4"
          :colors="['#ec8c9a', '#f1ffa4']"
        />

        <PieChartItem
          style="margin-top: 5px"
          title="도로율"
          :items="[
            {
              // label: '대상지 도로 면적',
              label: '대상지 면적',
              value: overview?.zoneArea,
              unit: '㎡',
            },
            {
              label: '폭 8m 이상 도로 면적',
              value: overview?.roadA,
              unit: '㎡',
            },
            {
              label: '도로율',
              value: overview?.roadRate,
              unit: '%',
            },
          ]"
          :data="{ value: overview?.roadRate, names: ['도로', '비도로'] }"
          :sources="source5"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted, ref } from 'vue'

  import SvgIcon from '@/components/common/SvgIcon.vue'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import PieChartItem from '@/components/app/menu-2/PieChartItem.vue'

  import { getSources } from '@/api/app/source'
  import { CiamsZoneDTO } from '@/api/app/zone/model'
  import { SourceGroupDTO } from '@/api/app/source/model'

  import { useMenu2Sub2Store } from '@/stores/app/menu-2/sub-2'

  const menu2Sub2Store = useMenu2Sub2Store()

  const state = menu2Sub2Store.state
  const sourceData = ref<SourceGroupDTO.Find.Result[]>([])
  const overview = computed<CiamsZoneDTO.Overview.Find.Result | undefined>(() => state.overview)

  function tagColor(itaReCd: string) {
    return state.tags?.find((tag) => tag.value === itaReCd)?.color
  }

  function getRowStyle(locReCd: string) {
    return overview?.value?.locReCd === locReCd ? { 'background-color': tagColor(locReCd) } : {}
  }

  const filterByTargetId = (targetId: string) =>
    computed(() => sourceData.value.find((item) => item.targetId === targetId)?.sources)

  const source4 = filterByTargetId('E004')
  const source5 = filterByTargetId('E005')

  onBeforeMount(() => {})

  onMounted(async () => {
    const { data } = await getSources({
      category: '유형화분석',
    })

    sourceData.value = data
  })

  defineExpose({})
</script>

<style scoped lang="scss">
  .title {
    font-size: 17px;
    padding-bottom: 10px;
  }

  .analysis {
    tbody {
      tr.active {
        td {
          color: white;
        }
      }

      tr.row-type-1 {
        background-color: #90cd2a;
      }
      tr.row-type-2 {
        background-color: #ca5619;
      }
    }
  }

  .customScroll {
    display: flex;
    overflow-y: auto;
    flex-direction: column;
  }

  .tag {
    width: 105px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.12);
  }
</style>

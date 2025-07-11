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
              :style="{ 'background-color': tagColor(overview.itaReCd) }"
            >
              {{ overview.itaResult }}
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
            <col style="" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" style="text-align: center">구분</th>
              <th scope="col" style="text-align: center">선도·신흥산업 비율</th>
              <th scope="col" style="text-align: center">산업밀집도</th>
              <th scope="col" style="text-align: center">사업체수</th>
            </tr>
          </thead>
          <tbody>
            <tr :class="{ active: overview?.itaReCd === 'AR0110' }" :style="getRowStyle('AR0110')">
              <td style="text-align: center; vertical-align: middle">성장</td>
              <td style="text-align: center; vertical-align: middle">30% 이상</td>
              <td style="text-align: center; vertical-align: middle">1 이상</td>
              <td style="text-align: center; vertical-align: middle">증가</td>
            </tr>
            <tr :class="{ active: overview?.itaReCd === 'AR0120' }" :style="getRowStyle('AR0120')">
              <td style="text-align: center; vertical-align: middle">유지</td>
              <td style="text-align: center; vertical-align: middle">-</td>
              <td style="text-align: center; vertical-align: middle">1 이상</td>
              <td style="text-align: center; vertical-align: middle">증가</td>
            </tr>
            <tr :class="{ active: overview?.itaReCd === 'AR0130' }" :style="getRowStyle('AR0130')">
              <td style="text-align: center; vertical-align: middle">쇠퇴</td>
              <td style="text-align: center; vertical-align: middle">30% 미만</td>
              <td style="text-align: center; vertical-align: middle">1 미만</td>
              <td style="text-align: center; vertical-align: middle">감소</td>
            </tr>
          </tbody>
        </table>

        <el-divider border-style="dashed" style="margin: 10px 0" />

        <div style="display: flex; flex-direction: column; flex: 1">
          <LayerDataTable />
        </div>

        <el-divider border-style="dashed" style="margin: 10px 0" />

        <div style="display: flex; flex-direction: column; flex: 1">
          <PieChartItem
            style="margin-top: 0"
            title="선도·신흥산업 비율"
            :items="[
              {
                label: '지수',
                value: overview?.sssRate,
                unit: '%',
              },
              {
                label: '구분',
                value: overview?.sssRe,
                unit: '',
              },
            ]"
            :data="{ value: overview?.sssRate, names: ['선도·신흥산업', '기타'] }"
            :sources="source1"
          />

          <Item
            title="산업밀집도"
            :value1="overview ? `${overview.density} 개/㎡` : ''"
            :value2="overview ? `${overview.densityRe}` : ''"
            :sources="source2"
          />

          <Item
            title="사업체수 증감"
            :value1="overview ? `${overview.variation}` : ''"
            :value2="overview ? `${overview.variaRe}` : ''"
            :sources="source3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted, ref } from 'vue'

  import Item from '@/components/app/menu-2/Item.vue'
  import SvgIcon from '@/components/common/SvgIcon.vue'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import PieChartItem from '@/components/app/menu-2/PieChartItem.vue'
  import LayerDataTable from '@/components/app/menu-2/sub-1/LayerDataTable.vue'

  import { getSources } from '@/api/app/source'
  import { SourceGroupDTO } from '@/api/app/source/model'

  import { useMenu2Sub1Store } from '@/stores/app/menu-2/sub-1'
  import { CiamsZoneDTO } from '@/api/app/zone/model'

  const menu2Sub1Store = useMenu2Sub1Store()

  const state = menu2Sub1Store.state
  const sourceData = ref<SourceGroupDTO.Find.Result[]>([])
  const overview = computed<CiamsZoneDTO.Overview.Find.Result | undefined>(() => state.overview)

  function tagColor(itaReCd: string) {
    return state.tags?.find((tag) => tag.value === itaReCd)?.color
  }

  function getRowStyle(itaReCd: string) {
    return overview.value?.itaReCd === itaReCd ? { 'background-color': tagColor(itaReCd) } : {}
  }

  const filterByTargetId = (targetId: string) =>
    computed(() => sourceData.value.find((item) => item.targetId === targetId)?.sources)

  const source1 = filterByTargetId('E001')
  const source2 = filterByTargetId('E002')
  const source3 = filterByTargetId('E003')

  onBeforeMount(async () => {})

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
        background-color: #3ec5f4;
      }
      tr.row-type-3 {
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

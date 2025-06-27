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
              :style="{ 'background-color': tagColor(overview?.dvsType) }"
            >
              {{ overview?.dvsType }}
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="display: flex; flex-direction: column; margin-bottom: 8px">
        <table class="customTable analysis">
          <colgroup>
            <col style="" />
            <col style="" />
            <col style="" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" style="text-align: center">산업기반분석</th>
              <th scope="col" style="text-align: center">지역여건분석</th>
              <th scope="col" style="text-align: center">관리유형원칙</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; vertical-align: middle">
                {{ overview ? overview?.itaResult : '-' }}
              </td>
              <td style="text-align: center; vertical-align: middle">
                {{ overview?.locResult }}
              </td>
              <td style="text-align: center; vertical-align: middle">{{ overview?.dvsType }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="container"
        style="
          display: flex;
          flex-direction: column;
          flex: 1;
          height: 100%;
          overflow-y: hidden;
          padding: 8px;
        "
      >
        <div class="" style="flex: 1; height: 100%; overflow-y: hidden">
          <el-tabs
            v-model="activeName"
            type=""
            stretch="stretch"
            class=""
            style="overflow-y: hidden; height: 100%"
          >
            <el-tab-pane
              label="산업기반분석"
              name="Tab-A"
              style="height: 100%"
              class="customScroll"
            >
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
            </el-tab-pane>

            <el-tab-pane label="지역여건분석" name="Tab-B" style="height: 100%">
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
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialog"
      align-center
      :show-close="false"
      :append-to-body="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      class="dialog-analysis"
    >
      <AnalysisTable @drawer-change="dialogChangeListener" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import AnalysisTable from '@/views/app/menu-2/sub-3/right/AnalysisTable.vue'
  import { useMenu2Sub3Store } from 'src/stores/app/menu-2/sub-3'
  import Item from '@/components/app/menu-2/Item.vue'
  import SvgIcon from '@/components/common/SvgIcon.vue'
  import PieChartItem from '@/components/app/menu-2/PieChartItem.vue'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getSources } from '@/api/app/source'

  const menu2Sub3Store = useMenu2Sub3Store()
  const { overview } = storeToRefs(menu2Sub3Store)

  const activeName = ref<string>('Tab-A')

  const dialog = ref<boolean>(false)

  const sourceData = ref<SourceGroupDTO.Find.Result[]>([])

  const tjdwkd1 = computed(
    () => overview?.value?.itaResult === '성장' && overview?.value?.locResult === '양호',
  )
  const tjdwkd2 = computed(
    () => overview?.value?.itaResult === '유지' && overview?.value?.locResult === '양호',
  )
  const tjdwkd3 = computed(
    () => overview?.value?.itaResult === '쇠퇴' && overview?.value?.locResult === '양호',
  )
  const tjdwkd4 = computed(
    () => overview?.value?.itaResult === '성장' && overview?.value?.locResult === '불량',
  )
  const tjdwkd5 = computed(
    () => overview?.value?.itaResult === '유지' && overview?.value?.locResult === '불량',
  )
  const tjdwkd6 = computed(
    () => overview?.value?.itaResult === '쇠퇴' && overview?.value?.locResult === '불량',
  )

  const result = computed(() => (overview?.value?.locResult === '양호' ? '관리형' : '정비형'))

  function dialogChangeListener(state: boolean) {
    dialog.value = state
  }

  function tagColor(itaResult: string) {
    switch (itaResult) {
      case '산업정비형':
        return '#FFAA00'
      case '산업관리형':
        return '#8BD100'
      case '산업혁신형':
        return '#00C5FF'
      default:
        return '#ffffff'
    }
  }

  function getRowClass(dvsType: string) {
    return {
      active: overview.value?.dvsType === dvsType,
      'row-type-1': dvsType === '산업정비형' && overview.value?.dvsType === '산업정비형',
      'row-type-2': dvsType === '산업관리형' && overview.value?.dvsType === '산업관리형',
      'row-type-3': dvsType === '산업혁신형' && overview.value?.dvsType === '산업혁신형',
    }
  }

  const filterByTargetId = (targetId: string) =>
    computed(() => sourceData.value.find((item) => item.targetId === targetId)?.sources)

  const source1 = filterByTargetId('E001')
  const source2 = filterByTargetId('E002')
  const source3 = filterByTargetId('E003')
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
          background: #f5c49c;
        }
      }
    }
  }

  .btn-green {
    float: right;
    height: 28px;
    padding: 0 16px;
    border-radius: 4px;
    background: #7aaad1;
    color: #fff;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.28px;

    &:not(:disabled):hover {
      opacity: 0.8;
      transition: opacity 0.3s;
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

<style lang="scss">
  .dialog-analysis {
    width: 960px;

    .el-dialog__header {
      display: none !important;
    }

    .el-dialog__body {
      padding: 0;
      height: 100%;
    }
  }

  .el-drawer__body {
    padding: 0 !important;
  }
</style>

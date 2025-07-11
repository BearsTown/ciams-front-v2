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
              :style="{ 'background-color': tagColor(overview.mngCd) }"
            >
              {{ overview.mngType }}
            </div>
          </div>
        </div>
      </div>

      <div class="container" style="display: flex; flex-direction: column; margin-bottom: 8px">
        <table class="customTable analysis">
          <colgroup>
            <col style="width: 25%" />
            <col style="width: 25%" />
            <col style="width: 25%" />
            <col style="width: 25%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" style="text-align: center">산업기반분석</th>
              <th scope="col" style="text-align: center">지역여건분석</th>
              <th scope="col" style="text-align: center">관리유형원칙</th>
              <th scope="col" style="text-align: center">관리유형설정</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align: center; vertical-align: middle">
                {{ overview ? overview.itaResult : '-' }}
              </td>
              <td style="text-align: center; vertical-align: middle">
                {{ overview ? overview.locResult : '-' }}
              </td>
              <td style="text-align: center; vertical-align: middle">
                {{ overview ? overview.dvsType : '-' }}
              </td>
              <td style="text-align: center; vertical-align: middle">
                {{ overview ? overview.mngType : '-' }}
              </td>
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

              <div class="container" style="margin-top: 5px">
                <div class="title" style="display: flex; align-items: center; font-size: 15px">
                  <span style="flex: 1">주요도입산업</span>
                </div>

                <table class="customTable">
                  <colgroup>
                    <col style="width: 25%" />
                    <col />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col" style="text-align: center">산업분류</th>
                      <th scope="col" style="text-align: center">업종명</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="industry in info?.industries" :key="industry">
                      <tr v-for="(item, idx) in industry.list" :key="idx">
                        <td
                          v-if="idx === 0"
                          :rowspan="industry.list.length"
                          style="vertical-align: middle"
                        >
                          {{ industry.category }}
                        </td>
                        <td style="text-align: left">{{ item.industryName }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
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
            </el-tab-pane>
            <el-tab-pane label="현황도" name="Tab-C" style="height: 100%" class="customScroll">
              <template v-for="item in info?.images" :key="item">
                <template v-for="img in item?.list" :key="img">
                  <Suspense>
                    <AsyncImage :id="img.id" />
                    <template #fallback>Loading...</template>
                  </Suspense>
                </template>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div class="container customScroll" style="margin-top: 5px">
        <div class="title" style="display: flex; align-items: center; font-size: 15px">
          <span style="flex: 1">종합분석</span>
        </div>

        <table class="customTable">
          <colgroup>
            <col style="width: 30%" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" style="text-align: center">구분</th>
              <th scope="col" style="text-align: center">설명</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="desc in info?.descs" :key="desc">
              <tr v-for="(item, idx) in desc.list" :key="idx">
                <td v-if="idx === 0" :rowspan="desc.list.length" style="vertical-align: middle">
                  {{ desc.category }}
                </td>
                <td style="text-align: left">{{ item }}</td>
              </tr>
            </template>
          </tbody>
        </table>
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
  import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'

  import Item from '@/components/app/menu-2/Item.vue'
  import SvgIcon from '@/components/common/SvgIcon.vue'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'
  import PieChartItem from '@/components/app/menu-2/PieChartItem.vue'
  import AsyncImage from '@/views/app/menu-2/sub-4/right/AsyncImage.vue'
  import AnalysisTable from '@/views/app/menu-2/sub-3/right/AnalysisTable.vue'

  import { getSources } from '@/api/app/source'
  import { Info } from '@/api/app/menu-2/sub-4/model'
  import { CiamsZoneDTO } from '@/api/app/zone/model'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getMenu2Sub4Info } from '@/api/app/menu-2/sub-4'

  import { useMenu2Sub4Store } from '@/stores/app/menu-2/sub-4'

  const menu2Sub4Store = useMenu2Sub4Store()

  const state = menu2Sub4Store.state
  const dialog = ref<boolean>(false)
  const info = ref<Info>()
  const activeName = ref<string>('Tab-A')
  const sourceData = ref<SourceGroupDTO.Find.Result[]>([])
  const overview = computed<CiamsZoneDTO.Overview.Find.Result | undefined>(() => state.overview)

  function tagColor(itaReCd: string) {
    return state.tags?.find((tag) => tag.value === itaReCd)?.color
  }

  function dialogChangeListener(state: boolean) {
    dialog.value = state
  }

  const filterByTargetId = (targetId: string) =>
    computed(() => sourceData.value.find((item) => item.targetId === targetId)?.sources)

  const source1 = filterByTargetId('E001')
  const source2 = filterByTargetId('E002')
  const source3 = filterByTargetId('E003')
  const source4 = filterByTargetId('E004')
  const source5 = filterByTargetId('E005')

  watch(
    () => overview.value,
    async () => {
      if (overview.value?.zoneNo) {
        const { data } = await getMenu2Sub4Info(overview.value?.zoneNo)
        info.value = data
      } else {
        info.value = undefined
      }
    },
  )

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

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
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

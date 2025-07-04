<template>
  <PagePane :title="['산업별 분석', '산업별 종사자수']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            <p>
              - 공업지역 내 산업단지의 종사자밀도는 11.36인/ha 반면, 도시공업지역은 18.87인/ha로
              1.5배 많은 종사자가 근무하고 있어 도시공업지역을 활성화시킬 수 있는 방안 필요
            </p>
            <p>
              - 김천시는 도매 및 소매업수가 가장 많고, 공업지역과 도시공업지역에서는 제조업수가 가장
              많으며, 제조업의 종사자수가 전체 지역에서 가장 많은 비중을 차지함
            </p>
          </div>
        </div>
        <div class="center">
          <div class="left">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <span style="font-size: 12px; color: #616161"
                >※「산업발전법」 제2조에 따른 산업을 대상으로 함</span
              >
              <div style="display: flex; height: 100%">
                <v-chart class="chart" :option="chartData" autoresize />
              </div>
            </div>
          </div>

          <div class="right">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <div style="display: flex; flex-direction: column">
                <div class="header-title" style="">지역별 종사자 밀도</div>
                <div class="" style="display: flex; height: 100%">
                  <Table1 :data="density" type="emp" style="width: 70%" />
                  <v-chart class="chart" :option="densityOption" autoresize style="width: 30%" />
                </div>
              </div>

              <div
                style="
                  display: flex;
                  flex-direction: column;
                  flex: 1;
                  margin-top: 8px;
                  overflow-y: hidden;
                "
              >
                <div class="header-title" style="">산업별 현황</div>
                <Table2 group="종사자수(인)" :data="industry" :columns="columns" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import { API_INFO_CIAMS } from '@/config/config'
  import PagePane from '@/components/common/PagePane.vue'
  import VChart from 'vue-echarts'
  import Table1 from '@/components/app/menu-1/sub-1/panel/tab-B/page-4/table-1.vue'
  import Table2 from '@/components/app/menu-1/sub-1/panel/tab-B/page-4/table-2.vue'
  import { test_getMenu1_2_4Data } from '@/api/app/menu-1/sub-1/tab-b/page-4'
  import { test_getMenu1_1_2_4 } from '@/api/app/menu-1/sub-1/tab-b'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import CommonUtil from '@/utils/commonUtil'
  import Source from '@/components/common/Source.vue'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getSources } from '@/api/app/source'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()
  const cmmConfigStore = useCmmConfigStore()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '45252c84-6272-49dc-a246-62c8f581158c'

  const density = ref([])
  const industry = ref([])
  const densityOption = ref({})
  const chartData = ref({})
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  const columns = computed(() => {
    return [
      {
        prop: 'workerCnt1',
        label: `${cmmConfigStore.cmmConfigState['SGG_NAME'].confValue}`,
      },
      {
        prop: 'workerCnt2',
        label: '공업지역',
      },
      {
        prop: 'workerCnt3',
        label: '도시공업지역',
      },
    ]
  })

  onMounted(async () => {
    const { data: sourceData } = await getSources({
      category: '산업현황분석',
      targetId: 'B003',
    })

    sources.value = sourceData[0]?.sources

    density.value = await test_getMenu1_2_4Data(1)
    industry.value = await test_getMenu1_1_2_4(2)

    densityOption.value = {
      tooltip: {
        trigger: 'item',
      },
      // legend: {
      //   bottom: true,
      // },
      series: [
        {
          type: 'pie',
          radius: '90%',
          avoidLabelOverlap: false,
          data: density.value.map(({ name, empDensity }) => ({ value: empDensity, name })),
          itemStyle: {
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#fff',
          },
          label: {
            show: true,
            position: 'inside',
            formatter: '{d}%',
            color: '#fff',
            fontSize: 12,
          },
          tooltip: {
            formatter: function (params) {
              return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>
        ${params.name}: ${params.value} (${params.percent}%)`
            },
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }

    chartData.value = {
      grid: {
        top: '5%',
        left: '5%',
        right: '5%',
        containLabel: true,
      },
      legend: {
        bottom: 10,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          crossStyle: {
            color: '#999',
          },
        },
      },
      xAxis: {
        type: 'category',
        data: industry.value.map((item) => item.code),
      },
      yAxis: {
        type: 'value',
        name: '종사자수',
        position: 'left',
      },
      series: columns.value.map((column, index) => ({
        name: column.label,
        type: 'bar',
        data: industry.value.map((item) => item[column.prop]),
        tooltip: {
          valueFormatter: function (value) {
            if (value === undefined || value === null) {
              value = 0
            }
            return CommonUtil.comma(value as number) + ' 명'
          },
        },
      })),
    }
  })

  onBeforeMount(() => {})

  onActivated(() => {})
</script>

<style lang="scss"></style>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .center {
      flex: 1;
      display: flex;
      flex-direction: row;
      //overflow-y: hidden;
      overflow: hidden;
      height: 100%;
      gap: 8px;

      .left {
        width: 50%;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;
        padding: 10px;
        background: #fff;
        display: flex;
        flex-direction: column;
        //margin-left: 8px;
        border-radius: 8px;
        overflow: hidden;
      }

      .right-top {
      }

      .right-bottom {
      }
    }

    .top {
      height: 80px;
      margin-bottom: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 200px;

      padding: 10px;
      background: #fff;
      border-radius: 8px;
    }

    .customScroll {
      height: max-content;
      overflow-y: auto;
    }

    .text-wrap {
      color: #616161;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.5;
      > p {
        padding-left: 0.5em;
        text-indent: -0.6em;
      }
    }
  }

  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 5px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>

<template>
  <PagePane :title="['제조업별 분석', '제조업별 종사자수']">
    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            - 도시공업지역 전기장비제조업, 자동차 및 트레일러 제조업 순으로 종사자수가 많음 <br />
            - 지난 10년간 화학물질 및 화학제품 제조업의 증가가 가장 많으며, 자동차 및 트레일러
            제조업은 지난 10년간 사업체수와 종사자수 모두 가장 많이 감소하였음
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
              <span style="font-size: 12px; color: #616161">※제조업을 대상으로 함</span>
              <div style="display: flex; height: 100%">
                <div style="flex: 1">
                  <v-chart class="chart" :option="chartData" autoresize />
                </div>
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
              <div>
                <div class="header-title" style="">지역별 종사자 밀도</div>
                <div class="" style="display: flex">
                  <Table1 :data="density" type="emp" />
                </div>
              </div>

              <div style="display: flex; flex-direction: column; height: 100%; overflow-y: hidden">
                <div style="margin-top: 8px; overflow-y: hidden; flex: 1">
                  <div class="header-title" style="">제조업별 현황</div>
                  <Table2 :data="industry" :columns="columns" group="종사자수(명)" />
                </div>

                <div style="display: flex; flex-direction: column; flex: 1; margin-top: 8px">
                  <div class="header-title" style="">도시공업지역 제조업 10년간 종사자수 증감</div>
                  <v-chart class="chart" :option="chartData1" autoresize />
                </div>
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
  import {
    test_getMenu1_1_2_5,
    test_getMenu1_1_2_5Increase,
    test_getMenu1_2_5Data,
  } from '@/api/app/menu-1/sub-1/tab-b/page-5'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import CommonUtil from '@/utils/commonUtil'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()
  const cmmConfigStore = useCmmConfigStore()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '45252c84-6272-49dc-a246-62c8f581158c'

  const option = ref({})

  const density = ref([])
  const industry = ref([])
  const increase = ref([])
  const chartData = ref({})
  const chartData1 = ref({})

  const columns = computed(() => {
    return [
      {
        prop: 'empCnt1',
        label: `${cmmConfigStore.cmmConfigState['SGG_NAME'].confValue}`,
      },
      {
        prop: 'empCnt2',
        label: '공업지역',
      },
      {
        prop: 'empCnt3',
        label: '도시공업지역',
      },
    ]
  })

  onMounted(async () => {
    density.value = await test_getMenu1_2_5Data(1)
    industry.value = await test_getMenu1_1_2_5(2)
    increase.value = await test_getMenu1_1_2_5Increase(2)

    chartData.value = {
      legend: {
        bottom: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          crossStyle: {
            color: '#999',
          },
        },
        // formatter: function (params) {
        //   const dataIndex = params[0].dataIndex
        //   const codeItem = increase.value[dataIndex]
        //   return `${codeItem.code} (${codeItem.codeName})<br/>증감: ${codeItem.increase}`
        // },
      },
      yAxis: {
        type: 'category',
        data: industry.value.map((item) => item.code),
      },
      xAxis: {
        type: 'value',
        name: '종사자수',
        position: 'left',
      },
      series: columns.value.map((column, index) => ({
        name: column.label,
        type: 'bar',
        // yAxisIndex: index,
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

    const positiveData = increase.value.map((item) => {
      return item.increase >= 0 ? item.increase : 0
    })

    const negativeData = increase.value.map((item) => {
      return item.increase < 0 ? item.increase : 0
    })

    chartData1.value = {
      legend: {
        bottom: true,
      },
      grid: {
        top: '15%',
        left: '5%',
        right: '5%',
        bottom: '25%',
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          crossStyle: {
            color: '#999',
          },
        },
        formatter: function (params) {
          const dataIndex = params[0].dataIndex
          const codeItem = increase.value[dataIndex]
          return `${codeItem.code} (${codeItem.codeName})<br/>증감: ${codeItem.increase}`
        },
      },
      xAxis: {
        type: 'category',
        data: increase.value.map((item) => item.code),
        axisLabel: {
          interval: 0,
          rotate: 45,
        },
      },
      yAxis: {
        type: 'value',
        name: '증감',
        position: 'left',
      },
      series: [
        {
          name: '증가',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            color: '#e74c3c',
          },
          data: positiveData,
          emphasis: {
            focus: 'series',
          },
          label: {
            show: true,
            position: 'top',
            formatter: function (params) {
              return params.value > 0 ? params.value : ''
            },
          },
        },
        {
          name: '감소',
          type: 'bar',
          stack: 'total',
          itemStyle: {
            color: '#3498db',
          },
          data: negativeData,
          emphasis: {
            focus: 'series',
          },
          label: {
            show: true,
            position: 'bottom',
            formatter: function (params) {
              return params.value < 0 ? params.value : ''
            },
          },
        },
      ],
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
      overflow-y: hidden;
      height: 100%;

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
        margin-left: 8px;
        border-radius: 8px;
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

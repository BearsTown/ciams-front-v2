<template>
  <PagePane :title="['제조업별 분석', '제조업의 유형별 현황']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            <p>
              - 김천시는 가공조립형과 생활관련형 제조업수가 447개로 가장 많았으나, 김천시 종사자의
              84%에 해당하는 인력이 가공조립형, 기초소재형에 종사하고 있음
            </p>
            <p>
              - 공업지역에서 일하는 기초소재형 종사자는 김천시 기초소재형 종사자의 63%에 해당하며,
              도시공업지에서 일하는 기초소재형 종사자는 37%에 해당함
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
              <span style="font-size: 12px; color: #616161">※제조업을 대상으로 함</span>
              <div style="display: flex; height: 100%">
                <div style="flex: 1; display: flex; margin-top: 5px">
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <el-text tag="b">사업체수</el-text>
                    <div style="display: flex; flex-direction: column; height: 100%">
                      <template v-for="data in test1('corpCnt')" :key="data">
                        <div style="flex: 1">
                          <v-chart class="chart" :option="data" autoresize />
                        </div>
                      </template>
                    </div>
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: column">
                    <el-text tag="b">종사자수</el-text>
                    <div style="display: flex; flex-direction: column; height: 100%">
                      <template v-for="data in test1('empCnt')" :key="data">
                        <div style="flex: 1">
                          <v-chart class="chart" :option="data" autoresize />
                        </div>
                      </template>
                    </div>
                  </div>
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
              <div style="display: flex; flex-direction: column">
                <div style="">
                  <div class="header-title">제조업 유형별 현황</div>
                  <Table :data="industry" :columns="columns" style="margin-bottom: 5px" />
                  <span style="font-size: 13px; color: #616161"
                    >※제조업 유형분류(통계청 제조업 산업형태별 분류기준 적용)</span
                  >

                  <template v-for="(category, index) in categories" :key="index">
                    <div class="border-box-square" style="">
                      <div style="margin: 8px 0">{{ category.title }}</div>
                      <el-text>{{ category.description }}</el-text>
                    </div>
                  </template>
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

  import VChart from 'vue-echarts'

  import PagePane from '@/components/common/PagePane.vue'
  import Source from '@/components/common/Source.vue'
  import Table from '@/components/app/menu-1/sub-1/panel/tab-B/page-5/table.vue'

  import CommonUtil from '@/utils/commonUtil'
  import { API_INFO_CIAMS } from '@/config/config'

  import { getSources } from '@/api/app/source'
  import { SourceGroupDTO } from '@/api/app/source/model'
  import { test_getMenu1_1_2_5Type } from '@/api/app/menu-1/sub-1/tab-b/page-5'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'

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
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  const categories = [
    {
      title: '가공조립형',
      description:
        '금속가공제품(C25), 전자부품, 컴퓨터, 영상, 음향 및 통신장비제조(C26) 등 산업분류코드 C27-31에 해당하는 제조업',
    },
    {
      title: '기초소재형',
      description:
        '섬유제품 제조업(C13), 목재 및 나무제품제조업, 펄프 및 종이제품, 제조업(C16-17) 등 산업분류코드 C19-24에 해당하는 제조업',
    },
    {
      title: '생활관련형',
      description:
        '식료품·음료·담배 제조업(C10-12), 의약·모피 액세서리 제조업(C14-15) 등 산업분류코드 C18, C32-33에 해당하는 제조업',
    },
  ]

  const columns = computed(() => {
    return [
      {
        props: [
          {
            name: 'corpCnt1',
            label: '사업체수(개소)',
          },
          {
            name: 'empCnt1',
            label: '종사자수(명)',
          },
        ],
        label: `${cmmConfigStore.cmmConfigState['SGG_NAME'].confValue}`,
      },
      {
        props: [
          {
            name: 'corpCnt2',
            label: '사업체수(개소)',
          },
          {
            name: 'empCnt2',
            label: '종사자수(명)',
          },
        ],
        label: '공업지역',
      },
      {
        props: [
          {
            name: 'corpCnt3',
            label: '사업체수(개소)',
          },
          {
            name: 'empCnt3',
            label: '종사자수(명)',
          },
        ],
        label: '도시공업지역',
      },
    ]
  })

  onMounted(async () => {
    const { data: sourceData } = await getSources({
      category: '산업현황분석',
      targetId: 'B006',
    })

    sources.value = sourceData[0]?.sources

    industry.value = await test_getMenu1_1_2_5Type()

    chartData.value = {
      title: {
        text: '김천시',
        left: 'center',
        top: 'middle',
        textStyle: {
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: '0%',
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          top: '-10%',
          bottom: '-10%',
          radius: ['25%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 1,
          },
          label: {
            show: true, // Show labels
            position: 'inside',
            formatter: '{c}%',
            color: '#fff',
            fontSize: 12, // Optional: Adjust font size
          },

          // emphasis: {
          //   label: {
          //     show: true,
          //     fontSize: 40,
          //     fontWeight: 'bold'
          //   }
          // },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 35, name: '가공조립형' },
            { value: 30, name: '기초소재형' },
            { value: 35, name: '생활관련형' },
          ],
        },
      ],
    }
  })

  // const test1 = computed(() => {
  const test1 = (type: string) => {
    return columns.value.map((column) => {
      const prop = column.props.find((p) => p.name.startsWith(type))

      const data = CommonUtil.calculatePercentages(
        industry.value.map((data) => ({
          value: data[prop.name],
          name: data.name,
        })),
        1,
      )

      return {
        title: {
          text: column.label,
          left: 'center',
          top: 'middle',
          textStyle: {
            fontSize: 12,
          },
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          bottom: '0%',
          left: 'center',
        },
        series: [
          {
            name: '유형별 비율',
            type: 'pie',
            top: '-10%',
            bottom: '-10%',
            radius: ['25%', '60%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 1,
            },
            label: {
              show: true, // Show labels
              position: 'inside',
              formatter: '{c}%',
              color: '#fff',
              fontSize: 12, // Optional: Adjust font size
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            labelLine: {
              show: false,
            },
            // data: industry.value.map((data) => ({
            //   value: data[prop.name],
            //   name: data.name,
            // })),
            data: data.map((item) => {
              return {
                value: item.percentage,
                name: item.name,
              }
            }),
          },
        ],
      }
    })
  }

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

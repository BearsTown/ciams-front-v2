<template>
  <PagePane :title="['제조업별 분석', '제조업의 유형별 현황']">
    <template #sub>
      <Source :list="sources" />
    </template>

    <template #center>
      <div class="container">
        <div class="top customScroll">
          <div class="text-wrap">
            <template v-for="desc in descriptions" :key="desc.id">
              <p v-if="desc.description">- {{ desc.description }}</p>
            </template>
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
                      <template v-for="data in test1('workerCnt')" :key="data">
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
              <div style="display: flex; flex-direction: column; overflow: hidden">
                <div style="">
                  <div class="header-title">제조업 유형별 현황</div>
                  <StatusTable :data="statuses" :columns="columns" style="margin-bottom: 5px" />
                </div>

                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    margin-top: 8px;
                    overflow: hidden;
                  "
                >
                  <span style="font-size: 13px; color: #616161"
                    >※제조업 유형분류(통계청 제조업 산업형태별 분류기준 적용)</span
                  >

                  <div style="flex: 1" class="customScroll">
                    <table class="customTable">
                      <colgroup>
                        <col style="width: 15%" />
                        <col style="width: 85%" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th scope="col" style="text-align: center; vertical-align: middle">
                            유형
                          </th>
                          <th scope="col" style="text-align: center; vertical-align: middle">
                            제조업
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="(group, gIndex) in categoryGroups" :key="gIndex">
                          <tr>
                            <td style="text-align: center; vertical-align: middle">
                              {{ group.groupName }}
                            </td>
                            <td style="text-align: left; vertical-align: middle">
                              <template
                                v-for="(category, cIndex) in group.categories"
                                :key="cIndex"
                              >
                                {{ category.code }} - {{ category.codeName }}
                                <br v-if="cIndex < group.categories.length - 1" />
                              </template>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
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
  import { computed, onMounted, ref } from 'vue'

  import VChart from 'vue-echarts'

  import PagePane from '@/components/common/PagePane.vue'
  import Source from '@/components/common/Source.vue'
  import StatusTable from '@/components/app/basic/loc/status/panel/manufacturing/table.vue'

  import CommonUtil from '@/utils/commonUtil'

  import { SourceGroupDTO } from '@/api/app/source/model'
  import { ManufacturingDto } from '@/models/api/app/basic/loc/industry/manufacturing'
  import { getCategoryStatusInfo } from '@/api/app/basic/loc/ind-status'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { CiamsBasicLocDescription } from '@/models/api/app/basic/loc/ciams-basic-loc-description'

  const cmmConfigStore = useCmmConfigStore()

  const option = ref({})
  const chartData = ref({})
  const statuses = ref<ManufacturingDto.CategoryStatus.Status[]>([])
  const categoryGroups = ref<ManufacturingDto.CategoryStatus.CategoryGroup[]>([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])
  const descriptions = ref<CiamsBasicLocDescription[]>([])

  const columns = computed(() => {
    return [
      {
        props: [
          {
            name: 'corpCnt1Sum',
            label: '사업체수(개소)',
          },
          {
            name: 'workerCnt1Sum',
            label: '종사자수(명)',
          },
        ],
        label: `${cmmConfigStore.cmmConfigState['SGG_NAME'].confValue}`,
      },
      {
        props: [
          {
            name: 'corpCnt2Sum',
            label: '사업체수(개소)',
          },
          {
            name: 'workerCnt2Sum',
            label: '종사자수(명)',
          },
        ],
        label: '공업지역',
      },
      {
        props: [
          {
            name: 'corpCnt3Sum',
            label: '사업체수(개소)',
          },
          {
            name: 'workerCnt3Sum',
            label: '종사자수(명)',
          },
        ],
        label: '도시공업지역',
      },
    ]
  })

  onMounted(async () => {
    const { data: clsInfo } = await getCategoryStatusInfo()

    statuses.value = clsInfo.statuses
    categoryGroups.value = clsInfo.categoryGroups
    descriptions.value = clsInfo.descriptions
    sources.value = clsInfo.sources[0]?.sources
  })

  // const test1 = computed(() => {
  const test1 = (type: string) => {
    return columns.value.map((column) => {
      const prop = column.props.find((p) => p.name.startsWith(type))

      const data = CommonUtil.calculatePercentages(
        statuses.value.map((data) => ({
          value: data[prop!.name],
          name: data.groupName,
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

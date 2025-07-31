<template>
  <PagePane :title="['산업별 분석', '산업별 종사자수']">
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
                  <Table1 :data="densities" type="worker" style="width: 70%" />
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
                <Table2 group="종사자수(명)" :data="statuses" :columns="columns" />
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

  import Source from '@/components/common/Source.vue'
  import PagePane from '@/components/common/PagePane.vue'
  import Table1 from '@/components/app/basic/loc/status/panel/industrial/table-1.vue'
  import Table2 from '@/components/app/basic/loc/status/panel/industrial/table-2.vue'

  import CommonUtil from '@/utils/commonUtil'

  import { IndustrialDto } from '@/models/api/app/basic/loc/industry/industrial'
  import { CiamsBasicLocDescription } from '@/models/api/app/basic/loc/ciams-basic-loc-description'

  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getIndustrialInfo } from '@/api/app/basic/loc/ind-status'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  const cmmConfigStore = useCmmConfigStore()

  const chartData = ref({})
  const densityOption = ref({})
  const statuses = ref<IndustrialDto.Status[]>([])
  const densities = ref<IndustrialDto.Density[]>([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])
  const descriptions = ref<CiamsBasicLocDescription[]>([])

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
    const { data: industrialInfo } = await getIndustrialInfo({
      type: 'B004',
      category: '산업',
    })

    statuses.value = industrialInfo.statuses
    densities.value = industrialInfo.densities
    descriptions.value = industrialInfo.descriptions
    sources.value = industrialInfo.sources[0]?.sources

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
          data: densities.value.map(({ name, workerDensity }) => ({ value: workerDensity, name })),
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
        data: statuses.value.map((item) => item.code),
      },
      yAxis: {
        type: 'value',
        name: '종사자수',
        position: 'left',
      },
      series: columns.value.map((column, index) => ({
        name: column.label,
        type: 'bar',
        data: statuses.value.map((item) => item[column.prop]),
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

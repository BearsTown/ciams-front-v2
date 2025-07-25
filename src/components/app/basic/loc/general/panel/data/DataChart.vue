<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
    <div style="display: flex; justify-content: end">
      <el-button type="primary" size="small" @click="toggleLegend(true)">전체 켜기</el-button>
      <el-button type="primary" size="small" @click="toggleLegend(false)">전체 끄기</el-button>
    </div>
    <v-chart ref="chartComponent" class="chart" :option="option" autoresize />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  import VChart from 'vue-echarts'

  import { GeneralDataDto } from '@/models/api/app/basic/loc/general/general'

  import CommonUtil from '@/utils/commonUtil'

  const props = withDefaults(
    defineProps<{
      dataInfo: GeneralDataDto.DataDetailInfo
    }>(),
    {},
  )

  const chartComponent = ref()
  const option = ref({})

  function toggleLegend(show: boolean) {
    if (show) {
      chartComponent.value?.dispatchAction({
        type: 'legendAllSelect',
      })
    } else {
      chartComponent.value?.dispatchAction({
        type: 'legendAllSelect',
      })
      chartComponent.value?.dispatchAction({
        type: 'legendInverseSelect',
      })
    }
  }

  watch(
    () => props.dataInfo,
    (newDataInfo) => {
      if (CommonUtil.isEmpty(newDataInfo)) return

      const series = ref()

      const data = newDataInfo.data || []
      const legend = newDataInfo.chartInfo.legend
      const categories = newDataInfo.chartInfo.categories

      const totalTextLength = legend.reduce((sum, item) => sum + item.length, 0)

      if (newDataInfo?.dataTable?.pivot) {
        // const columns: GeneralDataDto.PivotColumn[] = newDataInfo?.pivotColumns?.filter(
        //   (col) => col.useAxis,
        // )

        series.value = newDataInfo.columns
          .filter((col) => col.useAxis)
          .map((col) => {
            const name = col.label

            // pivotColumns에서 useAxis가 false인 컬럼을 찾아서 해당 컬럼 이름을 가져옴
            const identifierColumn = newDataInfo.pivotColumns.find((pivotCol) => !pivotCol.useAxis)
            const identifierKey = identifierColumn ? identifierColumn.name : 'A0' // 기본값으로 A0 사용

            // 해당 이름을 사용하여 데이터를 찾음
            const dataRow = newDataInfo.data.find((row) => row[identifierKey] === name)

            const data = newDataInfo.pivotColumns
              .filter((pivotCol) => pivotCol.useAxis)
              .map((pivotCol) => {
                const value = dataRow ? dataRow[pivotCol.name] : null
                return value !== null && value !== undefined ? Number(value) : null
              })

            return {
              name: name,
              type: col.seriesType,
              data: data,
              symbolSize: 7,
            }
          })
      } else {
        const columns = newDataInfo.columns || []

        series.value = columns
          .filter((col) => col.useAxis)
          .map((col) => ({
            name: col.label,
            type: col.seriesType === 'stack' ? 'bar' : col.seriesType,
            stack: col.seriesType === 'stack' ? 'total' : '',
            // label: {
            //   show: true,
            //   position: col.seriesType === 'stack' ? 'inside' : 'top',
            // },
            data: data.map((item) => item[col.name]),
          }))
      }

      // ECharts configuration
      option.value = {
        color: [
          '#5470c6',
          '#91cc75',
          '#fac858',
          '#ee6666',
          '#73c0de',
          '#3ba272',
          '#fc8452',
          '#9a60b4',
          '#ea7ccc',
          '#b4b4b4',
          '#2a9d8f',
          '#e76f51',
          '#f4a261',
          '#7209b7',
          '#f72585',
          '#06d6a0',
          '#ffba08',
          '#4d908e',
          '#ef476f',
          '#118ab2',
          '#ffd166',
          '#6b7280',
          '#ff006e',
          '#83c5be',
          '#606c38',
        ],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
            snap: true,
          },
        },
        dataZoom: [
          {
            type: 'inside',
          },
        ],
        grid: {
          top: '5%',
          left: '5%',
          right: '5%',
          bottom: legend.length > 15 && totalTextLength > 150 ? '30%' : '15%',
          containLabel: true,
        },
        legend: {
          data: legend,
          // type: 'scroll',
          bottom: '10',
        },
        xAxis: {
          type: 'category',
          data: categories,
        },
        yAxis: {
          type: 'value',
          // name: '면적 (천㎡)',
        },
        series,
      }
    },
    { immediate: true },
  )
</script>

<style lang="scss" scoped>
  .header-title {
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
</style>

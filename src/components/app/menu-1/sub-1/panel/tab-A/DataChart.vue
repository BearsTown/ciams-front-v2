<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref, watch } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import VChart from 'vue-echarts'
  import CommonUtil from '@/utils/commonUtil'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()

  const props = withDefaults(
    defineProps<{
      dataInfo: object
      // data: any[]
      // columns: any[]
    }>(),
    {},
  )

  const option = ref({})

  watch(
    () => props.dataInfo,
    (newDataInfo) => {
      if (CommonUtil.isEmpty(newDataInfo)) return

      const columns = ref([])
      const series = ref()

      const data = newDataInfo.data || []
      const legend = newDataInfo.chart.legend
      const categories = newDataInfo.chart.categories

      if (newDataInfo?.statusData?.pivot) {
        columns.value = newDataInfo?.pivotColumns?.filter((col) => col.useAxis)

        // const filterDataByAxis = function (columns, pivotColumns, data) {
        //   // pivotColumns에서 useAxis가 false인 항목의 name을 key로 사용
        //   const key = pivotColumns.find((pivotCol) => pivotCol.useAxis === false)?.name || 'A0'
        //
        //   // columns에서 useAxis가 true인 레이블 목록 추출
        //   const validLabels = columns.filter((col) => col.useAxis === true).map((col) => col.label)
        //
        //   // pivotColumns에서 useAxis가 true인 키 목록 추출
        //   const validPivotKeys = pivotColumns
        //     .filter((pivotCol) => pivotCol.useAxis === true)
        //     .map((pivotCol) => pivotCol.name)
        //
        //   // 데이터 필터링
        //   return data
        //     .filter((item) => validLabels.includes(item[key])) // columns의 useAxis가 true인 레이블만 포함
        //     .map((item) => {
        //       // pivotColumns의 useAxis가 true인 키만 포함된 새로운 객체 생성
        //       const filteredItem = { [key]: item[key] }
        //       validPivotKeys.forEach((pivotKey) => {
        //         if (item[pivotKey] !== undefined && item[pivotKey] !== null) {
        //           filteredItem[pivotKey] = item[pivotKey]
        //         }
        //       })
        //       return filteredItem
        //     })
        // }
        //
        // const filteredData = filterDataByAxis(
        //   newDataInfo.columns,
        //   newDataInfo.pivotColumns,
        //   newDataInfo.data,
        // )

        const filterDataByAxis = function (columns, pivotColumns, data) {
          // Input validation
          if (!Array.isArray(columns) || !Array.isArray(pivotColumns) || !Array.isArray(data)) {
            console.error('Invalid input: columns, pivotColumns, and data must be arrays')
            return {}
          }

          // pivotColumns에서 useAxis가 false인 항목의 name을 key로 사용
          const key = pivotColumns.find((pivotCol) => pivotCol.useAxis === false)?.name || 'A0'

          // columns에서 useAxis가 true인 레이블 목록 추출
          const validLabels = columns.filter((col) => col.useAxis === true).map((col) => col.label)

          // pivotColumns에서 useAxis가 true인 키 목록 추출 (순서 유지)
          const validPivotKeys = pivotColumns
            .filter((pivotCol) => pivotCol.useAxis === true)
            .map((pivotCol) => pivotCol.name)

          // validPivotKeys가 비어있으면 빈 객체 반환
          if (validPivotKeys.length === 0) {
            console.warn('No pivot columns with useAxis === true found')
            return {}
          }

          // 데이터 필터링
          const filteredData = data.filter((item) => item && validLabels.includes(item[key]))

          // 결과 객체 생성
          const result = {}
          validPivotKeys.forEach((pivotKey) => {
            result[pivotKey] = filteredData.map((item) => item[pivotKey])
          })

          return result
        }

        const filteredData = filterDataByAxis(
          newDataInfo.columns,
          newDataInfo.pivotColumns,
          newDataInfo.data,
        )

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
            }
          })
      } else {
        columns.value = newDataInfo.columns || []

        series.value = columns.value
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
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow',
          },
        },
        dataZoom: [
          {
            type: 'inside',
          },
        ],
        grid: {
          top: '10%',
          // left: '5%',
          // right: '5%',
          bottom: '15%',
          containLabel: false,
        },
        legend: {
          data: legend,
          // type: 'scroll',
          bottom: 'bottom',
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

  onMounted(async () => {})

  onBeforeMount(() => {})

  onActivated(() => {})
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

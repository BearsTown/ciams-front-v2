<template>
  <div class="detail">
    <el-tabs
      tab-position="top"
      style="flex: 0 0 auto"
      v-model="year"
      @tab-change="tabChangeListener"
    >
      <el-tab-pane
        v-for="data in store.years"
        :label="`${data.title}`"
        :name="data.id"
        :key="data.id"
        class="customScroll scrollX"
      />
    </el-tabs>

    <div class="top">
      <div style="display: flex; padding-bottom: 5px">
        <el-text style="margin-right: 5px">지도</el-text>
        <el-switch size="small" v-model="store.layerVisible" :disabled="!store.getSelectDetail()" />
      </div>

      <el-table
        :data="filteredTableData"
        size="small"
        :show-header="true"
        show-summary
        style="z-index: 0"
        empty-text="데이터가 없습니다."
        scrollbar-always-on
        height="260"
        max-height="260"
        border
        :summary-method="getSummaries"
        :cell-style="getCellStyle"
      >
        <el-table-column label="범례" align="center" width="50" class-name="legend">
          <template #default="{ row: { color } }">
            <div :style="{ width: '15px', height: '15px', backgroundColor: color }"></div>
          </template>
        </el-table-column>
        <el-table-column label="구분" align="center">
          <template #default="{ row: { label } }">
            {{ label }}
          </template>
        </el-table-column>
        <template v-for="(item, index) in state.attributes" :key="index">
          <el-table-column :label="item.label" align="center">
            <el-table-column
              :label="item.unit"
              align="right"
              header-align="center"
              :prop="`${item.name}.value`"
            >
              <template #default="{ row: { data } }">
                {{
                  data?.[item.name].value === 0 ? '-' : CommonUtil.comma(data?.[item.name].value)
                }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="item.useRatio"
              label="비율(%)"
              align="right"
              header-align="center"
              :prop="`${item.name}.ratio`"
            >
              <template #default="{ row: { data } }">
                {{ data?.[item.name].ratio === 0 ? '0.0' : data?.[item.name].ratio }}
              </template>
            </el-table-column>
          </el-table-column>
        </template>
      </el-table>
    </div>

    <div class="bottom">
      <DataChart :data="filteredChartData" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { VNode } from 'vue'
  import { computed, h, ref, watch } from 'vue'
  import type { TableColumnCtx } from 'element-plus'

  import DataChart from '@/components/app/basic/urban/DataChart.vue'

  import CommonUtil from '@/utils/commonUtil'
  import { useBasicUrbanInstanceStore } from '@/stores/app/basic/urban/common'
  import { MapType } from '@/enums/mapEnum'

  interface SummaryMethodProps<T = any> {
    columns: TableColumnCtx<T>[]
    data: T[]
  }

  const props = withDefaults(
    defineProps<{
      mapType: MapType
    }>(),
    {},
  )
  const store = useBasicUrbanInstanceStore(props.mapType)

  const state = store.state

  const year = ref()

  const filteredTableData = computed(() => {
    return store.getSelectDetail()?.tableData?.filter((row) => row.visible)
  })

  const filteredChartData = computed(() => {
    return store.getSelectDetail()?.chartData
  })

  function tabChangeListener(year) {
    store.updateYear(year)
  }

  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param
    const sums: (string | VNode)[] = []
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: {} }, ['합계'])
        return
      }

      if (CommonUtil.isEmpty(column.property)) {
        return
      }

      const values = data.map((item) => {
        const value = getNestedValue(item.data, column.property)
        return value !== undefined ? Number(value) : 0 // 기본값 설정
      })

      if (!values.every((value) => Number.isNaN(value))) {
        const total = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        sums[index] = CommonUtil.comma(total.toFixed(0))
      }
    })

    return sums
  }

  const getNestedValue = (obj, path) => {
    try {
      return path.split('.').reduce((current, key) => current && current[key], obj)
    } catch (error) {
      console.error(`Error accessing ${path}:`, error)
      return undefined
    }
  }

  const getCellStyle = ({ row, column }) => {
    if (column.label === '범례') {
      return {
        'place-items': 'center',
      }
    }
  }

  watch(
    () => state.activeYear?.id,
    (newValue) => {
      year.value = newValue
    },
  )
</script>

<style scoped lang="scss">
  :deep(.el-tabs__header) {
    margin-bottom: 5px;
  }

  .detail {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: #fff;
    border-radius: 8px;

    .top {
      //height: auto;
      //max-height: 30%;
      //flex: 1;
      flex: 0 1 auto;
      //overflow: auto;
      //overflow-y: scroll;
    }

    .bottom {
      height: 65%;
      flex: 1 1 auto;
      overflow-y: auto;
      //height: 100%;
    }
  }
</style>

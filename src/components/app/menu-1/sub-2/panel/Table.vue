<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <span class="table-title" v-if="!CommonUtil.isEmpty(title)">{{ title }}</span>

    <Empty v-if="CommonUtil.isEmpty(records)" style="flex: 1; height: 100%; margin: 10px" />

    <el-table
      v-else
      ref="recordTableRef"
      :data="records"
      size="small"
      :show-header="true"
      show-summary
      :row-class-name="rowCellStyle"
      header-cell-class-name="header-cell"
      :summary-method="getSummaries"
      style="height: 100%; z-index: 0"
      empty-text="데이터가 없습니다."
      scrollbar-always-on
      border
    >
      <el-table-column label="구분" prop="layer" align="left" />
      <el-table-column label="면적()" prop="area" width="80px" align="center" />
      <el-table-column label="비율" prop="percent" width="55px" align="center" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import type { VNode } from 'vue'
  import { h } from 'vue'
  import type { TableColumnCtx } from 'element-plus'

  import CommonUtil from '@/utils/commonUtil'

  const props = withDefaults(
    defineProps<{
      title: string
      records: object[]
    }>(),
    {
      title: '',
      records: () => {
        return []
      },
    },
  )

  interface Product {
    id: string
    name: string
    layer: string
    area: number
    percent: number
  }

  interface SummaryMethodProps<T = Product> {
    columns: TableColumnCtx<T>[]
    data: T[]
  }

  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param
    const sums: (string | VNode)[] = []
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', ['합계'])
        return
      }
      const values = data.map((item) => Number(item[column.property]))
      if (!values.every((value) => Number.isNaN(value))) {
        // sums[index] = `$ ${values.reduce((prev, curr) => {
        sums[index] = `${values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)}`
      } else {
        sums[index] = 'N/A'
      }
    })

    return sums
  }

  function rowCellStyle({ row, rowIndex }) {
    // if (row.label === '합계') {
    //   return 'total-row'
    // }

    if (row.disabled) {
      return 'disabled-row'
    }

    return 'default-row'
  }
</script>

<style scoped lang="scss">
  .border-box-round {
    border: none;
    padding: 0;
    background: #fff;
    border-radius: 8px;
  }

  :deep(.inside-collapse) {
    > div {
      .title {
        font-size: 13px;
        font-weight: normal;
      }
    }
  }

  .table-title {
    color: #212121;
    font-size: 12px;
    padding-bottom: 5px;
  }

  .summary {
    th {
      font-weight: normal;
    }
    thead th,
    tbody th {
      background: #f4f4f4;
    }
  }

  :deep(.header-cell) {
    font-weight: 600;
    color: #424242;
    background-color: #f4f4f4 !important;
    text-align: center !important;
  }
</style>

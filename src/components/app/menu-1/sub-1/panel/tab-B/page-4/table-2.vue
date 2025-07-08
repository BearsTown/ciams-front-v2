<template>
  <el-table
    size="small"
    :data="props.data"
    border
    :show-header="true"
    style="height: 100%; z-index: 0"
    empty-text="데이터가 없습니다."
    :show-summary="true"
    scrollbar-always-on
    :summary-method="getSummaries"
  >
    <el-table-column label="구분" align="center">
      <el-table-column prop="code" align="center" width="50" />
      <el-table-column prop="codeName" align="center" width="250" />
    </el-table-column>
    <el-table-column :label="props.group" align="center">
      <el-table-column
        v-for="column in props.columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        align="right"
        header-align="center"
      >
        <template #default="{ row }">
          {{
            row[column.prop] === 0 || row[column.prop] === undefined
              ? '-'
              : CommonUtil.comma(row[column.prop])
          }}
        </template>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import { h, onActivated, onBeforeMount, onMounted, type VNode } from 'vue'

  import type { TableColumnCtx } from 'element-plus'

  import CommonUtil from '@/utils/commonUtil'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()
  const cmmConfigStore = useCmmConfigStore()

  // const columns = computed(() => {
  //   return [
  //     {
  //       prop: 'corpCnt1',
  //       label: `${cmmConfigStore.cmmConfigState['SGG_NAME'].confValue}`,
  //     },
  //     {
  //       prop: 'corpCnt2',
  //       label: '공업지역',
  //     },
  //     {
  //       prop: 'corpCnt3',
  //       label: '도시공업지역',
  //     },
  //   ]
  // })

  const props = withDefaults(
    defineProps<{
      data: []
      columns: []
      group: string
    }>(),
    {},
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

  function rowCellStyle({ row, rowIndex }) {
    // if (row.label === '합계') {
    //   return 'total-row'
    // }

    if (row.disabled) {
      return 'disabled-row'
    }

    return 'default-row'
  }

  onMounted(async () => {})

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
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>

<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div style="margin-bottom: 5px; display: flex; justify-content: flex-end">
      <el-text v-if="unitDisplay">{{ unitDisplay }}</el-text>
    </div>
    <el-table
      size="small"
      :data="tableData"
      style="height: 100%; z-index: 0"
      empty-text="데이터가 없습니다."
      :show-header="true"
      scrollbar-always-on
      border
    >
      <el-table-column
        :label="tableColumns[0]?.label"
        align="center"
        :prop="`${tableColumns[0]?.name}`"
        :width="calculateColumnWidth()"
        fixed
      />
      <template v-for="(col, index) in tableColumns" :key="index">
        <el-table-column
          v-if="index > 0"
          :label="col.label"
          align="right"
          header-align="center"
          :prop="`${col.name}`"
        >
          <template #header>
            <span style="text-align: center; display: inline-block"
              >{{ getColumnLabel(col) }}
            </span>
          </template>
          <template #default="{ row }">
            {{ formatValue(row, col) }}
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  import CommonUtil from '@/utils/commonUtil'

  import { GeneralDataDto } from '@/models/api/app/basic/loc/general/general'

  const props = withDefaults(
    defineProps<{
      dataInfo: GeneralDataDto.DataDetailInfo
    }>(),
    {},
  )

  const dataColumns = ref<GeneralDataDto.DataColumn[]>([])
  const tableColumns = ref<GeneralDataDto.DataColumn[] | GeneralDataDto.PivotColumn[]>([])
  const tableData = ref<{ [key: string]: any }[]>([])

  const units = computed(() => {
    const units = dataColumns.value
      .map((col) => col.unit)
      .filter((unit) => unit && unit.trim() !== '')
    return [...new Set(units)]
  })

  const unitDisplay = computed(() => {
    if (units.value.length > 0) {
      return `(단위: ${units.value.join(', ')})`
    }
    return ''
  })

  const getColumnLabel = (column) => {
    return column.label
    // return column.unit ? `${column.label} (${column.unit})` : column.label
  }

  function formatValue(row, column) {
    const value = row[column.name]
    if (CommonUtil.isEmpty(value)) return '-'
    if (['INTEGER', 'DOUBLE'].includes(column.dataType)) {
      return CommonUtil.comma(value)
    }
    return value
  }

  const maxDataLength = ref()
  // 컬럼 너비 계산 함수
  const calculateColumnWidth = () => {
    const charWidth = 10
    const padding = 20 // 패딩 및 여백 추가
    return maxDataLength.value * charWidth + padding
  }

  watch(
    () => props.dataInfo,
    (newDataInfo) => {
      dataColumns.value = newDataInfo.columns || []

      if (newDataInfo?.dataTable?.pivot) {
        tableColumns.value = newDataInfo.pivotColumns || []

        maxDataLength.value = Math.max(...dataColumns.value.map((row) => row.label.length))
      } else {
        tableColumns.value = newDataInfo.columns || []

        maxDataLength.value = Math.max(
          ...newDataInfo.data.map((item) => newDataInfo.columns[0].name.length),
        )
      }

      tableData.value = newDataInfo.data || []
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

  :deep(.el-table th.el-table-fixed-column--left) {
    background-color: var(--el-fill-color-light);
  }
</style>

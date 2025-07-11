<template>
  <el-table
    size="small"
    :data="data"
    border
    :show-header="true"
    style="height: 100%; z-index: 0"
    empty-text="데이터가 없습니다."
    scrollbar-always-on
  >
    <el-table-column label="구분" prop="name" align="center" />
    <el-table-column label="면적(㎢)" prop="area" align="right" header-align="center">
      <template #default="{ row }">
        {{ formatValue(row?.area.toFixed(2)) }}
      </template>
    </el-table-column>
    <el-table-column
      v-if="type === 'corp'"
      label="사업체수(개)"
      prop="corpCnt"
      align="right"
      header-align="center"
    >
      <template #default="{ row }">
        {{ formatValue(row?.corpCnt) }}
      </template>
    </el-table-column>
    <el-table-column
      v-if="type === 'emp'"
      label="종사자수(명)"
      prop="empCnt"
      align="right"
      header-align="center"
    >
      <template #default="{ row }">
        {{ formatValue(row?.empCnt) }}
      </template>
    </el-table-column>
    <el-table-column :label="density.label" prop="density" align="right" header-align="center">
      <template #default="{ row }">
        {{ formatValue(row?.[density.column]) }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted } from 'vue'

  import CommonUtil from '@/utils/commonUtil'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const props = withDefaults(
    defineProps<{
      data: []
      type: 'corp' | 'emp'
    }>(),
    {},
  )

  const density = computed(() => {
    if (props.type === 'corp') {
      return {
        label: '사업체밀도(개/ha)',
        column: 'corpDensity',
      }
    } else {
      return {
        label: '종사자밀도(인/ha)',
        column: 'empDensity',
      }
    }
  })

  function formatValue(value) {
    if (CommonUtil.isEmpty(value)) return '-'
    return CommonUtil.comma(value)
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

  :deep(th.el-table__cell) {
    background-color: var(--el-fill-color-light);
  }
</style>

<template>
  <el-table
    :data="data"
    size="small"
    style="height: 100%; z-index: 0"
    empty-text="데이터가 없습니다."
    :show-header="true"
    :cell-style="cellStyle"
    scrollbar-always-on
    border
  >
    <el-table-column label="업종" align="center" fixed>
      <el-table-column label="코드" align="center" width="55px">
        <template #default="{ row }"> {{ row?.tcode }}{{ row?.clsCode }} </template>
      </el-table-column>
      <el-table-column label="산업내용" prop="insNm" align="center" min-width="290px" />
    </el-table-column>
    <el-table-column label="산업입지계수(LQ)" align="center">
      <el-table-column label="분석값" prop="lqValue" align="right" width="80px" sortable>
        <template #header>
          <span style="text-align: center; display: inline-block">분석값</span></template
        >
        <template #default="{ row: { lqValue } }">
          {{ Number.isFinite(lqValue) ? lqValue?.toFixed(1) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="분류" prop="lqClass" align="center" width="80px" />
    </el-table-column>
    <el-table-column label="고용성장률(Growth)" align="center">
      <el-table-column label="분석값" prop="grValue" align="right" width="80px" sortable>
        <template #header>
          <span style="text-align: center; display: inline-block">분석값</span></template
        >
        <template #default="{ row: { grValue } }">
          {{ Number.isFinite(grValue) ? CommonUtil.comma(grValue?.toFixed(1)) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="분류" prop="grClass" align="center" width="80px" />
    </el-table-column>
    <el-table-column label="지역할당효과(RS)" align="center" width="80px">
      <el-table-column label="분석값" prop="rsValue" align="right" width="80px" sortable>
        <template #header>
          <span style="text-align: center; display: inline-block">분석값</span></template
        >
        <template #default="{ row: { rsValue } }">
          {{ Number.isFinite(rsValue) ? CommonUtil.comma(rsValue?.toFixed(1)) : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="분류" prop="rsClass" align="center" width="80px" />
    </el-table-column>
    <el-table-column label="ITA분석" prop="itaRec" align="center" width="100px" />
    <el-table-column label="LQ분석" prop="lqRec" align="center" width="100px" />
    <el-table-column label="사업체수" prop="corpCnt" align="right" width="90px" sortable>
      <template #header>
        <span style="text-align: center; display: inline-block">사업체수</span></template
      >
      <template #default="{ row: { corpCnt } }">
        {{ Number.isFinite(corpCnt) ? CommonUtil.comma(corpCnt) : '-' }}
      </template>
    </el-table-column>
    <el-table-column label="종사자수" prop="workerCnt" align="right" width="90px" sortable>
      <template #header>
        <span style="text-align: center; display: inline-block">종사자수</span></template
      >
      <template #default="{ row: { workerCnt } }">
        {{ Number.isFinite(workerCnt) ? CommonUtil.comma(workerCnt) : '-' }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted } from 'vue'
  import { ItaResultData } from '@/api/app/menu-1/sub-1/tab-c/model'
  import CommonUtil from '@/utils/commonUtil'

  const props = withDefaults(
    defineProps<{
      data?: ItaResultData[]
    }>(),
    {
      data: () => [],
    },
  )

  const top5corp = computed(() =>
    [...props.data]
      .sort((a, b) => b.corpCnt - a.corpCnt)
      .slice(0, 5)
      .map((item) => item.corpCnt),
  )

  const top5worker = computed(() =>
    [...props.data]
      .sort((a, b) => b.workerCnt - a.workerCnt)
      .slice(0, 5)
      .map((item) => item.workerCnt),
  )

  const cellStyle = ({ row, column }) => {
    if (column.property === 'corpCnt' && top5corp.value.includes(row.corpCnt)) {
      return {
        color: 'blue',
        fontWeight: 'bold',
      }
    } else if (column.property === 'workerCnt' && top5worker.value.includes(row.workerCnt)) {
      return {
        color: 'red',
        fontWeight: 'bold',
      }
    }
    return {}
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
      height: 0px;
      display: flex;
      flex-direction: row;

      .left {
        width: 100%;
        height: 100%;

        padding: 5px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;

        padding: 10px;
        background: #fff;
        margin-left: 8px;
        border-radius: 8px;
      }
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 150px;

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

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>

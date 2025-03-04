<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <span class="table-title" v-if="!CommonUtil.isEmpty(title)">{{ title }}</span>

    <table class="customTable">
      <colgroup>
        <col />
        <col width="80" />
        <col width="55" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" style="text-align: center">구분</th>
          <th scope="col" style="text-align: center">면적(㎢)</th>
          <th scope="col" style="text-align: center">비율(%)</th>
        </tr>
      </thead>
    </table>

    <Empty v-if="CommonUtil.isEmpty(records)" style="flex: 1; height: 100%; margin: 10px" />

    <el-table
      v-else
      ref="recordTableRef"
      :data="records"
      size="small"
      :show-header="false"
      style="height: 100%; z-index: 0"
      empty-text="데이터가 없습니다."
      scrollbar-always-on
    >
      <el-table-column label="구분" prop="layer" align="center" />
      <el-table-column label="면적" prop="area" width="80px" align="center" />
      <el-table-column label="비율" prop="percent" width="55px" align="center" />
    </el-table>

    <table class="customTable summary">
      <colgroup>
        <col />
        <col width="80" />
        <col width="55" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" style="text-align: center">합계</th>
          <th scope="col" style="text-align: center">1,005.43</th>
          <th scope="col" style="text-align: center">100.0</th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script setup lang="ts">
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
</style>

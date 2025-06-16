<template>
  <div class="urbanInfo active">
    <div class="container" style="height: 100%">
      <el-table
        size="small"
        :data="tableData"
        style="height: 100%; z-index: 0"
        empty-text="데이터가 없습니다."
        scrollbar-always-on
        show-summary
      >
        <el-table-column label="산업코드" prop="clsTcode" width="60px" align="center" />
        <el-table-column label="산업분류" prop="clsCcode" width="60px" align="center" />
        <el-table-column label="산업명" prop="clsName" min-width="250px" align="center" />
        <el-table-column label="2011년 현황" align="center">
          <el-table-column label="사업체수" prop="pastCorpCnt" width="" align="center" />
          <el-table-column label="종사자수" prop="pastWorkerCnt" width="" align="center" />
          <el-table-column label="평균종사자" prop="pastWorkerAvgCnt" width="" align="center" />
        </el-table-column>
        <el-table-column label="2021년 현황" align="center">
          <el-table-column label="사업체수" prop="baseCorpCnt" width="" align="center" />
          <el-table-column label="종사자수" prop="baseWorkerCnt" width="" align="center" />
          <el-table-column label="평균종사자" prop="baseWorkerAvgCnt" width="" align="center" />
        </el-table-column>
        <el-table-column label="산업기반분석" align="center">
          <el-table-column label="LQ" prop="lq" width="" align="center" />
          <el-table-column label="GROWTH" prop="growth" width="" align="center" />
          <el-table-column label="RS" prop="rs" width="" align="center" />
          <el-table-column label="ITA분석" prop="itaResult" width="" align="center" />
          <el-table-column label="LQ분석" prop="lqResult" width="" align="center" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  import Item from '@/components/app/menu-2/Item.vue'
  import Table from '@/components/app/menu-1/sub-1/left/Table.vue'

  import { useMenu2Sub1Store } from '@/stores/app/menu-2/sub-1'
  import commonUtil from '@/utils/commonUtil'

  const menu2Sub1Store = useMenu2Sub1Store()
  const { overview } = storeToRefs(menu2Sub1Store)

  const tableData = ref<any[]>([])
  tableData.value = [
    {
      clsTcode: 'C',
      clsCcode: '179',
      clsName: '기타 종이 및 판지 제품 제조업',
      pastCorpCnt: 1,
      pastWorkerCnt: 2,
      pastWorkerAvgCnt: 2,
      baseCorpCnt: 1,
      baseWorkerCnt: 2,
      baseWorkerAvgCnt: 2,
      lq: 9.1,
      growth: 17,
      rs: -113.5,
      itaResult: '특화성장산업',
      lqResult: '초기반산업',
    },
  ]

  onBeforeMount(() => {})

  onMounted(async () => {})

  defineExpose({})
</script>

<style scoped lang="scss">
  .title {
    font-size: 17px;
    padding-bottom: 10px;
  }

  .analysis {
    tbody {
      tr.active {
        td {
          background: #f5c49c;
        }
      }
    }
  }
</style>

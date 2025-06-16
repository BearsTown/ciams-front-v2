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
        <el-table-column label="산업코드" prop="tcode" width="60px" align="center" fixed />
        <el-table-column label="산업분류" prop="clsCode" width="60px" align="center" fixed />
        <el-table-column label="산업명" prop="insNm" min-width="250px" align="center" fixed />
        <el-table-column :label="overview ? `${overview.pastYear}년 현황` : ''" align="center">
          <el-table-column width="" align="right">
            <template #header>
              <span style="width: 100%; text-align: center; display: inline-block"
                >사업체수</span
              ></template
            >
            <template #default="{ row: { pastCorpCnt } }">
              {{
                Number.isFinite(pastCorpCnt) && pastCorpCnt !== 0
                  ? CommonUtil.comma(pastCorpCnt)
                  : '-'
              }}
            </template>
          </el-table-column>
          <el-table-column width="" align="right">
            <template #header>
              <span style="width: 100%; text-align: center; display: inline-block"
                >종사자수</span
              ></template
            >
            <template #default="{ row: { pastEmpCnt } }">
              {{
                Number.isFinite(pastEmpCnt) && pastEmpCnt !== 0 ? CommonUtil.comma(pastEmpCnt) : '-'
              }}
            </template>
          </el-table-column>
          <el-table-column width="" align="right">
            <template #header>
              <span style="width: 100%; text-align: center; display: inline-block"
                >평균종사자</span
              ></template
            >
            <template #default="{ row: { pastEmpAvg } }">
              {{
                Number.isFinite(pastEmpAvg) && pastEmpAvg !== 0 ? CommonUtil.comma(pastEmpAvg) : '-'
              }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="overview ? `${overview.baseYear}년 현황` : ''" align="center">
          <el-table-column label="사업체수" prop="baseCorpCnt" width="" align="center" />
          <el-table-column label="종사자수" prop="baseEmpCnt" width="" align="center" />
          <el-table-column label="평균종사자" prop="baseEmpAvg" width="" align="center" />
        </el-table-column>
        <el-table-column label="산업기반분석" align="center">
          <el-table-column label="LQ" prop="lqValue" width="" align="center" />
          <el-table-column label="GROWTH" prop="grValue" width="" align="center" />
          <el-table-column label="RS" prop="rsValue" width="" align="center" />
          <el-table-column label="ITA분석" prop="itaRec" width="" align="center" />
          <el-table-column label="LQ분석" prop="lqRec" width="" align="center" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useMenu2Sub1Store } from '@/stores/app/menu-2/sub-1'
  import CommonUtil from '@/utils/commonUtil'
  import { getByZoneNoItaResultDatas } from '@/api/app/menu-2/sub-1'

  const menu2Sub1Store = useMenu2Sub1Store()
  const { overview } = storeToRefs(menu2Sub1Store)

  const tableData = ref<any[]>([])

  watch(overview, async () => {
    if (CommonUtil.isEmpty(overview.value)) {
      tableData.value = []
    } else {
      const { data } = await getByZoneNoItaResultDatas(overview.value!.zoneNo)
      tableData.value = data
    }
  })

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

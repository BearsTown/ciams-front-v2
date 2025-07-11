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
        :summary-method="getSummaries"
      >
        <el-table-column label="산업코드" prop="tcode" width="60px" align="center" fixed />
        <el-table-column label="산업분류" prop="clsCode" width="60px" align="center" fixed />
        <el-table-column label="산업명" prop="insNm" min-width="250px" align="center" fixed />

        <template v-for="(column, index) in columns" :key="index">
          <el-table-column
            v-if="column.children"
            :label="overview ? `${overview[column.labelKey]}년 현황` : ''"
            align="center"
          >
            <el-table-column
              v-for="(subColumn, subIndex) in column.children"
              :key="subIndex"
              :width="subColumn.width"
              :align="subColumn.align"
              :prop="subColumn.prop"
            >
              <template #header>
                <span style="width: 100%; text-align: center; display: inline-block">
                  {{ subColumn.label }}
                </span>
              </template>
              <template #default="{ row }">
                {{
                  Number.isFinite(row[subColumn.prop]) && row[subColumn.prop] !== 0
                    ? CommonUtil.comma(row[subColumn.prop])
                    : '-'
                }}
              </template>
            </el-table-column>
          </el-table-column>
        </template>

        <el-table-column label="산업기반분석" align="center">
          <template v-for="(column, index) in itaColumns" :key="index">
            <el-table-column :label="column.label" :align="column.align" :prop="column.prop">
              <template #header>
                <span style="width: 100%; text-align: center; display: inline-block">
                  {{ column.label }}
                </span>
              </template>
              <template #default="{ row }">
                {{
                  Number.isFinite(row[column.prop]) && row[column.prop] !== 0
                    ? CommonUtil.comma(row[column.prop])
                    : '-'
                }}
              </template>
            </el-table-column>
          </template>

          <el-table-column label="ITA분석" prop="itaRec" width="90" align="center" />
          <el-table-column label="LQ분석" prop="lqRec" width="" align="center" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, h, onBeforeMount, onMounted, ref, type VNode, watch } from 'vue'
  import type { TableColumnCtx } from 'element-plus'

  import CommonUtil from '@/utils/commonUtil'

  import { getByZoneNoItaResultDatas } from '@/api/app/menu-2/sub-1'

  import { useMenu2Sub1Store } from '@/stores/app/menu-2/sub-1'
  import { CiamsZoneDTO } from '@/api/app/zone/model'

  interface SummaryMethodProps<T = any> {
    columns: TableColumnCtx<T>[]
    data: T[]
  }

  const menu2Sub1Store = useMenu2Sub1Store()

  const state = menu2Sub1Store.state
  const tableData = ref<any[]>([])
  const overview = computed<CiamsZoneDTO.Overview.Find.Result | undefined>(() => state.overview)

  const columns = ref([
    {
      labelKey: 'pastYear',
      children: [
        { label: '사업체수', prop: 'pastCorpCnt', width: '', align: 'right', calc: 'SUM' },
        { label: '종사자수', prop: 'pastEmpCnt', width: '', align: 'right', calc: 'SUM' },
        { label: '평균종사자', prop: 'pastEmpAvg', width: '', align: 'right', calc: 'AVG' },
      ],
    },
    {
      labelKey: 'baseYear',
      children: [
        { label: '사업체수', prop: 'baseCorpCnt', width: '', align: 'right', calc: 'SUM' },
        { label: '종사자수', prop: 'baseEmpCnt', width: '', align: 'right', calc: 'SUM' },
        { label: '평균종사자', prop: 'baseEmpAvg', width: '', align: 'right', calc: 'AVG' },
      ],
    },
  ])

  const itaColumns = ref([
    { label: 'LQ', prop: 'lqValue', width: '', align: 'center' },
    { label: 'GROWTH', prop: 'grValue', width: '', align: 'center' },
    { label: 'RS', prop: 'rsValue', width: '', align: 'center' },
  ])

  const sumProps = columns.value.flatMap((col) => col.children.map((child) => child.prop))
  const flatColumns = computed(() => columns.value.flatMap((group) => group.children))

  const getSummaries = (param: SummaryMethodProps) => {
    const { columns, data } = param
    const sums: (string | VNode)[] = []

    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = h('div', { style: {} }, ['총합계'])
        return
      }

      if (CommonUtil.isEmpty(column.property) || !sumProps.includes(column.property)) {
        return
      }

      const def = flatColumns.value.find((c) => c.prop === column.property)

      const values = data.map((item) => {
        const value = getNestedValue(item, column.property)
        return value !== undefined ? Number(value) : 0 // 기본값 설정
      })

      if (!values.every((value) => Number.isNaN(value))) {
        if (def?.calc === 'SUM') {
          const total = values.reduce((acc, val) => acc + val, 0)
          sums[index] = total.toLocaleString()
        } else if (def?.calc === 'AVG') {
          const v1 = sums[index - 1] as string
          const v2 = sums[index - 2] as string

          if (!Number.isNaN(v1) && !Number.isNaN(v2)) {
            sums[index] = Math.round(
              Number(v1.replace(/,/g, '')) / Number(v2.replace(/,/g, '')),
            ).toLocaleString()
          } else {
            sums[index] = ''
          }
        }
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

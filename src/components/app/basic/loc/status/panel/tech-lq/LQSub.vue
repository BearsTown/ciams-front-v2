<template>
  <div style="padding: 3px; display: flex; flex-direction: column; height: 100%">
    <div>
      <el-text size="small">{{ desc }}</el-text>
    </div>

    <el-space wrap style="margin-top: 8px">
      <template v-for="(item, index) in items" :key="item.code">
        <ActiveButton
          ref="childRefs"
          :title="item.codeName"
          :is-active="activeName === item.code"
          @change:active="(isActive: boolean) => handleCustomEvent(isActive, item.code, index)"
          style="font-size: 12px; text-align: center"
        />
      </template>
    </el-space>

    <el-divider border-style="dashed" style="margin: 10px 0" />

    <div style="flex: 1; display: flex; flex-direction: column; overflow-y: hidden">
      <div style="flex: 1; overflow-y: hidden">
        <el-table
          :data="tableData"
          size="small"
          :show-header="true"
          header-cell-class-name="header-cell"
          style="height: 100%; z-index: 0"
          empty-text="데이터가 없습니다."
          scrollbar-always-on
          :row-style="getRowStyle"
          border
        >
          <el-table-column label="업종명" prop="sggNm" align="center" />
          <el-table-column label="사업체 입지계수" sortable prop="corpLq" align="center" />
          <el-table-column label="종사자 입지계수" sortable prop="workerLq" align="center" />
        </el-table>
      </div>
      <div style="flex: 1"><v-chart class="chart" :option="option" autoresize /></div>
    </div>

    <el-divider border-style="dashed" style="margin: 10px 0" />

    <div style="display: flex; flex-direction: column">
      <div style="margin-bottom: 3px; display: flex; flex-direction: row; align-items: center">
        <el-tag size="small" type="info">사업체</el-tag>
        <el-text style="margin-left: 5px; font-size: 13px">
          {{ corpItem.header }}
          <span style="color: blue">
            {{ corpItem.lqsTxt }}
          </span>
          {{ corpItem.endTxt }}
        </el-text>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center">
        <el-tag size="small" type="info">종사자</el-tag>
        <el-text style="margin-left: 5px; font-size: 13px">
          {{ workerItem.header }}
          <span style="color: blue">
            {{ workerItem.lqsTxt }}
          </span>
          {{ workerItem.endTxt }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated, onMounted, reactive, ref } from 'vue'

  import VChart from 'vue-echarts'

  import ActiveButton from '@/components/common/ActiveButton.vue'

  import { MapType } from '@/enums/mapEnum'

  import { TechLQDto } from '@/models/api/app/basic/loc/industry/techLq'

  import { getCodeList } from '@/api/app/common'
  import { getHighTech, getTechLQs } from '@/api/app/basic/loc/ind-status'

  import { useCmmConfigStore } from '@/stores/config/cmmConfig'

  import { styleUtil } from '@/utils'
  import CommonUtil from '@/utils/commonUtil'

  const props = withDefaults(
    defineProps<{
      lqMapType: MapType
      lqParentCode: string
      desc: string
    }>(),
    {},
  )

  interface LqTextItem {
    header?: string
    lqsTxt?: string
    endTxt?: string
  }

  const cmmConfigStore = useCmmConfigStore()

  const sggCode = ref<string>()
  const childRefs = ref<ActiveButton[]>([])

  const items = ref([] as object[])
  const activeName = ref('')

  const tableData = ref<TechLQDto.TechLQ.Find.Result[]>([])

  const corpItem = reactive<LqTextItem>({})
  const workerItem = reactive<LqTextItem>({})

  async function handleCustomEvent(isActive: boolean, code: string, index: number) {
    if (!isActive) return
    console.log(code)

    await loadData(code)

    childRefs.value.forEach((child, i) => {
      if (i !== Number(index) && child?.setActive) {
        child.setActive(false)
      }
    })

    activeName.value = code
  }

  const option = ref({
    grid: {
      left: '5%',
      right: '5%',
      bottom: '7%',
      top: '13%',
      containLabel: true,
    },
    dataZoom: [
      {
        type: 'inside',
      },
      {
        type: 'inside',
      },
    ],
    xAxis: [
      {
        type: 'value',
        scale: true,
        startValue: 0,
        axisLabel: {
          formatter: '{value}',
        },
        // axisTick: {
        //   interval: 1,
        // },
        splitLine: {
          show: true,
        },
        name: '사업체LQ',
        nameLocation: 'center',
        nameGap: 25,
      },
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        startValue: 0,
        axisLabel: {
          formatter: '{value}',
        },
        // axisTick: {
        //   interval: 1,
        // },
        splitLine: {
          show: true,
        },
        name: '종사자LQ',
        nameGap: 20,
        nameLocation: 'center',
      },
    ],
    series: [
      {
        symbolSize: 30,
        name: '지역',
        type: 'scatter',
        zlevel: 1,
        emphasis: {
          scale: true,
        },
        data: [],
        markLine: {
          symbol: 'none',
          silent: true,
          lineStyle: {
            type: 'line',
            color: 'red',
          },
          data: [
            { xAxis: 1, name: 'x=1' }, // x=1에 세로선
            { yAxis: 1, name: 'y=1' }, // y=1에 가로선
          ],
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}',
          fontSize: 10,
        },
      },
      {
        type: 'effectScatter',
        symbolSize: 25,
        zlevel: 10,
        z: 10,
        labelLayout: {
          hideOverlap: false,
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}',
          color: 'white',
        },
      },
    ],
    labelLayout: {
      hideOverlap: true, // 겹침 자동 방지
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        // if (params.componentType === 'markLine') return ''

        const x = params.data.value[0]
        const y = params.data.value[1]

        const samePoints = option.value.series.flatMap((series) =>
          series.data.filter((d) => d.value[0] === x && d.value[1] === y),
        )

        let tooltipText = `사업체: ${x} <br/> 종사자: ${y}<br/>`
        samePoints.forEach((d) => {
          tooltipText += `• ${d.name}<br/>`
        })

        return tooltipText
      },
    },
  })

  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#1a535c',
    '#f7b731',
    '#ffcc99',
    '#6b48ff',
    '#ff9f40',
    '#00d4ff',
    '#ff6384',
    '#36a2eb',
    '#4bc0c0',
    '#9966ff',
    '#ffcd56',
    '#c9cbcf',
    '#f67088',
    '#37d67a',
    '#2ccce4',
    '#555555',
    '#d64b9f',
    '#b5a642',
    '#ff8a65',
    '#9e66ab',
  ]

  onMounted(async () => {
    const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue

    sggCode.value = `${sidoCd}${sggCd}`

    const { data } = await getCodeList(props.lqParentCode)
    const { data: techData } = await getHighTech({
      parentTechCd: props.lqParentCode,
    })

    const updatedData = data.map((item) => ({
      ...item,
      useYn:
        techData && techData.techs && techData.techs.length > 0
          ? techData.techs.some((tech) => tech.techCd === item.code)
            ? 'Y'
            : 'N'
          : 'N',
    }))

    items.value = [
      {
        code: props.lqParentCode,
        codeName: '전체',
      },
    ].concat(updatedData)

    activeName.value = items.value[0].code

    if (CommonUtil.isEmpty(techData)) {
      corpItem.header = `집적도 높은 업종 없음`
      workerItem.header = `집적도 높은 업종 없음`
    } else {
      const corpLqs = techData?.techs
        ?.filter((tech) => tech.corpQualified)
        .map((tech) => tech.techNm)

      const workerLqs = techData?.techs
        ?.filter((tech) => tech.workerQualified)
        .map((tech) => tech.techNm)

      const endTxt = `의 지역 집적도가 높음`

      if (Array.isArray(corpLqs) && corpLqs.length > 0) {
        corpItem.header = `${techData?.parentTechNm} 산업은 `
        corpItem.lqsTxt = corpLqs?.map((item) => `[${item}]`).join(', ')
        corpItem.endTxt = endTxt
      } else {
        corpItem.header = `집적도 높은 업종 없음`
      }

      if (Array.isArray(workerLqs) && workerLqs.length > 0) {
        workerItem.header = `${techData?.parentTechNm} 산업은 `
        workerItem.lqsTxt = workerLqs?.map((item) => `[${item}]`).join(', ')
        workerItem.endTxt = endTxt
      } else {
        workerItem.header = `집적도 높은 업종 없음`
      }
    }

    await loadData(props.lqParentCode)
  })

  async function loadData(code: string) {
    const { data: techLQ } = await getTechLQs({
      techCd: code,
    })

    tableData.value = techLQ

    const { matched, unmatched } = tableData.value.reduce<{
      matched: TechLQDto.TechLQ.Find.Result[]
      unmatched: TechLQDto.TechLQ.Find.Result[]
    }>(
      (acc, item) => {
        if (sggName.value === item.sggNm) {
          acc.matched.push(item)
        } else {
          acc.unmatched.push(item)
        }

        return acc
      },
      { matched: [], unmatched: [] },
    )

    option.value.series[0].data = unmatched.map((item, index) => ({
      name: item.sggNm,
      value: [item.corpLq, item.workerLq],
      itemStyle: { color: colors[index] },
    }))

    option.value.series[1].data = matched.map((item, index) => ({
      name: item.sggNm,
      value: [item.corpLq, item.workerLq],
      itemStyle: { color: 'RED' },
    }))

    updateData()
  }
  const sggName = computed(() => `${cmmConfigStore.cmmConfigState['SGG_NAME']?.confValue}`)

  // const lqMapType = ref('corpLq')

  function updateData() {
    const levels = 7
    const startColor = '#cccccc'
    const baseColor = '#004574'

    const datas = tableData.value.map((item, index) => item[props.lqMapType])

    if (CommonUtil.isEmpty(datas)) {
      emits('update-data', null)
    } else {
      const result = styleUtil.createLegend(datas, levels, startColor, baseColor)

      emits('update-data', {
        type: props.lqMapType,
        data: tableData.value,
        styleInfo: result,
      })
    }
  }

  const emits = defineEmits<{
    (
      e: 'update-data',
      type: {
        type: MapType
        data: TechLQDto.TechLQ.Find.Result[]
        styleInfo: {
          breaks: number[]
          colors: string[]
          legend: { range: string; color: string }[]
        }
      } | null,
    ): void
  }>()

  const getRowStyle = ({ row }: { row }) => {
    let color = ''

    switch (row.sggCd) {
      case sggCode.value:
        color = '#FF0000'
        break
    }

    return {
      color,
    }
  }

  onActivated(() => {
    updateData()
  })

  defineExpose({
    updateData,
  })
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
    margin: 5px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }

  :deep(.active-button) {
    padding: 5px;
  }

  :deep(th.el-table__cell) {
    background-color: var(--el-fill-color-light);
  }
</style>

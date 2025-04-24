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
      <div style="margin-bottom: 3px">
        <el-tag type="info">사업체</el-tag>
        <el-text v-if="0 < corpLqs.length" style="margin-left: 5px">
          {{ techTxt }}
          <span style="color: blue">
            {{ corpLqsText }}
          </span>
          {{ endTxt }}
        </el-text>
      </div>
      <div>
        <el-tag type="info">종사자</el-tag>
        <el-text v-if="0 < workerLqs.length" style="margin-left: 5px">
          {{ techTxt }}
          <span style="color: blue">
            {{ workerLqsText }}
          </span>
          {{ endTxt }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { getCodeList } from '@/api/app/common'
  import ActiveButton from '@/components/common/ActiveButton.vue'
  import VChart from 'vue-echarts'
  import { getHighTech, getTechLQ } from '@/api/app/menu-1/sub-1/tab-b/page-6'

  const props = withDefaults(
    defineProps<{
      lqParentCode: string
      desc: string
    }>(),
    {},
  )

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()
  const cmmConfigStore = useCmmConfigStore()

  const childRefs = ref<ActiveButton[]>([])

  const items = ref([] as object[])
  const activeName = ref('')

  const corpLqs = ref([])
  const workerLqs = ref([])

  const techTxt = ref('')
  const corpLqsText = computed(() => corpLqs.value.map((item) => `[${item}]`).join(', '))
  const workerLqsText = computed(() => workerLqs.value.map((item) => `[${item}]`).join(', '))
  const endTxt = computed(() => `의 지역 집적도가 높음`)
  function handleCustomEvent(isActive: boolean, code: string, index: number) {
    if (!isActive) return

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
        emphasis: {
          // focus: 'self',
          scale: true,
        },
        data: [
          { name: '포항시 남구', value: [0.6, 0.2], itemStyle: { color: '#ff6b6b' } },
          { name: '포항시 북구', value: [0.5, 0.2], itemStyle: { color: '#4ecdc4' } },
          { name: '경주시', value: [0.3, 0.1], itemStyle: { color: '#1a535c' } },
          {
            name: '김천시',
            value: [1.1, 0.8],
            itemStyle: { color: '#f7b731' },
            symbol:
              'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
          },
          { name: '안동시', value: [0.4, 1.2], itemStyle: { color: '#ffcc99' } },
          { name: '구미시', value: [3.6, 4.5], itemStyle: { color: '#6b48ff' } },
          { name: '영주시', value: [0.2, 0], itemStyle: { color: '#ff9f40' } },
          { name: '영천시', value: [0.5, 0.1], itemStyle: { color: '#00d4ff' } },
          { name: '상주시', value: [0.4, 0.3], itemStyle: { color: '#ff6384' } },
          { name: '문경시', value: [0.4, 0.5], itemStyle: { color: '#36a2eb' } },
          { name: '경산시', value: [0.6, 0.3], itemStyle: { color: '#4bc0c0' } },
          { name: '의성군', value: [0.3, 0.1], itemStyle: { color: '#9966ff' } },
          { name: '청송군', value: [0.2, 0], itemStyle: { color: '#ffcd56' } },
          { name: '영양군', value: [0.3, 0.1], itemStyle: { color: '#c9cbcf' } },
          { name: '영덕군', value: [0.2, 0.1], itemStyle: { color: '#f67088' } },
          { name: '청도군', value: [0.2, 0.1], itemStyle: { color: '#37d67a' } },
          { name: '고령군', value: [0.2, 0.1], itemStyle: { color: '#2ccce4' } },
          { name: '성주군', value: [0.5, 0.4], itemStyle: { color: '#555555' } },
          { name: '칠곡군', value: [1.7, 0.9], itemStyle: { color: '#d64b9f' } },
          { name: '예천군', value: [0.2, 0], itemStyle: { color: '#b5a642' } },
          { name: '봉화군', value: [0.1, 0.2], itemStyle: { color: '#ff8a65' } },
          { name: '울진군', value: [0.2, 0], itemStyle: { color: '#9e66ab' } },
        ],
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

        const samePoints = option.value.series[0].data.filter(
          (d) => d.value[0] === x && d.value[1] === y,
        )

        let tooltipText = `사업체: ${x} <br/> 종사자: ${y}<br/>`
        samePoints.forEach((d) => {
          tooltipText += `• ${d.name}<br/>`
        })

        return tooltipText
      },
    },
  })

  const tableData = ref([])

  onMounted(async () => {
    const { data } = await getCodeList(props.lqParentCode)
    items.value = [
      {
        code: 'all',
        codeName: '전체',
      },
    ].concat(data)

    activeName.value = items.value[0].code

    const { data: techData } = await getHighTech({
      parentTechCd: props.lqParentCode,
    })

    techTxt.value = `${techData?.parentTechNm} 산업은 `

    corpLqs.value = techData?.techs
      .filter((tech) => tech.corpQualified === true)
      .map((tech) => tech.techNm)
    workerLqs.value = techData?.techs
      .filter((tech) => tech.workerQualified === true)
      .map((tech) => tech.techNm)

    const { data: techLQ } = await getTechLQ({
      techCd: props.lqParentCode,
    })

    tableData.value = techLQ as []
  })

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

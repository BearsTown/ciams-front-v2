<template>
  <div style="position: relative" v-if="isInitChartBtnVisible">
    <el-button
      type="danger"
      icon="Top"
      circle
      style="right: 10px; top: 10px; position: absolute; z-index: 10; opacity: 0.7"
      @click="initChartReload"
    />
  </div>
  <!-- 
    상단 분석대상 설정에 따른 정보 (현재 미사용)
  -->
  <div
    v-if="viewType == 'BASIC' && position == 'TOP' && info"
    @click="handleClick"
    :class="activeId == info.id ? 'basic-c border-box-round active' : 'basic-c border-box-round'"
  >
    <div class="item-c title-c" style="font-size: 17px">
      <el-icon v-if="activeId == info.id" style="color: rgb(245, 108, 108); font-size: 25px"
        ><LocationFilled
      /></el-icon>
      {{ info.title.name }}
      <el-tooltip :content="info.title.desc" placement="right-start" effect="light">
        <el-icon><InfoFilled /></el-icon>
      </el-tooltip>
    </div>
    <div class="item-c" style="font-size: 32px; color: black; padding: 10px">
      {{ info.subTitle.name }}
      <img
        v-if="info.subTitle.isIcon && info.subTitle.isIconType == true"
        class="arrow-middle"
        src="/assets/image/arrow-up.png"
      />
      <img
        v-if="info.subTitle.isIcon && info.subTitle.isIconType == false"
        class="arrow-middle"
        src="/assets/image/arrow-down.png"
      />
    </div>
    <div class="item-c" style="font-size: 16px">
      {{ info.bottomTitle.name }}
      <img
        v-if="info.bottomTitle.isIcon && info.bottomTitle.isIconType == true"
        class="arrow-bottom"
        src="/assets/image/arrow-up.png"
      />
      <img
        v-if="info.bottomTitle.isIcon && info.bottomTitle.isIconType == false"
        class="arrow-bottom"
        src="/assets/image/arrow-down.png"
      />
    </div>
  </div>

  <!--상단 분석대상 설정에 따른 정보 > 지표추가 부분-->
  <div
    v-if="viewType == 'ADD' && position == 'TOP'"
    @click="handleClick"
    class="basic-c border-box-round"
  >
    <div class="item-c title-c" style="font-size: 17px">
      <el-icon size="20"><Plus /></el-icon>
    </div>
    <div class="item-c title-c" style="font-size: 10px">지표추가</div>
  </div>

  <!-- 상단 차트 부분-->
  <div v-if="viewType == 'CHART' && position == 'TOP'" style="margin: 5px 0; padding: 5px 10px">
    <div v-if="option.etc?.titleName" class="title-c" style="text-align: center; flex-grow: 1">
      <!-- <img class="img-c" src="/assets/image/bar-chart.png" /> -->
      <span>{{ option.etc?.titleName }}</span>
      <span class="title-c-unit" v-if="option.etc.unitName">({{ option.etc.unitName }})</span>
    </div>
    <div style="flex-grow: 9" class="position-top">
      <v-chart
        v-if="option.etc?.data.length != 0"
        ref="vChartRef"
        :class="option.etc?.titleName != null ? 'chart' : 'no-title-chart'"
        :init-options="initOptions"
        :option="nowOption"
        @click="handleClick"
        @legendselectchanged="handLegendselectchanged"
        autoresize
      />
      <div v-else class="empty">데이터가 없습니다.</div>
    </div>
  </div>

  <!-- 우측 차트 부분-->
  <div v-if="position == 'RIGHT'">
    <div v-if="option.etc?.titleName" class="title-c" style="text-align: center; flex-grow: 1">
      <span class="title-c-right-unit" v-if="option.etc.unitName">({{ option.etc.unitName }})</span>
    </div>
    <div class="position-right">
      <!-- {{ option.etc }} -->
      <v-chart
        v-if="option.etc?.data.length != 0"
        ref="vChartRef"
        :init-options="initOptions"
        :option="nowOption"
        @click="handleClick"
        @legendselectchanged="handLegendselectchanged"
        autoresize
      />
      <div v-else class="empty">데이터가 없습니다.</div>
    </div>
  </div>

  <!--관리자페이지 사용자 로그인 내역 차트-->
  <div v-if="position == 'ETC'" style="width: 100%; height: 100%">
    <v-chart ref="vChartRef" :option="option" @click="handleClick" autoresize />
  </div>
</template>

<script lang="ts" setup>
  import chartUtil from '@/utils/chartUtil'
  import 'echarts'
  import { onMounted, ref, watch } from 'vue'
  import VChart from 'vue-echarts'

  const vChartRef = ref({})

  const props = withDefaults(
    defineProps<{
      //차트 기본 option
      option: Object
      /*
          BASIC - 기본, 통계데이터 표출
          ADD - 기본, 통계데이터 표출(추가화면)
          CHART - 차트 유형 표출
        */
      viewType: 'BASIC' | 'ADD' | 'CHART'
      info?: Object
      position?: 'TOP' | 'RIGHT' | 'ETC'
      activeId?: string
      height?: number
    }>(),
    {
      position: 'TOP',
      activeId: '',
      height: 300,
    },
  )
  const emit = defineEmits(['handleClick'])

  //상위 차트데이터로 이동 버튼 보임여부
  const isInitChartBtnVisible = ref(false)

  //Default init Options
  const initOptions: any = {
    // width: props.position == 'RIGHT' ? null : '300px',
    width: 'auto',
    height: 'auto',
  }

  const nowOption = ref()

  function handleClick(event) {
    console.log(event)
    if (props.viewType == 'BASIC' && props.info) {
      emit('handleClick', { type: 'BASIC', id: props.info.id })
    }
    if (props.viewType == 'ADD') {
      emit('handleClick', { type: 'ADD' })
    } else {
      // emit('handleClick', ...args);
      emit('handleClick', event)
    }
    //드릴다운데이터 표출
    subDataChartView(event)
  }

  //드릴다운데이터 표출
  function subDataChartView(event) {
    if (!props.option || !props.option.etc) return
    const initData = props.option.etc
    if (event.data) {
      var findData = initData.data.find(function (data) {
        return data.label === event.name
      })
      if (!findData || !findData['subData']) {
        return
      }
      let subChartOption = chartUtil.makeChartOption(initData.type, {
        isHorizontal: initData.isHorizontal,
        titleName: initData.titleName,
        data: findData['subData'],
      })
      nowOption.value = subChartOption
      isInitChartBtnVisible.value = true
      resizeChart(subChartOption)
    }
  }

  //처음 option으로 새로고침
  function initChartReload() {
    nowOption.value = props.option
    isInitChartBtnVisible.value = false
    resizeChart(props.option)
  }

  //option에 따라서 차트 사이즈 재조절
  function resizeChart(option) {
    if (
      props.position == 'RIGHT' &&
      option &&
      option.etc?.isHorizontal &&
      option.etc?.type == 'BAR' &&
      option.xAxis
    ) {
      rightChartHeight.value = option.yAxis.data.length * 30 + 50 + 'px'
    } else {
      rightChartHeight.value = props.height + 'px'
    }

    if (option && option.etc && option.etc.isHorizontal == false && option.etc.type == 'BAR') {
      let _width = option.xAxis.data.length * 22
      topChartWidth.value = (_width > 380 ? _width : 380) + 'px'
    }

    if (option && option.etc && option.etc.data == 0) {
      rightChartHeight.value = '10px'
    }
  }

  //범례 EVENT
  function handLegendselectchanged(params) {
    vChartRef.value.setOption({
      series: {
        label: {
          formatter: () => {
            let totalVal = 0
            for (const [key, value] of Object.entries(params.selected)) {
              if (value) {
                totalVal += this.getOption().series[0].data.filter((a) => a.name == key)[0].value
              }
            }
            return totalVal
          },
        },
      },
    })
  }

  const rightChartHeight = ref('')
  const topChartWidth = ref('300px')

  function reloadOption(option) {
    resizeChart(option)
    nowOption.value = option
  }

  defineExpose({
    reloadOption,
  })

  onMounted(() => {
    resizeChart(props.option)
    nowOption.value = props.option
  })
</script>
<style scoped lang="scss">
  .basic-c {
    // flex-basis: 220px;
    width: 220px;
    height: 150px;
    margin: 10px;
    border: 0px !important;
    justify-content: center;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;
    // display: inline-flex;
  }

  .position-top {
    width: v-bind(topChartWidth);
    border: 0px !important;
    display: flex;
    flex-direction: column;
    height: v-bind(rightChartHeight);
  }

  .active {
    border: 3px solid #f56c6c !important;
    border-radius: 20px !important;
  }

  .item-c {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }

  .position-right {
    width: 100%;
    /* height: 350px; */
    height: v-bind(rightChartHeight);
  }

  .title-c {
    position: relative;
    color: var(--ugis-color-temp-2);
    font-weight: bold;
  }

  .title-c-unit {
    font-size: 13px;
    color: #616161;
    float: right;
    font-weight: bold;
  }
  .title-c-right-unit {
    font-size: 12px;
    color: #616161;
    float: right;
    font-weight: bold;
  }
  .img-c {
    height: 15px;
    vertical-align: middle;
    padding-right: 5px;
  }
  // .chart {
  //   height: 100%;
  //   /* width : 300px; */
  //   // position: relative;
  //   // top: -30px;
  // }
  // .no-title-chart {
  //   height: 100%;
  //   // position: relative;
  // }

  .arrow-middle {
    padding-left: 5px;
    width: 30px;
  }

  .arrow-bottom {
    padding-left: 5px;
    width: 15px;
  }

  .empty {
    font-size: 10pt;
    text-align: center;
    color: '#EEEEEE';
    opacity: 0.5;
    margin-top: 50px;
  }
</style>

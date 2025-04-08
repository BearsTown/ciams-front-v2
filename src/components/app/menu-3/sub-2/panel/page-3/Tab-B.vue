<template>
  <div class="container">
    <div class="center">
      <div class="left">
        <v-chart class="chart" :option="option" autoresize />
      </div>
      <div class="right">P3-B-R</div>
    </div>
    <div class="bottom customScroll">
      <div class="text-wrap">
        - 최근 10년간(2011~2021년) 김천시 전체 인구는(140,239명) 증가(0.29%)하였음 <br />
        - 그 중 대신동이 24,895명으로 가장 많은 인구비율을 나타냈으며 인구 증가율은 율곡동이
        41.65%로 가장 높음
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, shallowRef } from 'vue'

  import { graphic } from 'echarts/core'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import VChart from 'vue-echarts'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const data = [[[1.1, 0.8, '김천시']], [[0.6, 0.2, '포항시 남구']], [[3.6, 4.5, '구미시']]]

  function getData() {
    return {
      textStyle: {
        fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
        fontWeight: 300,
      },
      title: {
        text: 'Life Expectancy vs. GDP by country',
      },
      legend: {
        bottom: 10,
        data: ['김천시', '포항시 남구', '구미시'],
      },
      xAxis: {
        min: function (value) {
          // debugger
          return 0
        },
        interval: 0.5,
        // startValue: 0,
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      yAxis: {
        min: function (value) {
          // debugger
          return 0
        },
        interval: 0.5,
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        scale: true,
      },
      series: [
        {
          name: '김천시',
          data: data[0],
          type: 'scatter',
          symbolSize(data) {
            return 60
          },
          label: {
            show: true,
            textShadowColor: 'rgba(0, 0, 0, 1)',
            textShadowBlur: 2,
            // textBorderColor: 'rgba(0, 0, 0, 1)',
            color: 'rgba(255, 255, 255, 1)',
            borderWidth: 0,
            textBorderWidth: 2,
            fontSize: 15,
            fontWeight: 'bold',
            // position: 'inside',
            formatter({ data }) {
              return data[2]
              // return `${data[2]}(사업체LQ:${data[0]}, 종사자LQ:${data[1]})`
            },
          },
          // emphasis: {
          //   label: {
          //     show: true,
          //     formatter({ data }) {
          //       return `${data[2]}(사업체LQ:${data[0]}, 종사자LQ:${data[1]})`
          //     },
          //     position: 'top',
          //   },
          // },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(120, 36, 50, 0.5)',
            shadowOffsetY: 5,
            color: new graphic.RadialGradient(0.4, 0.3, 1, [
              {
                offset: 0,
                color: 'rgb(251, 118, 123)',
              },
              {
                offset: 1,
                color: 'rgb(204, 46, 72)',
              },
            ]),
          },
        },
        {
          name: '포항시 남구',
          data: data[1],
          type: 'scatter',
          symbolSize(data) {
            return 40
          },
          label: {
            show: true,
            color: 'black',
            overflow: 'none',
            ellipsis: '...',
            formatter({ data }) {
              return data[2]
            },
          },
        },
        {
          name: '구미시',
          data: data[2],
          type: 'scatter',
        },
      ],
    }
  }

  const option = shallowRef(getData())

  onMounted(async () => {})

  onBeforeMount(() => {})

  onActivated(() => {})
</script>

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
        margin-left: 8px;
        border-radius: 8px;
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
</style>

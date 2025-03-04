<template>
  <div style="display: flex">
    <el-select :value="currentChartViewType" size="small" @change="setCurrentChartViewType">
      <el-option
        v-for="viewType in chartViewType"
        :key="viewType.value"
        :label="viewType.label"
        :value="viewType.value"
      />
    </el-select>
  </div>
  <slot name="chart">
    <div id="info"></div>
    <div v-show="currentChartViewType.indexOf('chart') >= 0" id="main"></div>
    <el-table
      v-if="size != undefined && currentChartViewType.indexOf('table') >= 0"
      :data="
        Object.entries(data).map((item) => {
          return { day: item[0], 평균기온: item[1]['평균기온'] }
        })
      "
      style="width: 100%"
    >
      <el-table-column prop="day" label="day" width="180" />
      <el-table-column prop="평균기온" label="평균기온" width="180" />
    </el-table>
  </slot>
</template>

<script setup>
  import { mapApi } from '@/api/map/mapService'
  import * as echarts from 'echarts'
  import { onMounted, reactive, ref } from 'vue'
  const option = reactive({
    title: {},
    tooltip: {},
    xAxis: {},
    yAxis: {},
    series: [],
  })
  const setCurrentChartViewType = (value) => {
    currentChartViewType.value = value
  }
  const currentChartViewType = ref('chart+table')
  const data = reactive({})
  const size = ref(0)
  const chartViewType = [
    {
      label: '차트',
      value: 'chart',
    },
    {
      label: '차트 + 표',
      value: 'chart+table',
    },
    {
      label: '표',
      value: 'table',
    },
  ]
  onMounted(() => {
    mapApi.getChartTestData().then((res) => {
      size.value = res.total
      res.list.forEach((l) => {
        data[l.byyear] = { 평균기온: l.mntmp }
      })
      var myChart = echarts.init(document.getElementById('main'), null, {
        width: 380,
        height: 400,
      })
      option.title.text = '평균기온'
      option.yAxis.data = Object.keys(data)
      option.series.push({
        name: option.title.text,
        type: 'bar',
        data: Object.entries(data).map((item) => item[1][option.title.text]),
      })
      myChart.setOption(option)
      myChart.on('click', (e) => {
        console.log(e)
      })
      document.getElementById('info').textContent = (
        Object.entries(data)
          .map((item) => item[1]['평균기온'])
          .reduce((prev, cur) => prev + cur, 0) / size.value
      ).toFixed(2)
    })
  })
</script>

<style lang="scss" scoped></style>

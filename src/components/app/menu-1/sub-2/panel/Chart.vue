<template>
  <v-chart style="height: 100%" class="" :option="option" autoresize />
</template>

<script setup lang="ts">
  import VChart from 'vue-echarts'
  import { onMounted, ref } from 'vue'

  const option = ref({})

  onMounted(() => {
    option.value = {
      // legend: {
      // data: ['사업체', '종사자'],
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      yAxis: [
        {
          type: 'category',
          data: ['C', 'G', 'H', 'N', '기타'],
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      xAxis: [
        {
          type: 'value',
          name: '사업체',
          // min: 0,
          // max: 250,
          // interval: 50,
          axisLabel: {
            // formatter: '{value}명'
          },
        },
        {
          type: 'value',
          name: '종사자',
          // show: false,
          // min: 0,
          // max: 25,
          // interval: 5,
          axisLabel: {
            // formatter: '{value}개소'
          },
        },
      ],
      series: [
        {
          name: '사업체',
          type: 'bar',
          xAxisIndex: 0,
          tooltip: {
            valueFormatter: function (value) {
              return value + '개소'
            },
          },
          data: [
            {
              value: 181,
              itemStyle: {
                color: '#7bc142',
              },
            },
            {
              value: 69,
              itemStyle: {
                color: '#faaa1c',
              },
            },
            {
              value: 51,
              itemStyle: {
                color: '#7b88c2',
              },
            },
            {
              value: 13,
              itemStyle: {
                color: '#d6cfcc',
              },
            },
            {
              value: 25,
              itemStyle: {
                color: '#d6cfcc',
              },
            },
          ],
        },
        {
          name: '종사자',
          type: 'line',
          xAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value) {
              return value + '명'
            },
          },
          data: [
            {
              value: 7717,
              itemStyle: {
                color: '#7bc142',
              },
            },
            {
              value: 227,
              itemStyle: {
                color: '#faaa1c',
              },
            },
            {
              value: 499,
              itemStyle: {
                color: '#7b88c2',
              },
            },
            {
              value: 377,
              itemStyle: {
                color: '#d6cfcc',
              },
            },
            {
              value: 95,
              itemStyle: {
                color: '#d6cfcc',
              },
            },
          ],
        },
      ],
    }
  })
</script>

<style scoped lang="scss"></style>

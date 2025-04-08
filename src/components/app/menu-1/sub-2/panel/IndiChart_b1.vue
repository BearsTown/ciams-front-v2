<template>
  <v-chart ref="myChart" style="height: 100%" class="" :option="props.data" autoresize />
</template>

<script setup lang="ts">
  import VChart from 'vue-echarts'
  import { onMounted, ref } from 'vue'

  const props = withDefaults(
    defineProps<{
      data?: object[]
    }>(),
    {},
  )

  const myChart = ref()
  const option = ref({})

  function test() {
    // myChart.value.clear()

    myChart.value.dispatchAction({
      type: 'legendunselected',
      name: '사업체',
    })
  }

  function createOption(params) {
    const { axis, attributes, tableData } = params

    const categories = [
      {
        type: 'category',
        data: tableData.filter((item) => item.visible === true).map((item) => item.short),
        axisPointer: {
          type: 'shadow',
        },
      },
    ]

    const values = attributes.map((item) => ({
      type: 'value',
      name: item.label,
    }))

    const series: object[] = []

    attributes.forEach((attr, idx) => {
      const item = {
        name: attr.label,
        type: attr.seriesType,
        // yAxisIndex: idx,
        ...(axis === 'X' ? { xAxisIndex: idx } : axis === 'Y' ? { yAxisIndex: idx } : null),
        data: [] as object[],
        tooltip: {
          valueFormatter: function (value) {
            return `${value} ${attr.unit}`
          },
        },
      }

      tableData.forEach((data) => {
        item.data.push({
          value: data[attr.name].value,
          itemStyle: {
            color: data.color,
          },
        })
      })

      series.push(item)
    })

    return {
      series,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      ...(axis === 'X'
        ? { xAxis: categories, yAxis: values }
        : axis === 'Y'
        ? { xAxis: values, yAxis: categories }
        : null),
    }
  }

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
      xAxis: [
        {
          type: 'category',
          data: ['C', 'G', 'H', 'N', '기타'],
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
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
          yAxisIndex: 0,
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
          // color: 'green',
          name: '종사자',
          type: 'line',
          yAxisIndex: 1,
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

    setTimeout(() => {
      test()
    }, 3000)
  })
</script>

<style scoped lang="scss"></style>

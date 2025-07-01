<template>
  <div class="container" style="margin-top: 5px">
    <div class="title" style="display: flex; align-items: center">
      <span style="flex: 1">{{ title }}</span>
    </div>

    <div style="display: flex; flex-direction: row">
      <table class="customTable" style="width: 50%">
        <colgroup>
          <col style="width: 50%" />
          <col style="width: 50%" />
        </colgroup>
        <tbody>
          <tr>
            <th style="text-align: center; vertical-align: middle">지수</th>
            <td style="text-align: center; vertical-align: middle">{{ value1 }}</td>
          </tr>
          <tr>
            <th style="text-align: center; vertical-align: middle">구분</th>
            <td style="text-align: center; vertical-align: middle">{{ value2 }}</td>
          </tr>
        </tbody>
      </table>

      <div style="width: 50%; min-height: 120px; margin-left: 5px">
        <v-chart class="chart" :option="option" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'

  import { type UseBoolean, useBoolean } from '@/hooks/useBoolean'
  import VChart from 'vue-echarts'

  const props = withDefaults(
    defineProps<{
      title?: string
      value1: string
      value2: string
    }>(),
    {
      title: '',
      value1: '',
      value2: '',
    },
  )

  const option = ref({})
  option.value = {
    tooltip: {
      valueFormatter: function (value) {
        return `${value} %`
      },
    },
    series: [
      {
        name: '',
        type: 'pie',
        top: '-10%',
        bottom: '-10%',
        avoidLabelOverlap: false,
        itemStyle: {
          borderWidth: 2,
          borderRadius: 5,
          borderColor: '#fff',
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          color: '#fff',
          fontSize: 15,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: false,
        },
        // data: data.map((item) => {
        //   return {
        //     value: item.percentage,
        //     name: item.name,
        //   }
        // }),
        data: [
          {
            name: '선도·신흥산업',
            value: 68.6,
          },
          {
            name: '기타',
            value: 100 - 68.6,
          },
        ],
      },
    ],
  }
</script>

<style scoped lang="scss">
  .title {
    font-size: 15px;
    padding-bottom: 10px;
  }
</style>

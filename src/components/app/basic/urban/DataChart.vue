<template>
  <v-chart ref="dataChart" style="height: 100%" autoresize />
</template>

<script setup lang="ts">
  import { nextTick, ref, watch } from 'vue'
  import VChart from 'vue-echarts'
  import { EChartsOption } from 'echarts'

  import CommonUtil from '@/utils/commonUtil'

  const props = withDefaults(
    defineProps<{
      data: EChartsOption
    }>(),
    {},
  )

  const dataChart = ref<InstanceType<typeof VChart>>()

  watch(
    () => props.data,
    (newValue) => {
      if (!CommonUtil.isEmpty(newValue)) {
        nextTick(() => {
          if (dataChart.value && dataChart.value.setOption) {
            dataChart.value.setOption(newValue)
          }
        })
      } else {
        dataChart.value?.clear()
      }
    },
  )
</script>

<style scoped lang="scss"></style>

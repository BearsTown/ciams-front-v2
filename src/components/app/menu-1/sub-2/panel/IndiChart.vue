<template>
  <v-chart ref="myChart" style="height: 100%" class="" autoresize />
</template>

<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from 'vue'

  import VChart from 'vue-echarts'

  import CommonUtil from '@/utils/commonUtil'

  const props = withDefaults(
    defineProps<{
      data?: object
    }>(),
    {},
  )

  const myChart = ref()
  const option = ref({})

  function test() {
    // myChart.value.clear()
    // myChart.value.dispatchAction({
    //   type: 'legendunselected',
    //   name: '사업체',
    // })
  }

  watch(
    () => props.data,
    (newValue) => {
      if (!CommonUtil.isEmpty(newValue)) {
        nextTick(() => {
          if (myChart.value && myChart.value.setOption) {
            myChart.value.setOption(newValue)
          }
        })
      } else {
        myChart.value?.clear()
      }
    },
  )

  onMounted(() => {})
</script>

<style scoped lang="scss"></style>

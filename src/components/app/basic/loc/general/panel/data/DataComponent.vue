<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div
      style="
        display: flex;
        flex-direction: column;
        height: 100%;
        border: none;
        box-shadow: none;
        overflow-y: hidden;
      "
    >
      <template v-if="dataInfo">
        <template v-if="currentView === 'table'">
          <DataTable :data-info="dataInfo" />
        </template>
        <template v-if="currentView === 'chart'">
          <DataChart :data-info="dataInfo" />
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  import DataTable from '@/components/app/basic/loc/general/panel/data/DataTable.vue'
  import DataChart from '@/components/app/basic/loc/general/panel/data/DataChart.vue'

  import { GeneralDataDto } from '@/models/api/app/basic/loc/general/general'

  import { getDataDetailInfo } from '@/api/app/basic/loc/general'

  const props = withDefaults(
    defineProps<{
      dataId: number
      title?: string
      view: 'chart' | 'table'
    }>(),
    {},
  )

  const emits = defineEmits<{
    (e: 'update:view', value: 'chart' | 'table'): void
  }>()

  const currentView = computed({
    get: () => props.view,
    set: (value) => {
      emits('update:view', value)
    },
  })

  const dataInfo = ref<GeneralDataDto.DataDetailInfo>()

  async function loadData(dataId: number) {
    const { data } = await getDataDetailInfo(dataId)

    dataInfo.value = data
  }

  watch(
    () => props.dataId,
    async () => {
      await loadData(props.dataId)
    },
    { immediate: true },
  )
</script>

<style lang="scss" scoped>
  .header-title {
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
</style>

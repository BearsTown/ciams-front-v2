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
      <template v-if="currentView === 'table'">
        <DataTable :data-info="dataInfo" />
      </template>
      <template v-else>
        <DataChart :data-info="dataInfo" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, ref, watch } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import CommonUtil from '@/utils/commonUtil'
  import DataTable from '@/components/app/menu-1/sub-1/panel/tab-A/DataTable.vue'
  import DataChart from '@/components/app/menu-1/sub-1/panel/tab-A/DataChart.vue'
  import { getDataInfo } from '@/api/app/menu-1/sub-1/tab-a'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()

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

  const dataInfo = ref<object>({})
  const tableColumns = ref([])
  const tableData = ref([])

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  async function loadData(dataId: number) {
    // const { data } =

    console.log(props.dataId)

    const { data } = await getDataInfo(props.dataId)
    // console.log(data)

    dataInfo.value = data

    // tableColumns.value = data?.columns
    // tableData.value = data?.data
  }

  watch(
    () => props.dataId,
    async () => {
      await loadData(props.dataId)
    },
    { immediate: true },
  )

  onMounted(async () => {
    await loadConfig()

    const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue

    // await loadData()
  })

  onBeforeMount(() => {})

  onActivated(() => {})
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

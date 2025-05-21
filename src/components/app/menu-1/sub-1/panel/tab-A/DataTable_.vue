<template>
  <el-table
    size="small"
    style="height: 100%; z-index: 0"
    empty-text="데이터가 없습니다."
    :show-header="true"
    scrollbar-always-on
    border
  >
    <el-table-column label="업종" align="center">
      <el-table-column label="구분" prop="category" align="center" width="120px" />
      <el-table-column label="코드" align="center" width="55px">
        <template #default="{ row }"> {{ row?.tcode }}{{ row?.clsCode }} </template>
      </el-table-column>
      <el-table-column label="산업내용" prop="insNm" align="center" />
    </el-table-column>
    <el-table-column label="ITA분석" prop="itaRec" align="center" width="100px" />
    <el-table-column label="LQ분석" prop="lqRec" align="center" width="100px" />
  </el-table>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted, ref } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import CommonUtil from '@/utils/commonUtil'

  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()

  const props = withDefaults(
    defineProps<{
      // dataId: number
      // title: string
      // view: 'chart' | 'table'
    }>(),
    {},
  )

  const info = ref<object>({})

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  async function load() {
    // const { data } =
    alert(props.dataId)
  }

  onMounted(async () => {
    await loadConfig()

    const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue
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

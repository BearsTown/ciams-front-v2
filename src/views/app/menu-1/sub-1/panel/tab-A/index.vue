<template>
  <Tab-A v-if="selectedItem.id" :title="title" :status-id="selectedItem.id" />
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted } from 'vue'

  import TabA from '@/components/app/menu-1/sub-1/panel/tab-A'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu1Sub1Tab1Store } from '@/stores/app/menu-1/sub-1/tab-A'
  import { useMenu3Sub2Page1Store } from '@/stores/app/menu-3/sub-2/page-1'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import CommonUtil from '@/utils/commonUtil'
  import { storeToRefs } from 'pinia'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()
  const menu1Sub1Tab1Store = useMenu1Sub1Tab1Store()

  const { selectedMenu, selectedItem } = storeToRefs(menu1Sub1Tab1Store)

  const cmmConfigStore = useCmmConfigStore()

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  const title = computed(() => {
    return [selectedMenu.value.title, selectedItem.value.title]
  })

  onMounted(async () => {
    await loadConfig()

    // const sidoCd = cmmConfigStore.cmmConfigState['SIDO_CODE']?.confValue
    // const sggCd = cmmConfigStore.cmmConfigState['SGG_CODE']?.confValue
    // const { data } = await getItaDatas(`${sidoCd}${sggCd}`)
  })

  onBeforeMount(() => {})

  onActivated(() => {})
</script>

<style lang="scss"></style>

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
      overflow-y: hidden;
      height: 100%;

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
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        border-radius: 8px;
      }

      .right-top {
      }

      .right-bottom {
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

  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 5px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .customTable th,
  .customTable td {
    border-left: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
  }

  //:deep(th.el-table__cell) {
  //  background-color: var(--el-fill-color-light);
  //}
  //
  //:deep(.el-table) .warning-row {
  //  --el-table-tr-bg-color: #e6b9b8;
  //}
  //:deep(.el-table) .success-row {
  //  --el-table-tr-bg-color: var(--el-color-success-light-9);
  //}
  //:deep(.el-table__body) tr:hover > td {
  //  background-color: transparent !important;
  //}
</style>

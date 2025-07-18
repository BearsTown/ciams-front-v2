<template>
  <PagePane :title="title">
    <template #sub>
      <Source :list="sources" />

      <el-select v-model="selected" size="large" style="width: 250px" @change="handleSelectChange">
        <el-option
          v-for="group in groups"
          :key="group.dataId"
          :label="group.title"
          :value="group.dataId"
        />
      </el-select>
    </template>

    <template #center>
      <div class="container">
        <div class="center">
          <div class="left" v-if="selected">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <DataComp view="chart" :data-id="selected" />
            </div>
          </div>

          <div class="right" v-if="selected">
            <div
              style="
                display: flex;
                flex-direction: column;
                height: 100%;
                border: none;
                box-shadow: none;
              "
            >
              <DataComp view="table" :data-id="selected" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { computed, onActivated, onBeforeMount, onMounted, ref, watch } from 'vue'

  import Source from '@/components/common/Source.vue'
  import PagePane from '@/components/common/PagePane.vue'
  import DataComp from '@/components/app/menu-1/sub-1/panel/tab-A/page-2/DataComponent.vue'

  import { SourceGroupDTO } from '@/api/app/source/model'
  import { getStatusInfo } from '@/api/app/menu-1/sub-1/tab-a'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { useMenu1Sub1Tab1Store } from '@/stores/app/menu-1/sub-1/tab-A'

  const globalStore = useGlobalStore()
  const menu1Sub1Tab1Store = useMenu1Sub1Tab1Store()

  const cmmConfigStore = useCmmConfigStore()

  const selected = ref()

  const title = computed(() => [
    `${menu1Sub1Tab1Store.selectedMenu?.title}`,
    `${menu1Sub1Tab1Store.selectedItem?.title}`,
  ])

  const groups = ref<any[]>([])
  const sources = ref<SourceGroupDTO.SourceDTO[]>([])

  async function loadGroup(statusId: number) {
    const { data } = await getStatusInfo(statusId)
    groups.value = data.groups
    sources.value = data.sources[0]?.sources

    selected.value = groups.value[0].dataId
  }

  function handleSelectChange(select: number) {}

  watch(
    () => menu1Sub1Tab1Store.selectedItem,
    async () => {
      console.log(menu1Sub1Tab1Store.selectedItem.id)

      await loadGroup(menu1Sub1Tab1Store.selectedItem.id)
    },
    { immediate: false },
  )

  onMounted(async () => {})

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
      //overflow-y: hidden;
      overflow: hidden;
      height: 100%;
      gap: 8px;

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
        //margin-left: 8px;
        border-radius: 8px;
        overflow: hidden;
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

  :deep(th.el-table__cell) {
    background-color: var(--el-fill-color-light);
  }

  :deep(.el-table) .warning-row {
    --el-table-tr-bg-color: #e6b9b8;
  }
  :deep(.el-table) .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
  }
</style>

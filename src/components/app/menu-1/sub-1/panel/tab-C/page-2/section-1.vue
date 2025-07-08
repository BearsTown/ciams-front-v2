<template>
  <PagePane :title="['인접 지자체 산업특성분석', '산업기반분석 비교']">
    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <div class="container"></div>
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import PagePane from '@/components/common/PagePane.vue'

  import { useGlobalStore } from '@/stores/app'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  import { useMenu1Sub1Tab3Page2Store } from '@/stores/app/menu-1/sub-1/tab-C/page-2'

  const globalStore = useGlobalStore()
  const menu1Sub1Tab3Page2Store = useMenu1Sub1Tab3Page2Store()

  const cmmConfigStore = useCmmConfigStore()

  const props = withDefaults(
    defineProps<{
      [key: string]: any
    }>(),
    {},
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
      height: 0px;
      display: flex;
      flex-direction: row;

      .left {
        width: 100%;
        height: 100%;

        padding: 5px;
        background: #fff;
        border-radius: 8px;
      }

      .right {
        width: 50%;

        padding: 10px;
        background: #fff;
        margin-left: 8px;
        border-radius: 8px;
        overflow: hidden;
      }
    }

    .bottom {
      height: 80px;
      margin-top: 8px;
      min-height: 100px;
      max-height: 150px;

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

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>

<template>
  <InsideCollapse title="기본방향" :is-open="true">
    <template #content>
      <div>
        <div>미래전략산업 도출</div>
        <el-image
          style="width: 100%"
          :src="imgSrc"
          fit="scale-down"
          :preview-src-list="[imgSrc]"
          :preview-teleported="true"
          :zoom-rate="1.2"
        />
      </div>

      <el-divider border-style="dashed" />

      <div>
        <div>미래전략산업별 기본방향</div>
        <el-image
          style="width: 100%"
          :src="imgSrc"
          fit="scale-down"
          :preview-src-list="[imgSrc]"
          :preview-teleported="true"
          :zoom-rate="1.2"
        />
      </div>
    </template>
  </InsideCollapse>
</template>

<script setup lang="ts">
  import { onActivated, onBeforeMount, onMounted } from 'vue'

  import { useGlobalStore } from '@/stores/app'
  import { useMenu3Sub2Page1Store } from 'src/stores/app/menu-3/sub-2/page-1'
  import { API_INFO_CIAMS } from '@/config/config'
  import { InsideCollapse } from '@/components/common/collapse'

  const globalStore = useGlobalStore()
  const menu3Sub2Page1Store = useMenu3Sub2Page1Store()

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/image/'
  const imgSrc = prefixPath + '45252c84-6272-49dc-a246-62c8f581158c'

  onMounted(async () => {})

  onBeforeMount(() => {})

  onActivated(() => {})
</script>

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
</style>

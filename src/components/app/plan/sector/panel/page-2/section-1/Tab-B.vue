<template>
  <div
    class="border-box-square"
    style="display: flex; flex-direction: column; height: 100%; border: none; box-shadow: none"
  >
    <div class="header-title" style="">산업정비구역 지정기준 및 기본방향</div>
    <div class="" style="display: flex; height: 100%">
      <el-tabs v-model="activeName" type="border-card" :stretch="true" style="width: 100%">
        <el-tab-pane label="산업활성화구역" name="first" style="height: 100%">
          <TabB1 />
        </el-tab-pane>
        <el-tab-pane label="산업주거융합구역" name="second" style="height: 100%"
          ><TabB2
        /></el-tab-pane>
        <el-tab-pane label="산업입지촉진구역" name="third" style="height: 100%"
          ><TabB3
        /></el-tab-pane>
        <el-tab-pane label="지역산업육성구역" name="fourth" style="height: 100%"
          ><TabB4
        /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import TabB1 from '@/components/app/plan/sector/panel/page-2/section-1/Tab-B-1.vue'
  import TabB2 from '@/components/app/plan/sector/panel/page-2/section-1/Tab-B-2.vue'
  import TabB3 from '@/components/app/plan/sector/panel/page-2/section-1/Tab-B-3.vue'
  import TabB4 from '@/components/app/plan/sector/panel/page-2/section-1/Tab-B-4.vue'

  const activeName = ref('first')
</script>

<style scoped lang="scss">
  :deep(.el-tabs) {
    height: 100%;
  }

  .border-box-square:first-child {
    margin: 0;
  }

  .header-title {
    margin: 8px 0;
    color: #212121;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

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

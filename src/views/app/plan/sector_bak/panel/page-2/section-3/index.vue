<template>
  <PagePane :title="['공간관리방안', '지원기반시설 정비방안']">
    <template #center>
      <div class="container">
        <div class="center">
          <div class="left customScroll">
            <TabA />
          </div>
        </div>
      </div>
    </template>
  </PagePane>
</template>

<script setup lang="ts">
  import PagePane from '@/components/common/PagePane.vue'
  import TabA from '@/components/app/plan/sector/panel/page-2/section-3/Tab-A.vue'
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

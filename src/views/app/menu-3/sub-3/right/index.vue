<template>
  <div class="urbanInfo active" style="display: flex; flex-direction: column">
    <div style="display: flex; flex-direction: column; height: 100%">
      <div class="container" style="height: 54px">
        <div
          class="row"
          style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div
            class="title"
            style="align-items: center; display: flex; font-weight: 700; padding-bottom: 0"
          >
            <SvgIcon name="loc" style="color: #7aaad1; margin-right: 3px" />
          </div>
          <div></div>
        </div>
      </div>

      <div class="container customScroll" style="margin-top: 8px; flex: 1; padding: 5px">
        <div class=""></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted } from 'vue'
  import SvgIcon from '@/components/common/SvgIcon.vue'

  onBeforeMount(() => {})

  onMounted(async () => {})

  defineExpose({})
</script>

<style scoped lang="scss">
  :deep(.border-box-round) {
    background: #fff;
    border-radius: 8px;
    padding: 5px 15px !important;
    margin: 0 0 5px 0 !important;
  }

  .title {
    font-size: 17px;
    padding-bottom: 10px;
  }

  .customScroll {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    margin-top: 8px;
  }

  .tag {
    width: 105px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    //border: 1px solid #9e9e9e;
    font-size: 12px;
    font-weight: 600;
    color: white;
    box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.12);
  }

  .customTable tr > td:not([rowspan]) {
    border-left: 1px solid #e0e0e0;
  }
</style>

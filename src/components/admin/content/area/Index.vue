<template>
  <div id="contentArea" style="width: 100%; height: 100%">
    <div class="l-header">
      <span class="header-title">구역별 계획지정</span>
      <div class="right"></div>
    </div>
    <div class="content-wrap">
      <div class="content download">
        <!-- <div class="customCard customScroll scrollY left"> -->
        <Left @select-area="selectArea" style="border-radius: 8px; background: #fff" />
        <!-- </div> -->

        <div class="customCard customScroll scrollY right">
          <AreaMain :item="item" />
        </div>
      </div>
    </div>
    <div class="l-footer">
      <div class="customPagination"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, getCurrentInstance, reactive, ComponentInternalInstance } from 'vue'
  import Left from '@/components/admin/content/Left.vue'
  import AreaMain from '@/components/admin/content/area/AreaMain.vue'
  import { Plan } from '@/api/app/plan/model'

  const item = ref({} as Plan.Search.Row)

  function selectArea(_item: Plan.Search.Row) {
    Object.assign(item.value, _item)
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #contentArea .content.download .customCard {
    flex: auto;
  }
  #contentArea .left {
    margin: 0 8px;
    width: calc(29% - 16px) !important;
  }
  #contentArea .right {
    margin: 0 8px;
    width: calc(71% - 16px) !important;
  }
</style>

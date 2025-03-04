<template>
  <div id="config" style="width: 100%; height: 100%">
    <div class="l-header">
      <span class="header-title">시스템 코드 관리</span>
      <div class="right"></div>
    </div>
    <div class="content-wrap">
      <div class="content download">
        <div class="customCard customScroll scrollY left">
          <Left @select-type="selectTypeCall" />
        </div>

        <div class="customCard customScroll scrollY right">
          <Main :select-type="selectTypeObj" @select-config="selectConfigCall" />
        </div>
      </div>
    </div>
    <div class="l-footer">
      <span class="num"></span>
      <div class="customPagination"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import Left from '@/components/admin/config/Left.vue'
  import Main from '@/components/admin/config/Main.vue'
  import { useAdminConfigStore } from '@/stores/admin/config'

  const selectTypeObj = ref('')

  function selectTypeCall(obj) {
    useAdminConfigStore().getConfigList(obj.id)
    selectTypeObj.value = obj
  }

  function selectConfigCall() {
    useAdminConfigStore().getConfigList(selectTypeObj.value.id)
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference .content.download .customCard {
    flex: auto;
  }
  #config .left {
    margin: 0 8px;
    width: calc(26% - 16px) !important;
  }
  #config .right {
    margin: 0 8px;
    width: calc(74% - 16px) !important;
  }
</style>

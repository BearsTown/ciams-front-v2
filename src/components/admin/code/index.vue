<template>
  <div style="width: 100%; height: 100%">
    <div class="l-header">
      <span class="header-title">공통코드 관리</span>
      <div class="right"></div>
    </div>
    <div class="content-wrap">
      <div class="content download">
        <div class="customCard customScroll scrollY">
          <CodeTree ref="codeTreeRef" />
        </div>

        <div class="customCard customScroll scrollY">
          <CodeInfo />
        </div>
        <div class="customCard customScroll scrollY">
          <CodeList @change="change" />
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
  import CodeTree from '@/components/admin/code/CodeTree.vue'
  import CodeInfo from '@/components/admin/code/CodeInfo.vue'
  import CodeList from '@/components/admin/code/CodeList.vue'

  const codeTreeRef = ref()

  function change() {
    codeTreeRef.value.init()
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>

<template>
  <el-container style="height: 100%">
    <Left @select-type="selectTypeCall" />
    <el-container>
      <el-main style="margin: 0; padding: 0">
        <Main :select-type="selectTypeObj" @select-config="selectConfigCall" />
      </el-main>
    </el-container>
  </el-container>
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
<style scoped></style>

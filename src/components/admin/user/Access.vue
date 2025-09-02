<template>
  <div id="config" style="width: 100%; height: 100%">
    <div class="l-header">
      <span class="header-title">메뉴 접근 권한관리</span>
      <div class="right"></div>
    </div>
    <div class="content-wrap">
      <div class="content download">
        <div class="customCard customScroll scrollY left">
          <Left @select-type="selectTypeCall" />
        </div>

        <div class="customCard customScroll scrollY right">
          <el-tabs v-model="activeTab" type="border-card" style="height: 100%">
            <el-tab-pane
              :label="data.label"
              :name="data.category"
              v-for="data in groupData"
              :key="data.category"
              class="customScroll scrollX"
              style="height: 100%"
            >
              <Main
                ref="mainRef"
                v-if="selectTypeObj"
                :category="data.category"
                :select-type="selectTypeObj"
              />
            </el-tab-pane>
          </el-tabs>
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
  import Left from '@/components/admin/user/access/Left.vue'
  import Main from '@/components/admin/user/access/Main.vue'

  const selectTypeObj = ref('')
  const mainRef = ref()
  const activeTab = ref('menu')

  const groupData = [
    { label: '메뉴', category: 'menu' },
    { label: '사용자', category: 'user' },
  ]

  function selectTypeCall(obj) {
    selectTypeObj.value = obj
    // mainRef.value.getMenuList({ roleCode: obj.code })
  }

  // function selectConfigCall() {
  //   useAdminConfigStore().getConfigList(selectTypeObj.value.id)
  // }
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

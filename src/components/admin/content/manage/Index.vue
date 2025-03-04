<template>
  <div style="width: 100%; height: 100%">
    <div class="l-header">
      <span class="header-title">계획관리</span>
      <div class="right"></div>
    </div>
    <div class="content-wrap">
      <div class="content download">
        <div class="customCard customScroll scrollY">
          <el-tabs v-model="activeTab" type="border-card" @tab-click="handleClick">
            <el-tab-pane
              :label="data.label"
              :name="data.category"
              v-for="data in groupData"
              :key="data.category"
              style="height: 100%"
            >
              <ContentManage :category="data.category" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="l-footer">
      <div class="customPagination"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import ContentManage from '@/components/admin/content/manage/ContentManage.vue'
  import { TabsPaneContext } from 'element-plus'

  const groupData = [
    { label: '기반시설 계획', category: 'INFRA' },
    { label: '건축물 용도계획', category: 'BUILDINGUSE' },
    { label: '건축물 배치계획', category: 'BUILDINGLAYOUTPLAN' },
    { label: '환경관리 계획', category: 'ENVIRONMENT' },
    // { label: '계획수립현황', category: 'PLANNINGSTATUS' },
    { label: '경관계획', category: 'LANDSCAPEPLAN' },
    { label: '기타계획', category: 'OTHERPLANS' },
  ]

  const activeTab = ref('INFRA')

  const handleClick = (tab: TabsPaneContext, event: Event) => {
    // console.log(tab, event)
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>
<style scoped lang="scss"></style>

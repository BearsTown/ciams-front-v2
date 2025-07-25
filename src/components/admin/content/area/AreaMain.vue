<template>
  <div>
    <el-tabs v-model="activeTab" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        :label="data.label"
        :name="data.category"
        v-for="data in groupData"
        :key="data.category"
        class="customScroll scrollX"
        style="height: 100%"
      >
        <ContentManage :item="item" :category="data.category" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue'
  import ContentManage from '@/components/admin/content/area/ContentManage.vue'
  import { TabsPaneContext } from 'element-plus'

  const props = withDefaults(
    defineProps<{
      // optionLinkVers: { ver: string; planContentLinkId: string; useYn: 'Y' | 'N' }[]
      // planAreaId: string
      item: any
    }>(),
    {
      // optionLinkVers: () => [],
    },
  )

  const groupData = [
    { label: '기반시설 계획', category: 'INFRA' },
    { label: '건축물 용도계획', category: 'BUILDINGUSE' },
    { label: '건축물 배치계획', category: 'BUILDINGLAYOUTPLAN' },
    { label: '환경관리 계획', category: 'ENVIRONMENT' },
    { label: '경관계획', category: 'LANDSCAPEPLAN' },
    { label: '기타계획', category: 'OTHERPLANS' },
  ]

  const activeTab = ref('INFRA')
  const handleClick = (tab: TabsPaneContext, event: Event) => {}
  const planId = ref('')
  const planAreaId = ref('')

  watch(props.item, () => {
    planId.value = props.item.planId
    planAreaId.value = props.item.planAreaId
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>
<style scoped lang="scss"></style>

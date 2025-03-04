<template>
  <el-container style="height: 100%">
    <Left @select-area="selectArea" />
    <el-container>
      <el-main style="margin: 0; padding: 0">
        <!-- <Index :option-link-vers="optionLinkVers" :planAreaId="planAreaId" /> -->
        <Index :item="item" />
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
  import { ref, onMounted, getCurrentInstance, reactive, ComponentInternalInstance } from 'vue'
  import Left from '@/components/admin/content/Left.vue'
  import Index from '@/components/admin/content/area/Index.vue'
  import { Plan } from '@/api/app/plan/model'

  // const optionLinkVers = ref([])
  // const planAreaId = ref('')

  const item = ref({} as Plan.Search.Row)

  function selectArea(_item: Plan.Search.Row) {
    // let _optionLinkVers = areaLinkList.map((obj) => {
    //   return {
    //     ver: obj.ver,
    //     planContentLinkId: obj.planContentLinkId,
    //     useYn: obj.useYn,
    //   }
    // })
    // planAreaId.value = _planAreaId
    // optionLinkVers.value = _optionLinkVers

    Object.assign(item.value, _item)
  }
</script>
<style scoped></style>

<template>
  <div style="flex: 1; display: flex; flex-direction: column">
    <div style="height: 60px; display: flex; justify-content: flex-end">
      <el-popover
        :visible="hiddenVisible"
        placement="bottom"
        title="숨김여부 일괄 변경"
        :width="280"
      >
        <el-select v-model="hidden" size="small" placeholder="선택" style="width: 190px">
          <el-option label="공개" :value="false" />
          <el-option label="비공개" :value="true" />
        </el-select>
        <el-button size="small" style="margin-left: 15px" @click="modifyArchives"> 적용 </el-button>
        <template #reference>
          <el-button
            type="warning"
            @click="hiddenVisible = !hiddenVisible"
            size="small"
            style="margin: 0px 0px 0px 10px"
          >
            숨김여부
          </el-button>
        </template>
      </el-popover>
      <el-button type="danger" size="small" @click="deleteArchiveAll"> 삭제 </el-button>
      <el-button type="primary" size="small" @click="writeArchive"> 게시글 등록 </el-button>
    </div>
    <div style="flex: 1">
      <archive-list-table
        style="flex: 1"
        :activeArchiveList="props.activeArchiveList"
        @detail-view="detailView"
        @handle-selection-change="handleSelectionChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import CommonUtil from '@/utils/commonUtil'
  import archiveListTable from './archiveListTable.vue'

  const router = useRouter()

  const props = withDefaults(
    defineProps<{
      activeArchiveList: any[]
      pageInfo: PageInfo
    }>(),
    {
      total: 0,
    },
  )

  const emits = defineEmits<{
    (e: 'deleteArchiveAll', selectedArchive: {}): void
    (e: 'activePage', curPage: number): void
    (e: 'modifyArchives', selectedArchive: {}, hidden: boolean): void
    (e: 'searchArchive', searchKeyword: string): void
  }>()

  const selectedArchive = ref([])
  const hiddenVisible = ref(false)
  const hidden = ref()
  const searchKeyword = ref('')

  function detailView(contents) {
    router.push({ path: `/admin/archive/${contents.archiveId}` })
  }

  function writeArchive() {
    router.push(`/admin/archive/write`)
  }

  //숨김
  function modifyArchives() {
    if (!selectedArchive.value.length) {
      CommonUtil.errorMessage('선택된 게시물이 없습니다.')
    } else {
      emits('modifyArchives', selectedArchive.value, hidden.value)
      hiddenVisible.value = false
    }
  }

  function deleteArchiveAll() {
    if (!selectedArchive.value.length) {
      CommonUtil.errorMessage('선택된 게시물이 없습니다.')
    } else {
      emits('deleteArchiveAll', selectedArchive.value)
    }
  }

  function handleSelectionChange(val) {
    selectedArchive.value = val.map((data) => data.archiveId)
  }

  function getActivePage(curPage) {
    emits('activePage', curPage)
  }

  function searchArchive(e) {
    if (e && (e.isComposing || e.keyCode === 229)) {
      return
    }

    emits('searchArchive', searchKeyword.value)
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>
<style scoped>
  .header {
    float: right;
    padding: 10px 5px;
  }
</style>

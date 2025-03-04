<template>
  <el-table
    height="100%"
    :header-row-style="{ cursor: 'pointer', height: '60px' }"
    :row-style="{ cursor: 'pointer', height: '50px' }"
    :data="props.activeArchiveList"
    @row-click="detailView"
    @selection-change="handleSelectionChange"
    empty-text="데이터가 없습니다."
    border
    scrollbar-always-on
  >
    <el-table-column type="selection" width="55" align="center" />
    <el-table-column label="숨김여부" width="100" align="center">
      <template #default="scope">
        <el-tag size="small" v-if="!scope.row.hidden">공개</el-tag>
        <el-tag size="small" type="danger" v-else>비공개</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="left" prop="title" label="제목" />
    <el-table-column prop="regUser" width="100" align="center" label="작성자" />
    <el-table-column prop="regDate" width="200" align="center" label="등록일자">
      <!-- <template #default="scope">
        {{ scope.row.createDate.split('.')[0] }}
      </template> -->
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      activeArchiveList: any[]
    }>(),
    {},
  )

  const emits = defineEmits<{
    (e: 'handleSelectionChange', contents: []): void
    (e: 'detailView', contents: object): void
  }>()

  function handleSelectionChange(contents) {
    emits('handleSelectionChange', contents)
  }

  function detailView(content) {
    emits('detailView', content)
  }
</script>
<style scoped>
  :deep .el-button--text {
    padding: 0 !important;
  }
  .label {
    font-size: 13px;
    color: #aaa;
    margin: 0 10px;
  }

  :deep th.el-table__cell.is-leaf {
    border-top: 1px solid #e0e0e0;
    background-color: #f4f4f4;
  }

  .btn-view-border {
    background: white;
    border: 1px solid #44619b;
    color: #44619b;
  }
</style>

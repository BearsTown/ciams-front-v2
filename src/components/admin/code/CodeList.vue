<template>
  <div style="width: 100%">
    <div class="customCard-header">
      <div class="title">하위코드 정보</div>
      <div class="btn-group">
        <el-button type="primary" size="small" v-if="!editList" @click="editList = true"
          >코드 순서 편집
        </el-button>
        <el-button type="primary" size="small" v-if="editList" @click="changeCodePriority"
          >편집 완료
        </el-button>
      </div>
    </div>
  </div>
  <table class="customTable">
    <colgroup>
      <col width="15%" />
      <col width="30%" />
      <col width="30%" />
      <col width="25%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">순서</th>
        <th scope="col">코드</th>
        <th scope="col">코드명</th>
        <th scope="col">사용여부</th>
      </tr>
    </thead>
  </table>
  <!-- 데이터 없을때 -->
  <div
    v-if="selectedCode.children && !selectedCode.children[0].code"
    class="no-data"
    style="height: 99px"
  >
    데이터가 존재하지 않습니다.
  </div>
  <draggable
    v-else
    v-model="selectedCode.children"
    handle=".handle"
    item-key="code"
    style="width: 100%"
  >
    <template #item="{ element }">
      <table class="customTable body">
        <colgroup>
          <col width="15%" />
          <col width="30%" />
          <col width="30%" />
          <col width="25%" />
        </colgroup>
        <tbody>
          <tr>
            <td>
              <span v-if="editList" class="handle">
                <el-icon style="cursor: pointer"><DCaret /></el-icon>
              </span>
              <span v-else>{{ element.sortSn }}</span>
            </td>
            <td>{{ element.code }}</td>
            <td>{{ element.codeName }}</td>
            <td>
              <el-tag class="ml-2" v-if="element.useYn == 'N'" size="small" type="danger">
                미사용
              </el-tag>
              <el-tag class="ml-2" v-else-if="element.useYn === 'Y'" size="small"> 사용 </el-tag>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </draggable>
</template>
<script setup lang="ts">
  import { useCodeStore } from '@/stores/admin/code'
  import CommonUtil from '@/utils/commonUtil'
  import { storeToRefs } from 'pinia'
  import { ref } from 'vue'
  import draggable from 'vuedraggable'

  const codeStore = useCodeStore()
  const editList = ref(false)
  const drag = ref(false)
  const editSortCode = ref([] as any)

  const { selectedCode } = storeToRefs(codeStore)

  const emits = defineEmits<{
    (e: 'change'): void
  }>()

  function handleChange(obj) {
    editSortCode.value = editSortCode.value.filter((a) => a.code != obj.code)
    editSortCode.value.push(obj)
  }

  function changeCodePriority() {
    editList.value = false
    codeStore
      .changeCodePriority()
      .then(() => {
        CommonUtil.successMessage('코드 순서를 수정했습니다.')
        emits('change')
      })
      .catch((err) => {
        console.log(err)
        CommonUtil.errorMessage('코드 정보 수정 중에 오류가 발생했습니다.')
      })
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>
<style scoped>
  .header-c {
    color: #909399 !important;
    font-weight: bold;
  }
  .code-list {
    width: 100%;
    background-color: #ffffff;
    overflow: auto;
    display: flex;
    flex-direction: column;
    margin-bottom: 15px !important;
    margin-top: 15px;
  }

  .node-row {
    display: flex;
    width: 100%;
    align-items: center;
    border-bottom: 1px solid rgba(220, 223, 230, 0.6);
  }

  .node-row > div {
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 14px;
  }

  .node-row:hover {
    background-color: #eef2fa !important;
    cursor: pointer;
  }

  .node-row > div > span {
    line-height: 30px;
    padding: 0px 10px;
    word-break: break-all;
  }
</style>

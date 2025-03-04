<template>
  <el-table
    :header-row-style="{ cursor: 'pointer', height: '60px' }"
    :row-style="{ cursor: 'pointer', height: '50px' }"
    :data="userList"
    @selection-change="handleSelectionChange"
    @row-click="selectUser"
    border
    empty-text="데이터가 없습니다."
    scrollbar-always-on
  >
    <el-table-column type="selection" width="55" />

    <el-table-column label="상태" width="120" align="center">
      <template #default="scope">
        <div style="display: flex; flex-direction: column">
          <div>
            <el-tag v-if="scope.row.userRole == 'R9000'" type="warning" size="small">
              관리자
            </el-tag>
          </div>
          <div v-if="scope.row.roleYn === 'Y' && !scope.row.lock">
            <el-tag size="small"> 정상 </el-tag>
          </div>
          <div v-else-if="scope.row.roleYn == 'N'">
            <el-tag class="btn-view-border" size="small"> 승인대기 </el-tag>
          </div>
          <div v-if="scope.row.lock">
            <el-tag size="small" type="danger"> 잠김 </el-tag>
          </div>
        </div>
      </template>
    </el-table-column>

    <el-table-column
      v-for="item in userInfo"
      :key="item.value"
      :prop="item.value"
      :label="item.label"
      :width="item.width"
      align="center"
    />

    <el-table-column label="비밀번호" align="center" width="130">
      <template #default="scope">
        <el-button type="primary" link size="small" @click="initPass(scope.row.loginId)">
          초기화
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script setup lang="ts">
  defineProps({
    userList: {
      type: Array,
    },
  })

  const emit = defineEmits(['handleSelectionChange', 'initPass', 'openModifyDialog'])

  let userInfo = [
    {
      value: 'loginId',
      label: '아이디',
      width: 150,
    },
    {
      value: 'userName',
      label: '이름',
      width: 150,
    },
    {
      value: 'email',
      label: '이메일',
    },
  ]

  function handleSelectionChange(val) {
    emit('handleSelectionChange', val)
  }

  function initPass(loginId) {
    emit('initPass', loginId)
  }

  function selectUser(user, column) {
    if (column.label !== '비밀번호') {
      emit('openModifyDialog', user)
    }
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

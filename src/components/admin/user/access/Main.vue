<template>
  <div style="width: 100%">
    <div class="customCard-header">
      <div class="title">{{ empty(selectType) }}</div>
      <div class="btn-group">
        <el-select
          v-model="form.menuCode"
          style="width: 250px; padding-right: 10px"
          placeholder="메뉴선택"
          v-if="props.category == 'menu'"
        >
          <el-option
            v-for="item in menuList"
            :key="item.code"
            :label="item.codeName"
            :value="item.code"
          />
        </el-select>
        <button v-if="props.category == 'menu'" type="button" class="btn-green" @click="addRow">
          추가
        </button>
        <button v-else type="button" class="btn-green" @click="openDialog">추가</button>
      </div>
    </div>
  </div>

  <table class="customTable">
    <colgroup>
      <col style="width: 40%" />
      <col style="width: 60%" />
    </colgroup>
    <thead>
      <tr>
        <th scope="col">{{ props.category == 'menu' ? '코드명' : '아이디' }}</th>
        <th scope="col">{{ props.category == 'menu' ? '메뉴명' : '사용자명' }}</th>
      </tr>
    </thead>
  </table>

  <!-- 데이터 없을때 -->
  <div
    v-if="props.category == 'menu' && selectMenuList && selectMenuList.length == 0"
    class="no-data"
    style="height: 99px"
  >
    데이터가 존재하지 않습니다.
  </div>
  <!-- 데이터 없을때 -->
  <div
    v-else-if="props.category == 'user' && selectUserList && selectUserList.length == 0"
    class="no-data"
    style="height: 99px"
  >
    데이터가 존재하지 않습니다.
  </div>

  <table v-if="props.category == 'menu'" class="customTable body">
    <colgroup>
      <col style="width: 40%" />
      <col style="width: 60%" />
    </colgroup>
    <tbody>
      <tr v-for="(element, index) in selectMenuList" :key="index" style="cursor: pointer">
        <td>
          {{ element.accessMenuCode }}
        </td>
        <td style="display: flex; justify-content: space-between">
          <div>
            {{ element.accessMenuCodeName }}
          </div>
          <div>
            <el-icon style="color: red; font-size: 18px" @click.stop="deleteRow(element)"
              ><Delete
            /></el-icon>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <table v-else class="customTable body">
    <colgroup>
      <col style="width: 40%" />
      <col style="width: 60%" />
    </colgroup>
    <tbody>
      <tr v-for="(element, index) in selectUserList" :key="index" style="cursor: pointer">
        <td>
          {{ element.userId }}
        </td>
        <td style="display: flex; justify-content: space-between">
          <div>
            {{ element.userName }}
          </div>
          <div>
            <el-icon style="color: red; font-size: 18px" @click.stop="deleteRow(element)"
              ><Delete
            /></el-icon>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <el-dialog
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    width="50%"
    top="28vh"
    title="사용자 추가"
  >
    <div>
      <el-table
        :header-row-style="{ cursor: 'pointer', height: '30px' }"
        :row-style="{ cursor: 'pointer', height: '30px' }"
        :data="userList"
        @selection-change="handleSelectionChange"
        height="250px"
        empty-text="데이터가 없습니다."
        scrollbar-always-on
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column
          v-for="item in userInfo"
          :key="item.value"
          :prop="item.value"
          :label="item.label"
          align="center"
        />
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">취소</el-button>
        <el-button type="primary" @click="addRoleUser()">추가</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
  import { onMounted, ref, watch, onActivated } from 'vue'
  import commonUtil from '@/utils/commonUtil'
  import AccessService from '@/api/admin/access'
  import CodeService from '@/api/admin/code'
  import UserService from '@/api/admin/user'

  const dialogType = ref('ADD')
  const selectConfig = ref()
  const dialogVisible = ref(false)
  const dialogSeletedBox = ref([])
  const selectMenuList = ref([])
  const selectUserList = ref([])
  const menuList = ref<any>([])
  const userList = ref<any>([])

  const props = withDefaults(
    defineProps<{
      selectType: {
        codeName: string
        code: string
      }
      category: string
    }>(),
    {},
  )

  const form = ref({
    menuCode: '',
    roleCode: '',
  })

  let userInfo = [
    {
      value: 'loginId',
      label: '아이디',
      width: 240,
    },
    {
      value: 'userName',
      label: '사용자명',
      width: 240,
    },
  ]

  function openDialog() {
    dialogSeletedBox.value = []
    dialogVisible.value = true
    getDialogUserList()
  }

  function handleSelectionChange(selectedArr) {
    dialogSeletedBox.value = selectedArr
    console.log(selectedArr)
  }

  function addRoleUser() {
    let usersMap = dialogSeletedBox.value.map((a) => a.loginId)

    AccessService.add('user', {
      users: usersMap,
      roleCode: props.selectType.code,
    })
      .then((res) => {
        selectUserList.value = res.data

        commonUtil.successMessage('추가 되었습니다.')
      })
      .catch((err) => {
        console.log(err)
        commonUtil.errorMessage('추가 중 오류가 발생되었습니다.')
      })
      .finally(() => (dialogVisible.value = false))
  }

  function empty(obj) {
    console.log(obj)
    return obj?.codeName === null || obj?.codeName === undefined
      ? '-'
      : obj.codeName + ' [ ' + obj.code + ' ] '
  }

  function addRow() {
    let index = selectMenuList.value.findIndex((a) => {
      return a.accessMenuCode == form.value.menuCode
    })
    if (index > -1) {
      commonUtil.errorMessage('이미 추가된 메뉴입니다.')
      return
    } else if (!form.value.menuCode) {
      commonUtil.errorMessage('선택된 메뉴가 없습니다.')
      return
    }

    AccessService.add('role', {
      menus: [form.value.menuCode],
      roleCode: props.selectType.code,
    })
      .then((res) => {
        selectMenuList.value = res.data

        let obj = selectMenuList.value.find((a) => {
          return a.accessMenuCode == form.value.menuCode
        })
        let codeName = obj.accessMenuCodeName
        commonUtil.successMessage(codeName + ' 메뉴가 추가 되었습니다.')
      })
      .catch((err) => {
        console.log(err)
        commonUtil.errorMessage('추가 중 오류가 발생되었습니다.')
      })
  }

  function modifyRow(row) {
    dialogType.value = 'MOD'
    selectConfig.value = row
    dialogVisible.value = true
  }

  function deleteRow(row) {
    if (props.category == 'menu') {
      AccessService.delete('role', {
        menus: [row.accessMenuCode],
        roleCode: row.accessRoleCode,
      })
        .then((res) => {
          selectMenuList.value = res.data

          commonUtil.successMessage(row.accessMenuCodeName + ' 메뉴가 삭제 되었습니다.')
        })
        .catch((err) => {
          console.log(err)
          commonUtil.errorMessage('삭제 중 오류가 발생되었습니다.')
        })
    } else {
      AccessService.delete('user', {
        users: [row.userId],
        roleCode: row.accessRoleCode,
      })
        .then((res) => {
          selectUserList.value = res.data

          commonUtil.successMessage('삭제 되었습니다.')
        })
        .catch((err) => {
          console.log(err)
          commonUtil.errorMessage('삭제 중 오류가 발생되었습니다.')
        })
    }
  }

  function getMenuList(params) {
    AccessService.getList('role', params).then((res) => {
      selectMenuList.value = res.data
    })
  }

  function getUserList(params) {
    AccessService.getList('user', params).then((res) => {
      selectUserList.value = res.data
    })
  }

  function getDialogUserList() {
    let params = {
      page: false,
    }
    UserService.getList(params).then((res) => {
      userList.value = []
      res.data.list.forEach((element) => {
        let idx = selectUserList.value.findIndex((b) => element.loginId == b.userId)
        if (idx == -1) {
          userList.value.push(element)
        }
      })
      // userList.value = selectUserList.value.
    })
  }

  onMounted(() => {
    CodeService.getCodeList('R0200').then((res) => {
      menuList.value = res.data
    })
  })

  watch(props, () => {
    if (props.category == 'menu') {
      getMenuList({ roleCode: props.selectType.code })
    } else {
      getUserList({ roleCode: props.selectType.code })
    }
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>
<style scoped lang="scss">
  .main {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    // border-right: 1px solid rgb(224, 224, 224);
  }
  .sub-header {
    padding: 6px 15px;
    background-color: #eeeeee;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(224, 224, 224);
    border-right: 1px solid rgb(224, 224, 224);
  }
  :deep .table-row-opacity {
    opacity: 0.5;
    text-decoration: line-through;
  }

  :deep th.el-table__cell.is-leaf {
    border-top: 1px solid #e0e0e0;
    background-color: #f4f4f4;
  }
</style>

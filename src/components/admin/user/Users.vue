<template>
  <div style="width: 100%; height: 100%">
    <div class="l-header">
      <span class="header-title">사용자 / 권한관리</span>
      <div class="right">
        <div class="search">
          <el-select
            v-model="state"
            @change="alignState"
            collapse-tagsplaceholder="Select"
            style="width: 115px; padding-right: 10px"
          >
            <el-option
              v-for="item in stateOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <input
            type="text"
            class="customInput"
            v-model="searchValue"
            @keyup.enter="searchUser"
            placeholder="검색어를 입력하세요."
          />
          <button type="button" class="btn-search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.12195 1.31707C4.36372 1.31707 1.31707 4.36372 1.31707 8.12195C1.31707 11.8802 4.36372 14.9268 8.12195 14.9268C11.8802 14.9268 14.9268 11.8802 14.9268 8.12195C14.9268 4.36372 11.8802 1.31707 8.12195 1.31707ZM0 8.12195C0 3.63632 3.63632 0 8.12195 0C12.6076 0 16.2439 3.63632 16.2439 8.12195C16.2439 12.6076 12.6076 16.2439 8.12195 16.2439C3.63632 16.2439 0 12.6076 0 8.12195Z"
                fill="#757575"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.9243 12.9233C13.1815 12.6662 13.5985 12.6662 13.8556 12.9233L17.8069 16.8746C18.064 17.1317 18.064 17.5487 17.8069 17.8059C17.5497 18.0631 17.1327 18.0631 16.8755 17.8059L12.9243 13.8547C12.6672 13.5975 12.6672 13.1805 12.9243 12.9233Z"
                fill="#757575"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="content-wrap">
      <div class="content" style="height: 100%">
        <div class="customCard" style="height: 100%">
          <div class="subHeader">
            <div style="line-height: 50px">
              <span v-if="isTableBtnView">
                <el-button @click="tableDownloadVisible = true" size="small">
                  <el-icon><Download /></el-icon>템플릿 다운로드
                </el-button>
                <el-button @click="tableUploadVisible = true" size="small">
                  <el-icon><Upload /></el-icon>일괄 업로드
                </el-button>
              </span>
              <el-button size="small" class="btn-view" @click="changeState('approve')">
                <el-icon><User /></el-icon>승인처리
              </el-button>
              <el-button type="danger" size="small" @click="changeState('lock')">
                <el-icon><Lock /></el-icon>잠금
              </el-button>
              <el-button type="primary" size="small" @click="changeState('unlock')">
                <el-icon><Unlock /></el-icon>잠금해제
              </el-button>
              <el-button type="warning" size="small" @click="changeState('delete')">
                <el-icon><Delete /></el-icon>사용자삭제
              </el-button>
            </div>
          </div>
          <user-table
            style="flex: 1"
            :user-list="userList"
            @handle-selection-change="handleSelectionChange"
            @init-pass="initPass"
            @open-modify-dialog="openModifyDialog"
          />
        </div>
        <el-dialog
          v-model="modifyUserDialog"
          :close-on-click-modal="false"
          :destroy-on-close="true"
          width="30%"
          top="28vh"
          title="사용자 정보수정"
        >
          <el-form ref="modifyRef" :model="modifyUser" :rules="rules" label-width="100px">
            <el-form-item label="이름" prop="userName">
              <el-input
                v-model="modifyUser.userName"
                autocomplete="off"
                placeholder="사용자 이름"
                maxlength="20"
              />
            </el-form-item>
            <el-form-item label="이메일" prop="email">
              <el-input
                v-model="modifyUser.email"
                autocomplete="off"
                placeholder="이메일"
                maxlength="50"
              />
            </el-form-item>
            <el-form-item label="시스템 권한" prop="userRole">
              <el-select v-model="modifyUser.userRole" placeholder="사용자 권한">
                <el-option
                  v-for="item in roleOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-alert
                v-if="authUserName == modifyUser.loginId && modifyUser.userRole != 'R9000'"
                type="error"
                title="본인 권한(관리자)을 사용자로 변경 저장 시 로그아웃 처리됩니다."
                :closable="false"
                style="margin-top: 10px"
                show-icon
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="modifyUserDialog = false">취소</el-button>
              <el-button type="primary" @click="modifySave(modifyRef)">수정</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
    <div class="l-footer">
      <span class="num">총 {{ pageInfo.totalCount }}건</span>
      <div class="customPagination">
        <el-pagination
          @current-change="getActivePage"
          style="padding: 0"
          layout="prev, pager, next"
          :total="pageInfo.totalCount"
          :page-size="pageInfo.pageSize"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, getCurrentInstance, reactive, ComponentInternalInstance } from 'vue'
  import { cloneDeep } from 'lodash-es'
  import userTable from '@/components/admin/user/UserTable.vue'
  import { useUsersStore } from '@/stores/admin/users'
  import { storeToRefs } from 'pinia'
  import commonUtil from '@/utils/commonUtil'
  import { useAuthStore } from '@/stores/auth'
  const authStore = useAuthStore()
  const { userName: authUserName } = storeToRefs(authStore)

  const store = useUsersStore()
  const { userList, pageInfo } = storeToRefs(store)

  interface ImodifyUser {
    userName: string
    email: string
    userRole: string
  }

  interface IselectUser {
    lock: boolean
    loginId: string
    roleYn: 'Y' | 'N'
  }

  let stateOption = [
    {
      value: 3,
      label: '전체',
    },
    {
      value: 2,
      label: '승인대기',
    },
    {
      value: 1,
      label: '정상',
    },
    {
      value: 0,
      label: '잠김',
    },
  ]

  let roleOption = [
    {
      value: 'R9000',
      label: '관리자',
    },
    {
      value: 'R0001',
      label: '사용자',
    },
  ]

  let searchValue = ref('')
  let state = ref(3)
  let selectUsers = reactive([] as IselectUser[])
  let modifyUser = reactive({} as ImodifyUser)
  let tableDownloadVisible = ref(false)
  let tableUploadVisible = ref(false)
  let isTableBtnView = ref(false)
  let modifyUserDialog = ref(false)
  let modifyRef = ref()

  let rules = reactive({
    userName: [
      {
        required: true,
        validator: validateUsername,
        trigger: 'blur',
      },
    ],
    email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
    userRole: [
      {
        required: true,
        message: '권한을 선택하세요.',
        trigger: 'blur',
      },
    ],
  })

  function validateUsername(rule, value, callback) {
    if (!value || (value + '').trim().length == 0) {
      callback(new Error('이름을 입력하세요.'))
    } else {
      callback()
    }
  }
  function validateEmail(rule, value, callback) {
    var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}$/i

    if (!value || (value + '').trim().length == 0) {
      callback(new Error('이메일 주소를 입력하세요.'))
    } else if (!regExp.test(value)) {
      callback(new Error('이메일 주소 형식을 확인하십시오.'))
    } else {
      callback()
    }
  }

  function alignState(val) {
    switch (val) {
      case 0: {
        store.roleYn = null
        store.lock = true
        break
      }
      case 1: {
        store.lock = null
        store.roleYn = 'Y'
        break
      }
      case 2: {
        store.lock = null
        store.roleYn = 'N'
        break
      }
      case 3: {
        store.lock = null
        store.roleYn = null
        break
      }
      default:
        break
    }
    searchUser()
  }

  function searchUser() {
    store.keyword = searchValue.value
    store.getUserList()
  }

  function getActivePage(curPage) {
    store.pageInfo.pageNo = curPage
    searchUser()
  }

  function handleSelectionChange(val) {
    selectUsers = val
  }

  function initPass(loginId) {
    commonUtil
      .confirm(
        '비밀번호 초기화 하시겠습니까?<br><span style="font-size:9pt">(사용자 아이디로 초기화 됩니다)</span>',
        '',
        true,
      )
      .then(() => {
        store
          .initPassword(loginId)
          .then(() => {
            commonUtil.successMessage('초기화되었습니다.')
          })
          .catch(() => {
            commonUtil.errorMessage('초기화중에 오류가 발생했습니다.')
          })
      })
  }

  function openModifyDialog(user) {
    modifyUser = reactive(cloneDeep(user))
    modifyUserDialog.value = true
  }

  function modifySave(formName) {
    formName.validate((valid, fields) => {
      if (valid) {
        store
          .modifyUser(modifyUser)
          .then(() => {
            commonUtil.successMessage('수정되었습니다.')
            searchUser()
            modifyUserDialog.value = false

            if (authUserName.value == modifyUser.loginId && modifyUser.userRole != 'R9000') {
              authStore.logOut('loginOutAction')
            }
          })
          .catch((err) => {
            if (err.response.status === 409) {
              commonUtil.errorMessage(err.response.data)
            } else {
              commonUtil.errorMessage('수정 처리 중 에러가 발생했습니다.')
            }
          })
      } else {
        return false
      }
    })
  }

  function changeState(type) {
    const _myselfCheck = selectUsers.findIndex((a) => a.loginId == authUserName.value)
    if (selectUsers.length == 0) {
      commonUtil.errorMessage('선택된 사용자가 없습니다.')
    } else {
      switch (type) {
        case 'lock': {
          const _userList = selectUsers.filter((a) => !a.lock)
          if (checkConfirm(_userList)) {
            commonUtil.confirm('잠금 하시겠습니까?').then(() => {
              const _param = {
                lock: true,
                userList: _userList.map((a) => a.loginId),
              }
              store
                .updateLock(_param)
                .then(() => {
                  commonUtil.successMessage('잠금되었습니다.')
                  searchUser()
                })
                .catch(() => {
                  commonUtil.errorMessage('잠금 처리 중에 에러가 발생했습니다.')
                })
            })
          }

          break
        }
        case 'unlock': {
          const _userList = selectUsers.filter((a) => a.lock)
          if (checkConfirm(_userList)) {
            commonUtil.confirm('잠금해제 하시겠습니까?').then(() => {
              const _param = {
                lock: false,
                userList: _userList.map((a) => a.loginId),
              }
              store
                .updateLock(_param)
                .then(() => {
                  commonUtil.successMessage('잠금해제 되었습니다.')
                  searchUser()
                })
                .catch(() => {
                  commonUtil.errorMessage('잠금해제 처리 중에 에러가 발생했습니다.')
                })
            })
          }
          break
        }
        case 'approve': {
          const _userList = selectUsers.filter((a) => a.roleYn == 'N')
          if (checkConfirm(_userList, '승인')) {
            commonUtil.confirm('승인 하시겠습니까?').then(() => {
              const _param = {
                roleYn: 'Y',
                userList: _userList.map((a) => a.loginId),
              }
              store
                .updateApprove(_param)
                .then(() => {
                  commonUtil.successMessage('승인되었습니다.')
                  searchUser()
                })
                .catch(() => {
                  commonUtil.errorMessage('승인중에 에러가 발생했습니다.')
                })
            })
          }
          break
        }
        case 'delete': {
          if (_myselfCheck > -1) {
            commonUtil.errorMessage('본인 계정은 삭제 할 수 없습니다.')
          } else if (checkConfirm(selectUsers, '삭제')) {
            const userList = selectUsers.map((a) => a.loginId)

            commonUtil.confirm('삭제 하시겠습니까?').then(() =>
              store
                .deleteUser(userList)
                .then(() => {
                  commonUtil.successMessage('삭제되었습니다.')
                  searchUser()
                })
                .catch(() => {
                  commonUtil.errorMessage('삭제중에 에러가 발생했습니다.')
                }),
            )
          }
          break
        }
        default:
          commonUtil.errorMessage('취소되었습니다.')
          break
      }
    }
  }

  var checkConfirm = function (userList, msg?) {
    if (userList.length == 0) {
      commonUtil.errorMessage('처리가능한 사용자가 없습니다.')
      return false
    } else {
      return true
    }
  }

  onMounted(() => {
    store.getUserList()
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>

<style scoped>
  :deep(.el-table__cell) {
    text-align: center;
  }
  .colFlex {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .subHeader {
    height: 50px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    float: right;
  }
  :deep .el-input--small .el-input__icon {
    line-height: 30px;
  }
  .page {
    text-align: center;
    padding: 15px 10px;
    background-color: white;
  }
  :deep .el-dialog__body {
    padding: 10px;
  }

  .totalLabel {
    float: left;
    font-size: 14px;
    line-height: 30px;
  }

  .label {
    font-size: 13px;
    color: #aaa;
    margin-bottom: 0;
  }

  .upload-form {
    padding: 20px 15px;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin: 0 10px;
  }
  .upload-form:hover {
    color: #409eff;
    border: 1px solid #c0c4cc;
  }

  .btn-view {
    background: #44619b;
    color: white;
  }

  .btn-view-border {
    background: white;
    border: 1px solid #44619b;
    color: #44619b;
  }
</style>

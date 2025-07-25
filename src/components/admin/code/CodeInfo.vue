<template>
  <div style="width: 100%">
    <div class="customCard-header">
      <div class="title">코드 정보</div>
      <div class="btn-group">
        <button type="button" class="btn-green" v-if="selectedCode != null" @click="modifyCodeView">
          수정
        </button>
      </div>
    </div>
  </div>
  <div class="form">
    <div class="form-title">{{ selectedCode.codeName }}</div>
    <table class="customTable">
      <colgroup>
        <col width="41%" />
        <col width="59%" />
      </colgroup>
      <tbody>
        <tr>
          <th>부모코드</th>
          <td>{{ returnVal(selectedCode.parentCode) }}</td>
        </tr>
        <tr>
          <th>코드</th>
          <td>{{ selectedCode.code }}</td>
        </tr>
        <tr>
          <th>코드설명</th>
          <td>{{ returnVal(selectedCode.codeDesc) }}</td>
        </tr>
        <tr>
          <th>코드값</th>
          <td>{{ returnVal(selectedCode.codeVal) }}</td>
        </tr>
        <tr>
          <th>사용여부</th>
          <td>
            <el-tag v-if="selectedCode.useYn == 'N'" type="danger"> 미사용 </el-tag>
            <el-tag v-else-if="selectedCode.useYn === 'Y'"> 사용 </el-tag>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <el-dialog
    v-model="modifyCodeDialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    width="30%"
    top="28vh"
    title="코드 수정"
  >
    <el-form ref="modifyFormRef" :model="modifyCodeForm" :rules="rules" label-width="100px">
      <el-form-item label="코드명" prop="codeName">
        <el-input
          v-model="modifyCodeForm.codeName"
          autocomplete="off"
          placeholder="코드명"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="코드설명" prop="codeDesc">
        <el-input
          v-model="modifyCodeForm.codeDesc"
          autocomplete="off"
          placeholder="코드설명"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="코드값" prop="codeVal">
        <el-input
          v-model="modifyCodeForm.codeVal"
          autocomplete="off"
          placeholder="코드값"
          maxlength="100"
        />
      </el-form-item>
      <el-form-item label="사용여부" prop="useYn">
        <el-switch v-model="modifyCodeForm.useYn" active-value="Y" inactive-value="N" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="modifyCodeDialog = false">취소</el-button>
        <el-button type="primary" @click="modifyCode(modifyFormRef)">수정</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  interface Icode {
    parentCodeType: 'ROOT' | 'NODE'
    parentCode: string | null
    code: string
    codeName: string
    codeDesc: string
    codeVal: string
    useYn: 'Y' | 'N'
    children?: Icode[]
  }

  import { useCodeStore } from '@/stores/admin/code'
  import { storeToRefs } from 'pinia'
  import { ref } from 'vue'
  import { cloneDeep } from 'lodash-es'
  import CommonUtil from '@/utils/commonUtil'

  const codeStore = useCodeStore()

  const { selectedCode, codeTree, codeTreeRef } = storeToRefs(codeStore)
  const modifyCodeDialog = ref(false)
  const modifyCodeForm = ref({
    code: '',
    codeName: '',
    codeDesc: '',
    codeVal: '',
    useYn: '',
  })
  const modifyFormRef = ref({})

  const rules = {
    codeName: [{ required: true, validator: validateCodeName, trigger: 'blur' }],
  }

  function returnVal(value) {
    return CommonUtil.isEmpty(value) ? '-' : value
  }

  function validateCodeName(rule, value, callback) {
    if (!value || value.trim() + ''.length == 0) {
      callback(new Error('코드명을 입력하세요.'))
    } else {
      callback()
    }
  }

  function modifyCodeView() {
    modifyCodeForm.value = cloneDeep(selectedCode.value)
    modifyCodeDialog.value = true
  }

  function modifyCode(formName) {
    formName.validate((valid, fields) => {
      if (valid) {
        const _children = selectedCode.value.children
        codeStore
          .modifyCode(modifyCodeForm.value)
          .then((res: Icode) => {
            CommonUtil.successMessage('수정되었습니다.')
            modifyCodeDialog.value = false

            //결과 세팅
            selectedCode.value = res
            selectedCode.value.children = _children
          })
          .catch((err) => {
            console.log(err)
            CommonUtil.errorMessage('처리 중 에러가 발생했습니다.')
          })
      } else {
        return false
      }
    })
  }

  function removeSelectedCode() {
    CommonUtil.confirm('삭제 하시겠습니까?').then(() => {
      // console.log(codeTreeRef.value)
      codeStore
        .removeCode()
        .then(() => {
          CommonUtil.successMessage('선택한 코드를 삭제했습니다.')
        })
        .catch((err) => {
          console.log(err)
          if (err.response.status === 409) {
            CommonUtil.errorMessage('하위 코드가 존재해서 삭제 할 수 없습니다.')
          } else {
            CommonUtil.errorMessage('삭제 처리 도중 에러가 발생했습니다.')
          }
        })
    })
  }
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';
</style>
<style scoped>
  :deep .el-form-item__label {
    color: #909399 !important;
    font-weight: bold;
  }

  :deep .el-form-item__content {
    word-break: break-all;
  }
</style>

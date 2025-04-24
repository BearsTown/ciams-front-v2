<template>
  <div style="width: 100%">
    <div class="customCard-header">
      <div class="title">코드 목록</div>
      <div class="btn-group">
        <button type="button" class="btn-green" @click="addCodeF">코드 추가</button>
      </div>
    </div>
    <el-tree
      ref="codeTreeRef"
      :highlight-current="true"
      :data="codeTree"
      :props="defaultProps"
      :load="loadNode"
      node-key="code"
      lazy
      @node-click="handleNodeClick"
    />
  </div>

  <el-dialog
    v-model="addCodeDialog"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    width="30%"
    top="28vh"
    title="코드 추가"
  >
    <el-form ref="modifyRef" :model="newCodeForm" :rules="rules" label-width="100px">
      <el-form-item label="상위코드" prop="parentCodeType">
        <el-select v-model="newCodeForm.parentCodeType" placeholder="최상위 코드로 생성">
          <el-option label="최상위 코드로 생성" value="ROOT">최상위 코드로 생성</el-option>
          <el-option label="선택된 코드 하위에 생성" value="NODE"
            >선택된 코드 하위에 생성</el-option
          >
        </el-select>
        <span style="padding-left: 10px" v-if="newCodeForm.parentCodeType === 'NODE'">
          선택된 코드: {{ selectedCode.code }}
        </span>
      </el-form-item>
      <el-form-item label="코드" prop="code">
        <el-input v-model="newCodeForm.code" autocomplete="off" placeholder="코드" maxlength="20" />
      </el-form-item>
      <el-form-item label="코드명" prop="codeName">
        <el-input
          v-model="newCodeForm.codeName"
          autocomplete="off"
          placeholder="코드명"
          maxlength="50"
        />
      </el-form-item>
      <el-form-item label="코드설명" prop="codeDesc">
        <el-input
          v-model="newCodeForm.codeDesc"
          autocomplete="off"
          placeholder="코드설명"
          maxlength="200"
        />
      </el-form-item>
      <el-form-item label="코드값" prop="codeVal">
        <el-input
          v-model="newCodeForm.codeVal"
          autocomplete="off"
          placeholder="코드값"
          maxlength="100"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addCodeDialog = false">취소</el-button>
        <el-button type="primary" @click="addCode(modifyRef)">추가</el-button>
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
    children?: []
  }
  import { cloneDeep } from 'lodash-es'
  import { onMounted, reactive, ref } from 'vue'
  import { useCodeStore } from '@/stores/admin/code'
  import { storeToRefs } from 'pinia'
  import commonUtil from '@/utils/commonUtil'
  import { Tree } from 'element-plus/es/components/tree-v2/src/types'
  const editTree = ref(false)
  const selectedCodeId = ref('')

  const codeStore = useCodeStore()
  const { selectedCode, codeTree, codeTreeRef } = storeToRefs(codeStore)
  const newCodeForm = reactive({
    parentCodeType: 'ROOT',
    parentCode: '',
    code: '',
    codeName: '',
    codeDesc: '',
    codeVal: '',
    useYn: 'Y',
  } as Icode)
  const addCodeDialog = ref(false)
  const modifyRef = ref({})
  // const codeTreeRef = ref({});

  const rules = {
    code: [
      {
        required: true,
        validator: validateCode,
        trigger: 'blur',
      },
    ],
    codeName: [{ required: true, validator: validateCodeName, trigger: 'blur' }],
  }

  const regType = /^[A-Za-z0-9]*$/

  function validateCode(rule, value, callback) {
    if (!value || value.trim() + ''.length == 0) {
      callback(new Error('코드를 입력하세요.'))
    } else if (!regType.test(value)) {
      callback(new Error('영문 숫자만 입력할 수 있습니다.'))
    } else {
      callback()
    }
  }

  function validateCodeName(rule, value, callback) {
    if (!value || value.trim() + ''.length == 0) {
      callback(new Error('코드명을 입력하세요.'))
    } else {
      callback()
    }
  }

  function addCodeF() {
    newCodeForm.parentCodeType = 'ROOT'
    newCodeForm.parentCode = ''
    newCodeForm.code = ''
    newCodeForm.codeName = ''
    newCodeForm.codeDesc = ''
    newCodeForm.codeVal = ''
    addCodeDialog.value = true
  }

  function addCode(formName) {
    formName.validate((valid, fields) => {
      if (valid) {
        if (newCodeForm.parentCodeType === 'ROOT') {
          newCodeForm.parentCode = null
        } else {
          newCodeForm.parentCode = selectedCode.value.code
        }

        codeStore
          .addCode(newCodeForm)
          .then((res) => {
            commonUtil.successMessage('저장되었습니다.')
            addCodeDialog.value = false
            // addNewCodeOnTree(res)
            init()
          })
          .catch((err) => {
            console.log(err)
            if (err.response.status === 409) {
              commonUtil.errorMessage('중복된 코드값이 존재합니다.')
            } else {
              commonUtil.errorMessage('처리 중 에러가 발생했습니다.')
            }
          })
      } else {
        return false
      }
    })
  }

  function addNewCodeOnTree(code: any) {
    if (code.parentCode === null) {
      codeTree.value.push(code)
    } else {
      appendChildTree(codeTree.value, code)
      codeTree.value = cloneDeep(codeTree.value)
    }
  }

  function appendChildTree(arr, obj) {
    arr.forEach((a) => {
      if (a.code == obj.parentCode) {
        a.leaf = false
        if (!a.children) a['children'] = []
        a.children.push(obj)
      } else if (a.children && a.children.length > 0) {
        appendChildTree(a.children, obj)
      }
    })
  }

  function handleNodeClick(data) {
    selectedCode.value = data
  }

  function loadNode(node, resolve) {
    if (node.id !== 0 && node.data) {
      selectedCodeId.value = node.data.code
      const isLoaded = node.data.isLoaded
      const children = node.data.children

      if (isLoaded) {
        if (children && children.length > 0) {
          resolve(children)
        } else {
          resolve([])
        }
      } else {
        const codeId = node.data.code
        codeStore.getCodeList(codeId).then((res) => {
          node.data.isLoaded = true
          node.data.children = res

          resolve(res)
        })
      }
    }
  }

  const customNodeClass = (data: Tree, node: Node) => {
    console.log(data)
    if (selectedCode.value == data.code) {
      return 'is-select'
    }
    return null
  }

  const defaultProps = {
    label: 'codeName',
    children: 'children',
    isLeaf: 'leaf',
    class: customNodeClass,
  }

  function init() {
    codeStore
      .getCodeList(0)
      .then((res: Icode[]) => {
        console.log('codeTree Mount')
        const firstCode = res[0]
        selectedCodeId.value = firstCode.code
        selectedCode.value = firstCode
        codeTree.value = res

        return codeStore.getCodeList(firstCode.code)
      })
      .then((res: Icode[]) => {
        selectedCode.value.children = res

        codeTreeRef.value.setCurrentKey(selectedCodeId.value)
      })
      .catch((err) => {
        console.log(err)
        commonUtil.errorMessage('코드 정보 중에 오류가 발생했습니다. ')
      })
  }

  onMounted(() => {
    init()
  })

  defineExpose({
    init,
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  :deep .is-current {
    font-weight: bold;
    color: #7AAAD1;
  }
</style>
<style scoped>
  .sub-header {
    padding: 6px 15px;
    background-color: #eeeeee;
    display: flex;
    justify-content: space-between;
  }

  .sub-header > div > span {
    display: block;
    float: left;
    font-size: 13px;
    line-height: 27px;
  }

  .search-input {
    display: flex;
    padding: 6px 5px 7px 5px;
    border-top: 1px solid #e0e0e0;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
  }
  :deep .el-tree-node__content {
    padding-top: 3px !important;
    padding-bottom: 3px !important;
  }

  :deep .el-tree {
    overflow-x: auto;
    height: 100%;
  }

  :deep .el-tree-node > .el-tree-node__children {
    overflow: inherit;
  }

  .node {
    font-size: 13px;
    color: #303133;
    margin: 10px;
  }
</style>

<template>
  <el-dialog
    v-model="dialogVisible"
    @close="emits('close-dialog', false)"
    width="35%"
    top="10vh"
    :title="type == 'ADD' ? '설정 코드 추가' : '설정 코드 수정'"
  >
    <el-form ref="modifyRef" :model="modifyForm" :rules="rules" label-width="120px">
      <el-form-item label="ID" prop="id">
        <el-input
          v-model="modifyForm.id"
          :disabled="props.type == 'ADD' ? false : true"
          maxlength="36"
          autocomplete="off"
          placeholder="ID"
        />
      </el-form-item>
      <el-form-item
        :label="modifyForm.confType == 'GOSI_CONFIG' ? '고시명' : '설정명'"
        prop="confName"
      >
        <el-input
          v-model="modifyForm.confName"
          maxlength="128"
          autocomplete="off"
          placeholder="설정명"
        />
      </el-form-item>
      <el-form-item
        :label="modifyForm.confType != 'GOSI_CONFIG' ? '설정내용' : '수립대상지코드'"
        prop="confDesc"
      >
        <el-input
          v-model="modifyForm.confDesc"
          :autosize="{ minRows: 2, maxRows: 2 }"
          type="textarea"
          autocomplete="off"
          :placeholder="
            modifyForm.confType != 'GOSI_CONFIG' ? '설정내용' : '수립대상지코드(구분자 , )'
          "
        />
      </el-form-item>
      <el-form-item
        :label="modifyForm.confType == 'GOSI_CONFIG' ? 'URL링크' : '설정값'"
        prop="confValue"
      >
        <el-input
          v-model="modifyForm.confValue"
          maxlength="1024"
          autocomplete="off"
          placeholder="설정값"
        />
      </el-form-item>
      <el-form-item label="설정구분" prop="confType">
        <el-select v-model="modifyForm.confType" style="width: 250px" placeholder="선택">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.confName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="modifyForm.confType != 'GOSI_CONFIG'"
        label="데이터타입"
        prop="confValueType"
      >
        <el-select v-model="modifyForm.confValueType" style="width: 150px" placeholder="선택">
          <el-option label="문자열" value="STR" />
          <el-option label="파일" value="FILE" />
        </el-select>
      </el-form-item>
      <el-form-item label="사용여부" prop="used">
        <el-switch v-model="modifyForm.used" />
      </el-form-item>
      <el-form-item label="첨부파일" v-if="modifyForm.confValueType == 'FILE'">
        <!-- 기존 파일 -->
        <span v-if="modifyForm.attachFile" class="attachFile">
          {{ modifyForm.attachFile.orgName }}
          <el-icon class="el-icon-close" @click="handleOldRemove(modifyForm.attachFile)"
            ><CloseBold
          /></el-icon>
        </span>
        <input id="old-input-file" type="file" style="display: none" ref="oldFileUpload" />

        <!-- 신규 파일 -->
        <span v-if="newAttachFile.file" class="attachFile">
          {{ newAttachFile.fileName }}
          <el-icon class="el-icon-close" @click="handleRemove()"><CloseBold /></el-icon>
        </span>
        <input
          id="input-file"
          type="file"
          style="display: none"
          ref="fileUpload"
          @change="handleAttachChange"
        />

        <label v-if="!newAttachFile.file && !modifyForm.attachFile" for="input-file">
          <span style="cursor: pointer" class="upload-form">
            <el-icon><Plus /></el-icon>
          </span>
        </label>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button v-if="type == 'MOD'" type="warning" style="float: left" @click="deleteConf()"
        >삭제</el-button
      >
      <span class="dialog-footer">
        <el-button @click="emits('close-dialog', false)">취소</el-button>
        <el-button type="primary" @click="modify()">{{
          type == 'ADD' ? '추가' : '수정'
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs, watch } from 'vue'
  import commonUtil from '@/utils/commonUtil'
  import Config from '@/api/admin/config/model'
  import { cloneDeep } from 'lodash-es'
  import { useAdminConfigStore } from '@/stores/admin/config'
  import { storeToRefs } from 'pinia'
  import { File } from '@/api/app/file/model'
  const configStore = useAdminConfigStore()
  const { typeList } = storeToRefs(configStore)

  const props = withDefaults(
    defineProps<{
      visible: boolean
      type: 'ADD' | 'MOD'
      parentType: string
      config: Config.Result | {}
    }>(),
    {
      visible: false,
      type: 'ADD',
      parentType: '',
    },
  )

  const { type, visible, parentType } = toRefs(props)
  const newAttachFile = ref({} as any)
  const oldAttachFile = ref({} as any)

  const dialogVisible = computed({
    get() {
      return props.visible
    },
    set(visible) {
      return visible
    },
  })

  const emits = defineEmits<{
    (e: 'close-dialog', status: boolean): void
  }>()

  const modifyRef = ref()
  const initForm = ref({
    id: '',
    confName: '',
    confValue: '',
    confType: '',
    used: true,
    confValueType: 'STR',
    confDesc: '',
    confUrl: '',
    attachFile: null,
    removeFilesId: '',
  })
  const modifyForm = ref({
    id: '',
    confName: '',
    confValue: '',
    confType: '',
    used: true,
    confValueType: 'STR',
    confDesc: '',
    confUrl: '',
    attachFile: null,
    removeFilesId: '',
  })

  const rules = {
    id: [{ required: true, validator: validateId, trigger: 'blur' }],
    confName: [{ required: true, message: '설정명을 입력하세요', trigger: 'blur' }],
  }

  function validateId(rule, value, callback) {
    if (value === '') {
      callback(new Error('ID를 입력해주세요.'))
    } else {
      if (!/^[A-Z0-9-_][A-Z0-9-_]*$/.test(value)) {
        callback(new Error('ID는 영문 대문자, 숫자 및 -_를 조합해주세요.'))
      }
      callback()
    }
  }

  //수정 - 기존파일삭제처리
  function handleOldRemove(file) {
    modifyForm.value.removeFilesId = file.id
    modifyForm.value.attachFile = null
    oldAttachFile.value = {} as File
  }

  //신규 - 첨부파일 등록
  function handleAttachChange(event) {
    var files = event.target.files
    newAttachFile.value.file = files[0]
    newAttachFile.value.fileName = files[0].name
  }

  //신규 - 파일 삭제
  function handleRemove() {
    newAttachFile.value.file = null
  }

  function modify() {
    modifyRef.value.validate((valid) => {
      let typeNm = type.value == 'ADD' ? '추가' : '수정'
      if (valid) {
        //신규 첨부파일 추가
        let form = cloneDeep(modifyForm.value)
        form.attachFile = newAttachFile.value.file

        commonUtil.confirm(`${typeNm} 하시겠습니까?`, `${typeNm}`).then(() => {
          if (type.value == 'ADD') {
            useAdminConfigStore()
              .addConfig(form)
              .then(() => {
                commonUtil.successMessage(`${typeNm}했습니다.`)
                // getList()
                emits('close-dialog', true)
              })
              .catch((err) => {
                console.log(err)
                if (err.response.status === 409) {
                  commonUtil.errorMessage('중복된 ID값이 존재합니다.')
                } else {
                  commonUtil.errorMessage('처리 중 에러가 발생했습니다.')
                }
              })
          } else {
            useAdminConfigStore()
              .modifyConfig(form)
              .then(() => {
                commonUtil.successMessage(`${typeNm}했습니다.`)
                emits('close-dialog', true)
              })
              .catch((err) => {
                console.log(err)
                commonUtil.errorMessage('처리 중 에러가 발생했습니다.')
              })
          }
        })
      } else {
        return false
      }
    })
  }

  function deleteConf() {
    commonUtil.confirm(`삭제 하시겠습니까?`, `삭제`).then(() => {
      useAdminConfigStore()
        .deleteConfig(props.config.id)
        .then(() => {
          commonUtil.successMessage(`삭제 했습니다.`)
          emits('close-dialog', true)
        })
        .catch((err) => {
          console.log(err)
          commonUtil.errorMessage('처리 중 에러가 발생했습니다.')
        })
    })
  }

  watch(visible, () => {
    newAttachFile.value = {}
    oldAttachFile.value = {}

    if (type.value == 'MOD') {
      Object.assign(modifyForm.value, props.config)
    } else {
      Object.assign(modifyForm.value, initForm.value)
      modifyForm.value.confType = parentType.value
    }
  })
</script>

<style scoped>
  .attachFile {
    border: 1px solid #c0ccda;
    padding: 8px 15px;
    margin-right: 10px;
    border-radius: 6px;
    line-height: 30px;
    font-weight: bold;
  }
  .upload-form {
    cursor: pointer;
    border: 1px dashed #c0ccda;
    padding: 8px 10px;
    border-radius: 6px;
  }

  .upload-form:hover {
    border: 1px dashed #409eff;
  }

  .el-icon-close {
    color: #909399;
  }
  .el-icon-close:hover {
    color: #409eff;
  }
</style>

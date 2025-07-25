<template>
  <el-dialog
    v-model="dialogVisible"
    @close="emits('close-dialog', false)"
    width="35%"
    top="10vh"
    :title="type == 'ADD' ? '설정 구분 추가' : '설정 구분 수정'"
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
      <el-form-item label="설정명" prop="confName">
        <el-input
          v-model="modifyForm.confName"
          maxlength="128"
          autocomplete="off"
          placeholder="설정명"
        />
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
  import CommonUtil from '@/utils/commonUtil'
  import Config from '@/api/admin/config/model'
  import { useAdminConfigStore } from '@/stores/admin/config'

  const props = withDefaults(
    defineProps<{
      visible: boolean
      type: 'ADD' | 'MOD'
      config: Config.Result | {}
    }>(),
    {
      visible: false,
      type: 'ADD',
      config: () => {
        return {}
      },
    },
  )

  const { type, visible } = toRefs(props)

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
    confType: 'ROOT',
    used: true,
    confValueType: '',
    confDesc: '',
    confUrl: '',
  })
  const modifyForm = ref({
    id: '',
    confName: '',
    confValue: '',
    confType: 'ROOT',
    used: true,
    confValueType: '',
    confDesc: '',
    confUrl: '',
  })

  const rules = {
    id: [{ required: true, message: 'ID를 입력하세요', trigger: 'blur' }],
    confName: [{ required: true, message: '설정명을 입력하세요', trigger: 'blur' }],
  }

  function modify() {
    modifyRef.value.validate((valid) => {
      let typeNm = type.value == 'ADD' ? '추가' : '수정'
      if (valid) {
        CommonUtil.confirm(`${typeNm} 하시겠습니까?`, `${typeNm}`).then(() => {
          if (type.value == 'ADD') {
            useAdminConfigStore()
              .addConfig(modifyForm.value)
              .then(() => {
                CommonUtil.successMessage(`${typeNm}했습니다.`)
                // getList()
                emits('close-dialog', true)
              })
              .catch((err) => {
                console.log(err)
                if (err.response.status === 409) {
                  CommonUtil.errorMessage('중복된 ID값이 존재합니다.')
                } else {
                  CommonUtil.errorMessage('처리 중 에러가 발생했습니다.')
                }
              })
          } else {
            useAdminConfigStore()
              .modifyConfig(modifyForm.value)
              .then(() => {
                CommonUtil.successMessage(`${typeNm}했습니다.`)
                emits('close-dialog', true)
              })
              .catch((err) => {
                console.log(err)
                CommonUtil.errorMessage('처리 중 에러가 발생했습니다.')
              })
          }
        })
      } else {
        return false
      }
    })
  }

  function deleteConf() {
    CommonUtil.confirm(`삭제 하시겠습니까?`, `삭제`).then(() => {
      useAdminConfigStore()
        .deleteConfig(props.config.id)
        .then(() => {
          CommonUtil.successMessage(`삭제 했습니다.`)
          emits('close-dialog', true)
        })
        .catch((err) => {
          console.log(err)
          if (err.response.status === 409) {
            CommonUtil.errorMessage(err.response.data)
          } else {
            CommonUtil.errorMessage('처리 중 에러가 발생했습니다.')
          }
        })
    })
  }

  watch(visible, () => {
    if (type.value == 'MOD') {
      Object.assign(modifyForm.value, props.config)
    } else {
      Object.assign(modifyForm.value, initForm.value)
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

<template>
  <el-dialog
    v-model="dialogVisible"
    width="450px"
    align-center
    :fullscreen="false"
    :append-to-body="true"
    :destroy-on-close="true"
  >
    <template #header>{{ title }}</template>

    <div class="container">
      <div class="add-content customScroll scrollY">
        <el-form
          class="container-c"
          ref="ruleFormRef"
          :rules="rules"
          :model="contentMenuForm"
          style="flex: 1; overflow: auto"
          label-width="100px"
        >
          <el-form-item v-if="mode === 'ADD'" label="상위 목록">
            <el-input :placeholder="parentTitle" disabled />
          </el-form-item>
          <el-form-item label="제목" prop="title" required>
            <el-input v-model="contentMenuForm.title" clearable />
          </el-form-item>
          <el-form-item label="사용 여부" prop="useYn">
            <el-switch v-model="contentMenuForm.useYn" />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
      <div class="btn-group">
        <el-button type="success" @click="submitForm(ruleFormRef)"> 저장</el-button>
        <el-button @click="dialogVisible = false"> 취소</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue'
  import { FormInstance } from 'element-plus'

  import CommonUtil from '@/utils/commonUtil'

  import { addContentMenu, getContentMenu, updateContentMenu } from '@/api/admin/content-menu'

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      menuId?: number
      parentId?: number
      parentTitle: string
      mode: 'ADD' | 'EDIT'
    }>(),
    {
      modelValue: false,
      mode: 'ADD',
    },
  )

  const emits = defineEmits<{
    (e: 'update:success'): void
    (e: 'update:modelValue', status: boolean): void
  }>()

  const contentMenuForm = reactive<{
    title: string
    useYn: boolean
  }>({
    title: '',
    useYn: true,
  })

  const ruleFormRef = ref<FormInstance>()

  const rules = {
    title: [{ required: true, message: '제목을 입력해주세요', trigger: 'blur' }],
  }

  const title = computed<string>(() => {
    return `컨텐츠 목록 ${props.mode === 'ADD' ? '추가' : '수정'}`
  })

  const dialogVisible = computed<boolean>({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  async function submitForm(formEl: FormInstance | undefined) {
    if (!formEl) return

    await formEl.validate((valid, fields) => {
      if (valid) {
        const modeName = props.mode === 'ADD' ? '추가' : '수정'

        CommonUtil.confirm(`컨텐츠 목록을 ${modeName} 하시겠습니까?`, `${modeName}`)
          .then(async () => {
            if (props.mode === 'ADD') {
              await addContentMenu({
                ...contentMenuForm,
                parentId: props.parentId,
              })
            } else if (props.mode === 'EDIT') {
              await updateContentMenu({
                ...contentMenuForm,
                id: props.menuId,
              })
            }

            dialogVisible.value = false

            emits('update:success')
          })
          .then(() => {
            CommonUtil.successMessage(`${modeName} 성공.`)
          })
      } else {
        return
      }
    })
  }

  async function loadData(id: number) {
    const { data } = await getContentMenu(id)

    Object.keys(contentMenuForm).forEach((key) => {
      if (key in data) {
        contentMenuForm[key] = data[key]
      }
    })
  }

  function resetForm(formEl: FormInstance | undefined) {
    if (!formEl) return
    formEl.resetFields()
  }

  watch(
    () => dialogVisible.value,
    async (value: boolean) => {
      resetForm(ruleFormRef.value)

      if (value && props.mode === 'EDIT' && props.menuId) {
        await loadData(props.menuId!)
      }
    },
  )
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100% !important;
  }

  .add-content {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .container-c {
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
  }

  .customCard-header {
    height: auto !important;
    align-items: center;
    margin-bottom: 10px;
  }

  .btn-group {
    > .button {
      width: 80px;
    }

    :not(:disabled):hover {
      opacity: 0.8;
      transition: 0.3s;
    }

    :not(:first-child) {
      margin-left: 10px;
    }

    &.is-disabled {
      > button {
        cursor: not-allowed;
      }
    }
  }

  :deep(.el-button) {
    margin-left: 3px !important;
  }

  :deep(.el-form-item) {
    margin-bottom: 10px;
  }

  :deep(.ck.ck-editor) {
    margin-right: 0;
  }
</style>

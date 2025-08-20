<template>
  <el-dialog
    v-model="dialogVisible"
    width="75%"
    top="10vh"
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
          :model="contentForm"
          style="flex: 1; overflow: auto"
          label-width="100px"
        >
          <el-form-item label="제목" prop="title" required>
            <el-input v-model="contentForm.title" clearable />
          </el-form-item>
          <el-form-item label="사용 여부" prop="useYn">
            <el-switch v-model="contentForm.useYn" />
          </el-form-item>
          <el-form-item label="펼침 여부" prop="useCollapse">
            <el-switch v-model="contentForm.useCollapse" />
          </el-form-item>
          <el-form-item style="flex: 1; margin-bottom: 20px" label="내용" prop="content" required>
            <editor-form
              ref="editorRef"
              v-model="contentForm.content"
              type-code="content"
              :link-id="linkId"
            />
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
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import { FormInstance } from 'element-plus'

  import EditorForm from '@/components/admin/archive/EditorForm.vue'

  import CommonUtil from '@/utils/commonUtil'
  import { addContent, getContent, updateContent } from '@/api/admin/content'

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      parentId?: number
      menuId?: number
      mode: 'ADD' | 'EDIT'
    }>(),
    {
      modelValue: false,
      mode: 'ADD',
    },
  )

  const contentForm = reactive<{
    title: string
    content: string
    useYn: boolean
    useCollapse: boolean
  }>({
    title: '',
    content: '',
    useYn: true,
    useCollapse: true,
  })

  const editorRef = ref<InstanceType<typeof EditorForm>>()
  const linkId = ref<string>()
  const ruleFormRef = ref<FormInstance>()

  const rules = {
    title: [{ required: true, message: '제목을 입력해주세요', trigger: 'blur' }],
    content: [{ required: true, message: '내용을 입력해주세요', trigger: 'blur' }],
  }

  const title = computed(() => {
    return `컨텐츠 ${props.mode === 'ADD' ? '추가' : '수정'}`
  })

  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate((valid, fields) => {
      if (valid) {
        const modeName = props.mode === 'ADD' ? '추가' : '수정'

        CommonUtil.confirm(`컨텐츠를 ${modeName} 하시겠습니까?`, `${modeName}`)
          .then(async () => {
            console.log(editorRef.value.imageFileIds)

            if (props.mode === 'ADD') {
              await addContent({
                ...contentForm,
                menuId: props.parentId!,
                imageFileIds: editorRef.value.imageFileIds,
              })
            } else if (props.mode === 'EDIT') {
              await updateContent({
                ...contentForm,
                id: props.menuId!,
                menuId: props.parentId!,
                imageFileIds: editorRef.value.imageFileIds,
              })
            }

            dialogVisible.value = false
            emits('update:success')
          })
          .then(() => {
            CommonUtil.successMessage(`${modeName} 성공.`)
          })
        // .catch(() => {
        //   CommonUtil.errorMessage(`컨텐츠 ${modeName}중 오류가 발생했습니다.`)
        // })
      } else {
        return
      }
    })
  }

  async function loadData(id: number) {
    const { data } = await getContent(id)

    linkId.value = data.id

    // Object.assign(contentForm, data)
    Object.keys(contentForm).forEach((key) => {
      if (key in data) {
        contentForm[key] = data[key]
      }
    })
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

  const emits = defineEmits<{
    (e: 'update:success'): void
    (e: 'update:modelValue', status: boolean): void
  }>()

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  onMounted(() => {
    const fileInput = document.querySelector('.ck-file-dialog-button input[type="file"]')
    if (fileInput) {
      fileInput.setAttribute('accept', 'image/jpeg,image/png,image/gif') // 허용된 확장자
      fileInput.setAttribute('multiple', false) // 단일 파일 선택
    }
  })
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    height: 100% !important;
  }

  .add-content {
    width: 100%;
    height: 100%;
    max-height: 700px;
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

<template>
  <el-dialog
    v-model="dialogVisible"
    :show-close="true"
    @close="emits('close-dialog', false)"
    width="30%"
    top="10vh"
    :title="type == 'ADD' ? '컨텐츠 추가' : '컨텐츠 수정'"
  >
    <el-form ref="modifyRef" :model="modifyForm" :rules="rules" label-width="120px">
      <el-form-item label="제목" prop="title">
        <el-input v-model="modifyForm.title" maxlength="50" autocomplete="off" placeholder="제목" />
      </el-form-item>
      <el-form-item label="본문" prop="content">
        <el-input
          v-model="modifyForm.contents"
          :autosize="{ minRows: 8, maxRows: 8 }"
          type="textarea"
          autocomplete="off"
          placeholder="본문"
          show-word-limit
          maxlength="2000"
        />
      </el-form-item>
      <el-form-item label="펼침 여부" prop="isOpen">
        <el-switch v-model="modifyForm.isOpen" />
      </el-form-item>
      <el-form-item label="도로계획 여부" prop="isOpen">
        <el-switch v-model="modifyForm.isRoadPlan" />
      </el-form-item>
      <el-form-item label="첨부파일">
        <el-scrollbar>
          <div
            style="
              display: flex;
              vertical-align: middle;
              align-items: center;
              height: 140px;
              width: 100%;
            "
          >
            <div
              v-for="(file, index) in modifyForm.fileList"
              :key="index"
              class="file-preview-wrapper"
            >
              <div class="file-close-button" @click="handleRemove" :name="file.id">X</div>
              <img :src="prefixPath + file.id" />
            </div>

            <input
              id="input-file"
              type="file"
              style="display: none"
              ref="fileUpload"
              @change="handleAttachChange"
            />
            <div v-for="(file, index) in fileData" :key="index" class="file-preview-wrapper">
              <div class="file-close-button" @click="fileDelete" :name="file.number">X</div>
              <img :src="file.preview" />
            </div>
            <label for="input-file">
              <span style="cursor: pointer" class="upload-form">
                <el-icon><Plus /></el-icon>
              </span>
            </label>
          </div>
        </el-scrollbar>
      </el-form-item>
      <el-alert type="info" :closable="false">
        <p>첨부파일 용량은 최대 100MB까지 업로드 가능합니다.</p>
      </el-alert>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="emits('close-dialog', false)">취소</el-button>
        <el-button type="primary" @click="modify(modifyRef)">{{
          type == 'ADD' ? '추가' : '수정'
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs, watch } from 'vue'
  import { planContentAdd, planContentModify } from '@/api/app/planContent'
  import PlanContent from '@/api/app/planContent/model'
  import { cloneDeep } from 'lodash-es'
  import { API_INFO_CIAMS } from '@/config/config'
  import commonUtil from '@/utils/commonUtil'

  const props = withDefaults(
    defineProps<{
      visible: boolean
      type: 'ADD' | 'MOD'
      category: string
      selectItem: PlanContent.Search.Row
      sortSn?: number
    }>(),
    {
      visible: false,
      type: 'ADD',
      category: 'INFRA',
      sortSn: 0,
    },
  )

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

  const visible = toRefs(props).visible
  const type = toRefs(props).type
  const selectItem = toRefs(props).selectItem
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'
  const sortSn = toRefs(props).sortSn

  const modifyRef = ref()
  const modifyFormDialog = ref(props.visible)
  const modifyForm = ref({
    planContentId: '',
    title: '',
    contents: '',
    isOpen: true,
    isRoadPlan: false,
    sortSn: 0,
    category: 'INFRA',
    fileList: [] as any,
    file: [] as any,
    delList: [] as any,
  } as PlanContent.Mod)
  const initForm = {
    planContentId: '',
    title: '',
    contents: '',
    isOpen: true,
    isRoadPlan: false,
    sortSn: 0,
    category: 'INFRA',
    fileList: [],
    file: [],
    delList: [],
  }

  let fileData = ref(
    [] as {
      file: File
      preview: string
      number: number
    }[],
  )

  const fileUploadImageIndex = ref(0)
  const isEdit = ref(false)
  const drag = ref(false)
  const fileUpload = ref()

  const rules = {
    title: [{ required: true, message: '제목을 입력하세요', trigger: 'blur' }],
  }
  function modify(formName) {
    // modifyForm.value.file = upload.value.getFile()
    // return false
    if (fileData.value.length > 0) {
      let _file = fileData.value.map((a) => a.file)
      modifyForm.value.file = _file
    }

    if (type.value == 'ADD') {
      modifyForm.value.sortSn = sortSn.value + 1
    }

    formName.validate((valid, fields) => {
      let typeNm = type.value == 'ADD' ? '추가' : '수정'
      if (valid) {
        commonUtil.confirm(`${typeNm} 하시겠습니까?`, `${typeNm}`).then(() => {
          if (type.value == 'ADD') {
            planContentAdd('planContent', modifyForm.value)
              .then(() => {
                commonUtil.successMessage(`${typeNm}했습니다.`)
                modifyFormDialog.value = false
                // getList()
                emits('close-dialog', true)
              })
              .catch((err) => {
                console.log(err)
                commonUtil.errorMessage('오류가 발생했습니다.')
              })
          } else {
            planContentModify('planContent', modifyForm.value)
              .then(() => {
                commonUtil.successMessage(`${typeNm}했습니다.`)
                modifyFormDialog.value = false
                emits('close-dialog', true)
              })
              .catch((err) => {
                console.log(err)
                commonUtil.errorMessage('오류가 발생했습니다.')
              })
          }
        })
      } else {
        return false
      }
    })
  }

  function handleAttachChange(event) {
    var files = event.target.files
    var fileArr = Array.prototype.slice.call(files)
    let isFileExtCheck = true
    let isFileSizeCheck = true
    fileArr.forEach((f) => {
      if (!f.type.match('image/.*')) {
        isFileExtCheck = false
      }
      if (commonUtil.checkFileSizeValid(f.size, 'MB', 100)) {
        isFileSizeCheck = false
      }
    })

    if (!isFileSizeCheck) {
      commonUtil.errorMessage('첨부파일은 최대 100MB까지 업로드 가능합니다')
      return false
    }

    if (!isFileExtCheck) {
      commonUtil.errorMessage('이미지 확장자만 업로드 가능합니다.')
      return false
    }

    let num = fileUploadImageIndex.value
    for (let i = 0; i < files.length; i++) {
      fileData.value.push({
        //실제 파일
        file: files[i],
        //이미지 프리뷰
        preview: URL.createObjectURL(files[i]),
        //삭제및 관리를 위한 number
        number: i + num,
      })
    }
    fileUploadImageIndex.value = num + 1 //이미지 index의 마지막 값 + 1 저장

    fileUpload.value.value = '' //다시 동일한 파일을 추가할 경우,해당 파일이 추가되지 않음 수정(GS인증)
  }

  function fileDelete(event) {
    const id = event.target.getAttribute('name')
    fileData.value = fileData.value.filter((data) => data.number != Number(id))
  }

  function handleRemove(event) {
    const id = event.target.getAttribute('name')
    if (modifyForm.value.fileList) {
      let data = modifyForm.value.fileList.filter((a) => a.id != id)
      modifyForm.value.fileList = data
      console.log(modifyForm.value.delList)
      if (!modifyForm.value.delList) {
        modifyForm.value.delList = []
      }
      modifyForm.value.delList.push(id)
    }
    // data.file = data.file.filter((a) => a.id != id)
    // modifyForm.value.file.splice(modifyForm.value.file.value.indexOf(file), 1)
  }

  watch(visible, () => {
    fileData.value = []

    if (type.value == 'ADD') {
      modifyForm.value = cloneDeep(initForm)
      modifyForm.value.delList = []
    } else if (type.value == 'MOD') {
      modifyForm.value = cloneDeep(selectItem.value)
      modifyForm.value.delList = []
    }
    modifyForm.value.category = props.category
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

  .file-preview-wrapper {
    padding: 10px;
    position: relative;
  }

  .file-preview-wrapper > img {
    position: relative;
    width: 100px;
    height: 100px;
    z-index: 10;
  }
  .file-img-box {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
  }
  .file-close-button {
    position: absolute;
    /* align-items: center; */
    line-height: 18px;
    z-index: 99;
    font-size: 18px;
    right: 10px;
    top: 10px;
    color: #fff;
    font-weight: bold;
    background-color: #666666;
    width: 20px;
    height: 20px;
    text-align: center;
    cursor: pointer;
  }
</style>

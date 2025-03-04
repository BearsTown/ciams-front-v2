<template>
  <div class="container-c">
    <el-row class="header">
      <el-col :span="2">
        <el-button @click="goBack"> 취소 </el-button>
      </el-col>
      <el-col :span="20" class="mode">
        <span v-if="archiveId">게시글 수정</span>
        <span v-else>게시글 작성</span>
      </el-col>
      <el-col :span="2" style="text-align: right">
        <el-button type="primary" @click="saveArchive"> 저장</el-button>
      </el-col>
    </el-row>
    <el-divider />
    <el-form
      class="container-c"
      ref="uploadFormRef"
      :rules="rules"
      :model="content"
      style="flex: 1; overflow: auto"
      label-width="200px"
    >
      <el-form-item required style="margin-bottom: 10px" label="제목">
        <div style="display: flex; flex: 1">
          <el-form-item prop="categoryId">
            <el-select v-model="content.categoryId" style="width: 150px" placeholder="선택">
              <el-option
                v-for="item in writeCategoryList"
                :key="item.categoryId"
                :label="item.name"
                :value="item.categoryId"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="title" style="flex: 1; margin: 0 10px">
            <el-input v-model="content.title" clearable />
          </el-form-item>
        </div>
      </el-form-item>

      <!-- <el-divider /> -->
      <el-form-item label="내용" required prop="contents" style="height: 450px" class="content-box">
        <editor-form :content="editorData" @get-data="getData" />
      </el-form-item>

      <el-divider />
      <el-form-item label="첨부파일">
        <!-- 기존 파일 -->
        <span class="attachFile" v-for="file in oldAttachFiles" :key="file.id">
          {{ file.orgName }}
          <el-icon class="el-icon-close" @click="handleOldRemove(file)"><CloseBold /></el-icon>
        </span>
        <input id="old-input-file" type="file" multiple style="display: none" ref="oldFileUpload" />

        <!-- 신규 파일 -->
        <span class="attachFile" v-for="file in attachFiles" :key="file.id">
          {{ file.fileName }}
          <el-icon class="el-icon-close" @click="handleRemove(file)"><CloseBold /></el-icon>
        </span>
        <input
          id="input-file"
          type="file"
          multiple
          style="display: none"
          ref="fileUpload"
          @change="handleAttachChange"
        />

        <label for="input-file">
          <span style="cursor: pointer" class="upload-form">
            <el-icon><Plus /></el-icon>
          </span>
        </label>
      </el-form-item>

      <el-divider />
      <el-form-item label="대표이미지" style="flex: 1">
        <el-form-item
          prop="attachFiles"
          style="width: fit-content; display: flex; flex-direction: column"
        >
          <div style="display: flex; flex-direction: column">
            <div class="isImage" v-if="imgFilePreview" style="text-align: center">
              <el-image
                style="
                  max-width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                "
                :src="imgFilePreview"
                :preview-src-list="[imgFilePreview]"
                :zoom-rate="1.2"
                :initial-index="4"
                fit="cover"
              >
                <template #error>
                  <img src="/assets/image/no-image.png" title="이미지 없음" />
                </template>
              </el-image>
              <!-- <el-image :src="imgFilePreview" style="height: 100%; width: 100%" /> -->
            </div>
            <input
              type="file"
              ref="image"
              style="display: none"
              id="rep-file"
              accept="image/*"
              list-type="picture-card"
              @change="handleRepChange"
            />
            <label for="rep-file">
              <div class="imageBox" v-if="!imgFilePreview">
                <el-icon style="font-size: 50px; margin: 45px"><Picture /></el-icon>
              </div>
              <el-tag v-else class="changeImage" size="small" type="info" effect="dark">
                이미지 변경
              </el-tag>
            </label>
          </div>
        </el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
  import { useRoute, useRouter } from 'vue-router'
  import EditorForm from './EditorForm.vue'
  import { cloneDeep } from 'lodash-es'

  import { onMounted, ref } from 'vue'
  import { reactive } from 'vue'
  import commonUtil from '@/utils/commonUtil'
  import { API_INFO_CIAMS } from '@/config/config'
  import { useArchiveStore } from '@/stores/admin/archive'
  import { storeToRefs } from 'pinia'
  import { File } from '@/api/app/file/model'
  const archiveStore = useArchiveStore()
  const { categoryList } = storeToRefs(archiveStore)

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'
  const route = useRoute()
  const router = useRouter()
  const archiveId = route.params.archiveId
  const writeCategoryList = ref([] as any[])

  const rules = {
    title: [{ required: true, message: '제목을 입력해주세요', trigger: 'blur' }],
    contents: [{ required: true, message: '내용을 입력해주세요', trigger: 'blur' }],
    categoryId: [{ required: true, message: ' ', trigger: 'blur' }],
  }

  const content = reactive({
    archiveId: '',
    title: '',
    contents: '',
    attachFiles: [] as File[],
    imgFile: {} as File,
    removeFilesIds: [] as string[],
    categoryId: '',
  })

  const uploadFormRef = ref()
  const attachFiles = ref([] as any)
  const oldAttachFiles = ref([] as File[])
  const oldImgFileId = ref('')
  const imgFile = ref()
  const imgFilePreview = ref()
  const fileUploadIndex = ref(0)
  const editorData = ref('')

  //에디터 데이터 셋팅
  function getData(data) {
    editorData.value = data
  }

  //목록이동
  function goBack() {
    if (archiveId) {
      router.push(`/admin/archive/${archiveId}`)
    } else {
      router.push('/admin/archive')
    }
  }

  //신규 - 첨부파일 등록
  function handleAttachChange(event) {
    var files = event.target.files
    var fileArr = Array.prototype.slice.call(files)
    /* let isFileExtCheck = true
    fileArr.forEach(function (f) {
      if (!f.type.match('image/.*')) {
        isFileExtCheck = false
      }
    })

    if (!isFileExtCheck) {
      commonUtil.errorMessage('이미지 확장자만 업로드 가능합니다.')
      return false
    } */

    let num = fileUploadIndex.value
    for (let i = 0; i < files.length; i++) {
      attachFiles.value.push({
        //실제 파일
        file: files[i],
        fileName: files[i].name,
        //삭제및 관리를 위한 number
        number: i + num,
      })
    }
    fileUploadIndex.value = num + 1 //이미지 index의 마지막 값 + 1 저장
  }

  //수정 - 대표이미지
  function handleRepChange(event) {
    if (oldImgFileId.value) {
      content.removeFilesIds.push(oldImgFileId.value)
    }
    imgFile.value = event.target.files[0]
    imgFilePreview.value = URL.createObjectURL(event.target.files[0])
  }

  //수정 - 기존파일삭제처리
  function handleOldRemove(file) {
    content.removeFilesIds.push(file.id)
    oldAttachFiles.value.splice(oldAttachFiles.value.indexOf(file), 1)
  }

  //신규 - 파일 삭제
  function handleRemove(file) {
    attachFiles.value.splice(attachFiles.value.indexOf(file), 1)
  }

  //등록 및 수정
  function saveArchive() {
    content.contents = editorData.value

    uploadFormRef.value.validate((valid, fields) => {
      let typeNm = !archiveId ? '추가' : '수정'

      if (valid) {
        commonUtil.confirm(`${typeNm} 하시겠습니까?`, `${typeNm}`).then(() => {
          let data = cloneDeep(content)
          data.contents = editorData.value
          attachFiles.value.forEach((obj) => data.attachFiles.push(obj.file))
          data.imgFile = imgFile.value

          if (!archiveId) {
            archiveStore
              .addArchive(data)
              .then((res) => {
                commonUtil.successMessage(`${typeNm}했습니다.`)
                router.push(`/admin/archive/${res.archiveId}`)
              })
              .catch((err) => {
                console.log(err)
                commonUtil.errorMessage('오류가 발생했습니다.')
              })
          } else {
            archiveStore
              .modifyArchive(data)
              .then((res) => {
                commonUtil.successMessage(`${typeNm}했습니다.`)
                router.push(`/admin/archive/${res.archiveId}`)
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

  onMounted(() => {
    const _archiveId = route.params.archiveId as string
    if (_archiveId) {
      archiveStore.getArchiveDetail(_archiveId).then((res) => {
        let _archive = cloneDeep(res)
        content.archiveId = _archiveId
        content.title = _archive.title
        content.categoryId = _archive.categoryId
        content.contents = _archive.contents
        editorData.value = _archive.contents
        oldAttachFiles.value = _archive.archiveFiles.filter((data) => data.typeCode === 'archive')
        let imgFile = _archive.archiveFiles.filter((data) => data.typeCode === 'archiveImg')
        if (imgFile.length > 0) {
          imgFilePreview.value = prefixPath + imgFile[0].id
          oldImgFileId.value = imgFile[0].id
        }
      })
    }

    archiveStore.getCategoryList().then((res) => {
      writeCategoryList.value = res.filter((a) => a.isLink !== true)
    })
  })
</script>
<style scoped>
  .container-c {
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
  }

  .header {
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
  }

  :deep .el-divider--horizontal {
    margin: 10px 0;
  }

  .mode {
    font-weight: bold;
    text-align: center;
    font-size: 25px;
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
    cursor: pointer;
  }
  .el-icon-close:hover {
    color: #409eff;
    cursor: pointer;
  }

  .attachFile {
    border: 1px solid #c0ccda;
    padding: 8px 15px;
    margin-right: 10px;
    border-radius: 6px;
    line-height: 30px;
    font-weight: bold;
  }

  :deep .el-form-item__label {
    text-align: center;
    font-weight: bold;
    color: #606266;
    /* line-height: 40px; */
  }

  :deep .el-form-item {
    margin-bottom: 0;
  }

  .content-box {
    margin-bottom: 22px;
    border-top: 1px solid #dcdfe6;
    padding-top: 10px;
  }

  :deep .el-form-item__content {
    height: 100%;
  }

  :deep .ck.ck-editor {
    margin-right: 10px;
  }

  :deep .ck-editor__editable {
    height: 420px;
    overflow: auto;
  }

  :deep .el-form-item__error {
    text-align: left;
    width: 160px;
  }

  .imageBox,
  .isImage {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 140px;
    height: 140px;
  }

  .isImage:hover {
    border-color: #909399;
  }

  .imageBox:hover {
    border-color: #409eff;
  }

  .el-icon-picture {
    font-size: 28px;
    color: #8c939d;
    line-height: 140px;
    text-align: center;
    width: 140px;
    height: 140px;
  }

  .changeImage {
    width: 100%;
    text-align: center;
    cursor: pointer;
  }

  .changeImage:hover {
    background-color: #606266;
  }
</style>

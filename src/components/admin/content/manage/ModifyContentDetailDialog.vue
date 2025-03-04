<template>
  <el-dialog
    v-model="dialogVisible"
    @close="emits('close-dialog', false)"
    width="30%"
    top="10vh"
    :title="type == 'ADD' ? '컨텐츠 추가' : '컨텐츠 수정'"
  >
    <el-form ref="modifyRef" :model="modifyForm" :rules="rules" label-width="120px">
      <el-form-item label="제목" prop="title">
        <el-input v-model="modifyForm.title" maxlength="50" autocomplete="off" placeholder="제목" />
      </el-form-item>
      <div style="text-align: right; height: 40px">
        <span style="cursor: pointer" @click="addContent()" class="plus-btn">
          <el-icon><Plus /></el-icon>
        </span>
      </div>
      <el-scrollbar max-height="300px">
        <div
          style="
            align-items: center;
            /* padding-bottom: 10px; */
            border: 1px dashed #c0ccda;
            padding: 5px;
            margin: 5px;
            border-radius: 6px;
          "
          v-for="(obj, detailIndex) in modifyForm.detailList"
          :key="obj.planContentDetailId"
        >
          <div style="display: flex">
            <div style="padding: 10px; text-align: center">
              <el-select v-show="modifyForm.isType" v-model="obj.typeName" placeholder="용도 종류">
                <el-option
                  v-for="option in optionList"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
              <el-button type="danger" plain style="margin-top: 10px" @click="delContent(obj)"
                >삭제</el-button
              >
            </div>
            <el-input
              v-model="obj.contents"
              :autosize="{ minRows: 5, maxRows: 5 }"
              type="textarea"
              autocomplete="off"
              placeholder="본문"
              show-word-limit
              maxlength="2000"
            />
          </div>
          <div v-show="!modifyForm.isType" class="box-file">
            <div style="padding: 5px; width: 76px; text-align: center">첨부파일</div>
            <div style="width: calc(100% - 76px)">
              <el-scrollbar>
                <div class="unit">
                  <div
                    v-for="(file, index) in obj.fileList"
                    :key="index"
                    class="file-preview-wrapper"
                  >
                    <div
                      class="file-close-button"
                      @click="handleRemove(file.id, obj)"
                      :name="file.id"
                    >
                      X
                    </div>
                    <img :src="prefixPath + file.id" />
                  </div>

                  <input
                    :id="'input-file' + detailIndex"
                    type="file"
                    style="display: none"
                    ref="fileUpload"
                    @change="newFileChange('input-file' + detailIndex, obj)"
                  />
                  <div
                    v-for="(file, index) in obj.newFileList"
                    :key="index"
                    class="file-preview-wrapper"
                  >
                    <div
                      class="file-close-button"
                      @click="newFileDelete(obj, file.number)"
                      :name="file.number"
                    >
                      X
                    </div>
                    <img :src="file.preview" />
                  </div>
                  <label :for="'input-file' + detailIndex">
                    <span style="cursor: pointer" class="upload-form">
                      <el-icon><Plus /></el-icon>
                    </span>
                  </label>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <el-alert
            v-show="!modifyForm.isType"
            type="info"
            :closable="false"
            style="margin-top: 5px"
          >
            <p>첨부파일 용량은 최대 100MB까지 업로드 가능합니다.</p>
          </el-alert>
        </div>
      </el-scrollbar>
      <el-form-item label="용도종류선택 여부" prop="isTypeChoice">
        <el-switch v-model="modifyForm.isType" />
      </el-form-item>
      <el-alert
        v-show="!modifyForm.isType"
        type="info"
        :closable="false"
        style="margin-bottom: 18px"
      >
        용도종류로 변경시 기존에 등록한 파일은 삭제됩니다.
      </el-alert>
      <el-form-item label="도로계획 여부" prop="isRoadPlan">
        <el-switch v-model="modifyForm.isRoadPlan" />
      </el-form-item>
      <el-form-item label="펼침 여부" prop="isOpen">
        <el-switch v-model="modifyForm.isOpen" />
      </el-form-item>
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
  import commonUtil from '@/utils/commonUtil'
  import { API_INFO_CIAMS } from '@/config/config'
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'

  const props = withDefaults(
    defineProps<{
      visible: boolean
      type: 'ADD' | 'MOD'
      category: string
      selectItem: PlanContent.Search.Row
      // sortSn?: number
    }>(),
    {
      visible: false,
      type: 'ADD',
      category: 'INFRA',
      // sortSn: 0,
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
  // const sortSn = toRefs(props).sortSn
  // const isTypeChoice = ref(false)

  const modifyRef = ref()
  const modifyFormDialog = ref(props.visible)
  const modifyForm = ref({
    planContentId: '',
    title: '',
    contents: '',
    isOpen: true,
    isRoadPlan: false,
    category: 'INFRA',
    detailList: [] as any,
    delList: [] as any,
    sortSn: 0,
    isType: false,
  } as PlanContent.Mod)
  const initForm = {
    planContentId: '',
    title: '',
    contents: '',
    isOpen: true,
    isRoadPlan: false,
    category: 'INFRA',
    detailList: [],
    delList: [],
    sortSn: 0,
    isType: false,
  }

  const optionList = [
    {
      label: '권장용도',
      value: '권장용도',
    },
    {
      label: '허용용도',
      value: '허용용도',
    },
    {
      label: '불허용도',
      value: '불허용도',
    },
  ]

  const rules = {
    title: [{ required: true, message: '제목을 입력하세요', trigger: 'blur' }],
  }

  function modify(formName) {
    // if (type.value == 'ADD') {
    //   modifyForm.value.sortSn = sortSn.value + 1
    // }

    if (modifyForm.value.detailList.length < 1) {
      commonUtil.errorMessage('최소 1개이상의 상세정보 입력이 필요합니다.')

      return false
    }
    formName.validate((valid, fields) => {
      let typeNm = type.value == 'ADD' ? '추가' : '수정'
      if (valid) {
        commonUtil.confirm(`${typeNm} 하시겠습니까?`, `${typeNm}`).then(() => {
          let params = makeFormData(cloneDeep(modifyForm.value))

          if (type.value == 'ADD') {
            planContentAdd(params)
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
            planContentModify(params)
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

  function addContent() {
    if (modifyForm.value.detailList && modifyForm.value.detailList.length >= 10) {
      commonUtil.errorMessage('최대 10개까지만 추가 가능합니다.')
      return false
    }

    if (!modifyForm.value.detailList) modifyForm.value.detailList = []

    let sortMaxNo = 0
    if (modifyForm.value.detailList.length > 1) {
      let maxSortSnObj = modifyForm.value.detailList.reduce((prev, value) => {
        return prev.sortSn >= value.sortSn ? prev : value
      })
      sortMaxNo = maxSortSnObj.sortSn
    } else if (modifyForm.value.detailList.length == 1) {
      sortMaxNo = modifyForm.value.detailList[0].sortSn
    }
    modifyForm.value.detailList.push({
      planContentDetailId: '',
      planContentId: '',
      typeName: '',
      contents: '',
      sortSn: sortMaxNo + 1,
    })
  }

  function delContent(obj) {
    if (!modifyForm.value['delList']) modifyForm.value['delList'] = []
    if (obj.planContentDetailId) modifyForm.value.delList.push(obj.planContentDetailId)
    if (modifyForm.value.detailList) {
      modifyForm.value.detailList = modifyForm.value.detailList.filter((data) => {
        return data.sortSn != Number(obj.sortSn)
      })
    }
  }

  function handleRemove(id, obj) {
    if (obj.fileList) {
      obj.fileList = obj.fileList.filter((a) => a.id != id)
      if (!obj['delFileList']) {
        obj['delFileList'] = []
      }
      obj['delFileList'].push(id)
    }
  }

  function newFileChange(id, obj) {
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

    let num = obj['fileUploadImageIndex'] ? obj['fileUploadImageIndex'] : 0
    if (!obj['newFileList']) {
      obj['newFileList'] = []
    }
    for (let i = 0; i < files.length; i++) {
      obj['newFileList'].push({
        //실제 파일
        file: files[i],
        //이미지 프리뷰
        preview: URL.createObjectURL(files[i]),
        //삭제및 관리를 위한 number
        number: i + num,
      })
    }
    obj['fileUploadImageIndex'] = num + 1 //이미지 index의 마지막 값 + 1 저장

    document.getElementById(id).value = '' //다시 동일한 파일을 추가할 경우,해당 파일이 추가되지 않음 수정(GS인증)
  }

  function newFileDelete(obj, id) {
    obj['newFileList'] = obj['newFileList'].filter((data) => data.number != Number(id))
  }

  function makeFormData(data) {
    const formData = new FormData()
    Object.keys(data).map((key) => {
      if (key != 'detailList') formData.append(key, data[key])
      if (key == 'sortNo') formData.append('sortNo', 0)
    })
    for (let i = 0; i < data.detailList.length; i++) {
      Object.keys(data.detailList[i]).map((key, index) => {
        if (key == 'newFileList') {
          for (let j = 0; j < data.detailList[i].newFileList.length; j++) {
            formData.append(
              'detailList[' + i + '].newFileList[' + j + ']',
              data.detailList[i].newFileList[j].file,
            )
          }
        } else if (key == 'delFileList') {
          for (let j = 0; j < data.detailList[i].delFileList.length; j++) {
            formData.append(
              'detailList[' + i + '].delFileList[' + j + ']',
              data.detailList[i].delFileList[j],
            )
          }
        } else {
          //용도종류선택 false인 경우 typeName 초기화
          if (key == 'typeName' && !data.isType) {
            formData.append('detailList[' + i + '].' + key, '')
          } else {
            formData.append('detailList[' + i + '].' + key, data.detailList[i][key])
          }
        }
      })
    }
    return formData
  }

  watch(visible, () => {
    if (type.value == 'ADD') {
      modifyForm.value = cloneDeep(initForm)
      modifyForm.value.delList = []
      modifyForm.value.category = props.category
    } else if (type.value == 'MOD') {
      modifyForm.value = cloneDeep(selectItem.value)
      modifyForm.value.delList = []
    }
  })
</script>

<style scoped lang="scss">
  .plus-btn {
    cursor: pointer;
    border: 1px dashed #c0ccda;
    padding: 8px 10px;
    border-radius: 6px;
  }

  .plus-btn:hover {
    border: 1px dashed #409eff;
  }

  .el-icon-close {
    color: #909399;
  }
  .el-icon-close:hover {
    color: #409eff;
  }

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
    padding-left: 5px;
    padding: 8px 10px;
    border-radius: 6px;
    margin: 5px;
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
    width: 85px;
    height: 85px;
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

  .box-file {
    display: flex;
    align-items: center;
    margin-top: 5px;
    .unit {
      border: 1px dashed rgb(192, 204, 218);
      border-radius: 6px;
      display: flex;
      vertical-align: middle;
      align-items: center;
      height: 110px;
      width: 100%;
    }
  }
</style>

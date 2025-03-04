<template>
  <div class="content detail">
    <div class="customCard">
      <div class="customCard-header">
        <div>
          <el-button type="warning" size="small" v-if="content.hidden" @click="modifyHidden">
            숨김 해제</el-button
          >
          <el-button type="warning" size="small" v-else @click="modifyHidden"> 숨김</el-button>
          <el-button type="primary" size="small" @click="modifyArchive"> 수정</el-button>
          <el-button type="danger" size="small" @click="deleteArchive"> 삭제</el-button>
        </div>
        <p class="title">{{ content.title }}</p>
        <div class="right">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.52069 2.529C6.41505 2.529 5.51874 3.4253 5.51874 4.53094C5.51874 5.63659 6.41505 6.53289 7.52069 6.53289C8.62633 6.53289 9.52264 5.63659 9.52264 4.53094C9.52264 3.4253 8.62633 2.529 7.52069 2.529ZM4.66943 4.53094C4.66943 2.95624 5.94598 1.67969 7.52069 1.67969C9.0954 1.67969 10.3719 2.95624 10.3719 4.53094C10.3719 6.10565 9.0954 7.3822 7.52069 7.3822C5.94598 7.3822 4.66943 6.10565 4.66943 4.53094Z"
                fill="#757575"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.16615 10.1277C4.04787 9.18564 5.48185 8.47656 7.68229 8.47656C9.88273 8.47656 11.3167 9.18564 12.1984 10.1277C13.069 11.0578 13.3646 12.1766 13.3646 12.9456C13.3646 13.1801 13.1745 13.3702 12.9399 13.3702H2.42466C2.19012 13.3702 2 13.1801 2 12.9456C2 12.1766 2.29554 11.0578 3.16615 10.1277ZM2.88542 12.5209H12.4792C12.3908 11.9758 12.1294 11.2968 11.5784 10.708C10.8828 9.9649 9.68796 9.32587 7.68229 9.32587C5.67662 9.32587 4.48179 9.9649 3.78622 10.708C3.23514 11.2968 2.97379 11.9758 2.88542 12.5209Z"
                fill="#757575"
              />
            </svg>
            {{ content.regUser ? content.regUser : '-' }}
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.5 12.5C10.2614 12.5 12.5 10.2614 12.5 7.5C12.5 4.73858 10.2614 2.5 7.5 2.5C4.73858 2.5 2.5 4.73858 2.5 7.5C2.5 10.2614 4.73858 12.5 7.5 12.5ZM7.5 13.5C10.8137 13.5 13.5 10.8137 13.5 7.5C13.5 4.18629 10.8137 1.5 7.5 1.5C4.18629 1.5 1.5 4.18629 1.5 7.5C1.5 10.8137 4.18629 13.5 7.5 13.5Z"
                fill="#757575"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.50003 3.57031C7.77617 3.57031 8.00003 3.79417 8.00002 4.07032L8 7.85603H10.9286C11.2047 7.85603 11.4286 8.07988 11.4286 8.35603C11.4286 8.63217 11.2047 8.85603 10.9286 8.85603H7.5C7.36739 8.85603 7.24021 8.80335 7.14645 8.70958C7.05268 8.61581 7 8.48863 7 8.35602L7.00002 4.07031C7.00003 3.79417 7.22388 3.57031 7.50003 3.57031Z"
                fill="#757575"
              />
            </svg>
            {{ content.regDate?.split('.')[0] }}
          </span>
        </div>
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <div
        v-html="content.contents"
        class="text-wrap detailContent ck-content"
        style="line-height: 32px"
      ></div>
      <!-- <div
        v-for="files in detailArchive.archiveFiles"
        :key="files.id"
        style="width: 100%; margin: 5px"
      >
        <div class="addFileList" v-if="filterList(files)">
          <span class="file" @click="commonUtil.downloadFile(files.id, files.orgName)">
            <el-icon>
              <Download />
            </el-icon>
            {{ files.orgName }}
          </span>
        </div>
      </div> -->
      <div class="file-wrap">
        <div class="addFileList" v-for="files in attachFiles" :key="files.id">
          <div class="file">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              @click="commonUtil.downloadFile(files.id, files.orgName)"
              style="cursor: pointer"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.0006 2.25C10.4148 2.25 10.7506 2.58579 10.7506 3V11.1437L13.2803 8.61861C13.5734 8.32598 14.0483 8.32641 14.3409 8.61956C14.6336 8.91272 14.6331 9.3876 14.34 9.68022L10.5305 13.4829C10.2377 13.7751 9.76354 13.7751 9.47075 13.4829L5.66123 9.68022C5.36807 9.3876 5.36764 8.91272 5.66027 8.61956C5.9529 8.32641 6.42777 8.32598 6.72093 8.61861L9.2506 11.1437V3C9.2506 2.58579 9.58639 2.25 10.0006 2.25ZM16.6663 12.4203C17.0806 12.4203 17.4163 12.7561 17.4163 13.1703V16.2438C17.4163 16.8962 17.1708 17.5292 16.7222 18.0019C16.2724 18.4759 15.6537 18.75 14.9997 18.75H4.99967C4.34569 18.75 3.72696 18.4759 3.27714 18.0019C2.82859 17.5292 2.58301 16.8962 2.58301 16.2438L2.58301 13.1703C2.58301 12.7561 2.91879 12.4203 3.33301 12.4203C3.74722 12.4203 4.08301 12.7561 4.08301 13.1703L4.08301 16.2438C4.08301 16.5229 4.18862 16.7833 4.36519 16.9693C4.54049 17.1541 4.76961 17.25 4.99967 17.25H14.9997C15.2297 17.25 15.4589 17.1541 15.6342 16.9693C15.8107 16.7833 15.9163 16.5229 15.9163 16.2438V13.1703C15.9163 12.7561 16.2521 12.4203 16.6663 12.4203Z"
                fill="#9E9E9E"
              />
            </svg>
            [첨부파일] {{ files.orgName }}
          </div>
        </div>
        <div>
          <el-image
            style="max-height: 200px; max-width: 200px"
            :src="prefixPath + imgFile.id"
            :preview-src-list="[prefixPath + imgFile.id]"
            :zoom-rate="1.2"
            :initial-index="4"
            fit="cover"
          >
            <template #error>
              <img src="/assets/image/no-image.png" title="이미지 없음" />
            </template>
          </el-image>
          <div class="file">[대표이미지]</div>
        </div>
      </div>

      <button type="button" class="btn-list" @click="goList">목록</button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useArchiveStore } from '@/stores/admin/archive'
  import { storeToRefs } from 'pinia'
  import { reactive } from 'vue'
  import { API_INFO_CIAMS } from '@/config/config'
  import { File } from '@/api/app/file/model'
  import Archive from '@/api/admin/archive/model'
  const archiveStore = useArchiveStore()
  import sanitizeHtml from 'sanitize-html'
  import commonUtil from '@/utils/commonUtil'

  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'

  const route = useRoute()
  const router = useRouter()
  const archiveId = route.params.archiveId
  const content = ref({} as Archive.ArchiveDetail)
  const attachFiles = ref([] as any[])
  const imgFile = ref({} as File)

  function goList() {
    archiveStore.getArchiveList()
    router.push({ name: 'adminArchiveMain', path: '' })
  }

  function deleteArchive() {
    commonUtil
      .confirm('게시글을 삭제 하시겠습니까?', '게시글 삭제')
      .then(() => {
        if (archiveId) {
          let ids = [archiveId]
          return archiveStore.deleteArchive(ids)
        }
      })
      .then(() => {
        commonUtil.successMessage('삭제 되었습니다.')
        goList()
      })
  }

  function modifyArchive() {
    router.push({ path: `/admin/archive/write/${archiveId}` })
  }

  function modifyHidden() {
    let hiddenTxt = content.value.hidden ? '공개' : '비공개'

    commonUtil
      .confirm(`게시글을 ${hiddenTxt} 하시겠습니까?`, `게시글 ${hiddenTxt}`)
      .then(() => {
        if (archiveId) {
          let params = {
            ids: [archiveId],
            hidden: !content.value.hidden,
          }
          return archiveStore.modifyHidden(params)
        }
      })
      .then(() => {
        commonUtil.successMessage(`${hiddenTxt} 되었습니다.`)
        goList()
      })
      .catch((err) => {
        window.console.log(err)
        commonUtil.errorMessage(`${hiddenTxt} 중에 오류가 발생했습니다.`)
      })
  }

  onMounted(() => {
    archiveStore.getArchiveDetail(archiveId as string).then((res) => {
      content.value = res
      attachFiles.value = res.archiveFiles.filter((data) => data.typeCode == 'archive')
      let _imgFile = res.archiveFiles.filter((data) => data.typeCode == 'archiveImg')
      imgFile.value = _imgFile.length > 0 ? _imgFile[0] : {}
    })
  })
</script>

<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference {
  }

  .content {
    width: 100%;
  }

  .detailContent {
    overflow: auto;
  }
</style>

<style scoped>
  /* .container-c {
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
  }

  .content {
    height: 470px;
    width: 100%;
    word-break: break-all;
    overflow: auto;
    min-height: -webkit-fill-available;
  }

  .header {
    min-height: 50px;
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

  .attachFile {
    border: 1px solid #c0ccda;
    padding: 8px 15px;
    margin-right: 10px;
    border-radius: 6px;
    line-height: 30px;
    font-weight: bold;
    cursor: pointer;
  }

  :deep .el-form-item__label {
    text-align: center;
    font-weight: bold;
    color: #606266;
  }

  :deep .el-form-item {
    margin-bottom: 0;
  }

  :deep .el-form-item__content {
    height: 100%;
  }

  :deep .image-style-align-left {
    margin-right: var(--ck-image-style-spacing) !important;
  }

  .isImage {
    height: 150px;
    display: flex;
  }

  .rep-image {
    min-width: 300px;
    max-width: 900px;
    max-height: 600px;
    display: flex;
    place-content: center;
  }

  .image-box {
    cursor: pointer;
  }

  .image-box:hover {
    border: 1px dashed #909399;
    border-radius: 5px;
  } */
</style>

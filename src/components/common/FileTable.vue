<template>
  <div>
    <table class="customTable">
      <colgroup>
        <col />
        <col width="65" />
        <col width="90" />
        <col width="40" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" style="text-align: center">이름</th>
          <th scope="col" style="text-align: center">확장자</th>
          <th scope="col" style="text-align: center">크기</th>
          <th scope="col" style="text-align: center">삭제</th>
        </tr>
      </thead>
    </table>

    <Empty v-if="CommonUtil.isEmpty(viewFiles)" style="flex: 1; height: 100%" />

    <el-table
      v-else
      :data="viewFiles"
      :show-header="false"
      size="small"
      highlight-current-row
      style="flex: 2; height: 100%; z-index: 0"
      empty-text="데이터가 없습니다."
      scrollbar-always-on
      @cell-mouse-enter="handleCellMouseEnter"
    >
      <el-table-column prop="orgName" align="left" label="이름">
        <template #default="scope">
          <el-button link size="small" type="primary" @click.prevent="handleDownLoad(scope.row.id)">
            {{ scope.row.orgName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ext" align="center" label="확장자" width="60" />
      <el-table-column prop="size" align="right" header-align="center" label="크기" width="90">
        <template #default="scope">
          {{ CommonUtil.formatBytes(scope.row.size) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="삭제" width="40">
        <template #default="scope">
          <el-popconfirm
            width="220px"
            confirm-button-text="삭제"
            cancel-button-text="취소"
            title="파일을 삭제하시겠습니까?"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button link type="danger">
                <el-icon style="vertical-align: middle">
                  <Delete />
                </el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="card-title" style="margin-top: 25px">
      <span>미리보기</span>
    </div>

    <template v-for="item in imageFiles" :key="item">
      <div style="text-align: center; width: 100%; margin-bottom: 5px">
        <el-image
          style="width: 100%; height: 100%"
          :src="prefixPath + item.id"
          :preview-src-list="[prefixPath + item.id]"
          :preview-teleported="true"
          fit="scale-down"
        >
          <template #error>
            <img src="/assets/image/no-image.png" title="이미지 없음" />
          </template>
        </el-image>
        <el-button
          class="btn-search"
          style="
            color: #fff;
            height: 20px;
            padding: 0 10px;
            font-size: 12px;
            border-radius: 4px;
            background-color: #7AAAD1;
          "
          @click="handleDownLoad(item?.id as string)"
        >
          {{ item.orgName }}
        </el-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'
  import { ElCarousel } from 'element-plus'

  import FileDto from '@/api/app/file/model'
  import CommonUtil from '@/utils/commonUtil'
  import { deleteFile, downLoadFile, searchFileList } from '@/api/app/file'
  import { API_INFO_CIAMS } from '@/config/config'

  const viewFiles = ref<FileDto.Search.Row[]>()
  const imageFiles = ref<FileDto.Search.Row[]>()
  const currentParams = ref<FileDto.Search.Params | null>()
  const prefixPath = API_INFO_CIAMS.PREFIX + '/api/v1/file/down/'
  const imgFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp']

  async function loadData(params: FileDto.Search.Params, params1: FileDto.Search.Params = params) {
    const { data } = await searchFileList(params1)

    viewFiles.value = data.list
    imageFiles.value = viewFiles.value?.filter((file) => {
      return imgFormats.includes(file.ext)
    })
    currentParams.value = params
  }

  function reset() {
    viewFiles.value = []
    imageFiles.value = []
    currentParams.value = null
  }

  const imgCarouselRef = ref<InstanceType<typeof ElCarousel>>()
  async function handleDownLoad(id: string) {
    try {
      const { data, headers } = await downLoadFile(id)

      const fileName = headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
      CommonUtil.download(new Blob([data]), decodeURI(fileName))
    } catch (e) {
      CommonUtil.errorMessage('존재하지 않는 파일입니다.')
    }
  }

  function handleCellMouseEnter(row: FileDto.Search.Row) {
    if (imgFormats.includes(row.ext)) {
      imgCarouselRef.value?.setActiveItem(row.id as string)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteFile(id)
      await loadData(currentParams.value!)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        CommonUtil.errorMessage(err.response?.data)
      }
    }
  }

  defineExpose({
    loadData,
    reset,
  })
</script>

<style scoped lang="scss">
  .customTable th,
  .customTable td {
    min-width: 40px;
    padding: 8px 7px;
    text-align: center;
    scroll-snap-align: start;
    background-clip: padding-box;
    word-break: break-all;
    font-size: 12px;
    letter-spacing: -0.02em;
    line-height: 1.5;
  }
</style>

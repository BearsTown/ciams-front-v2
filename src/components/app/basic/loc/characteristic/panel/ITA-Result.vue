<template>
  <div style="display: flex; flex-direction: column; width: 100%; height: 100%">
    <div class="result-header">검색결과 총 {{ pageInfo.totalCount }}건</div>

    <ITAResultTable :data="itaResultItems" />

    <div class="result-pagination">
      <el-pagination
        size="small"
        :total="pageInfo.totalCount"
        :page-size="pageInfo.pageSize"
        :current-page="pageInfo.pageNo"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        style="display: flex; align-items: center; justify-content: center; padding: 5px"
        class="customPagination"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  import ITAResultTable from '@/components/app/basic/loc/characteristic/panel/ITA-ResultTable.vue'

  import { pageObject } from '@/js/common'

  import { CharResultDto } from '@/models/api/app/basic/loc/characteristic/char-result'

  import { getItaResultDataList } from '@/api/app/basic/loc/characteristic'

  const pageObj = pageObject()
  const pageInfo = pageObj.pageInfo
  pageInfo.currentPageSize = 20

  const currentParams = ref<CharResultDto.Char.Search.Params>()
  const itaResultItems = ref<CharResultDto.Char.Search.Row[]>()

  const props = withDefaults(
    defineProps<{
      sggCd: string
    }>(),
    {},
  )

  function setParams(params: CharResultDto.Char.Search.Params) {
    currentParams.value = params
  }

  async function search(pageNo: number, size: number) {
    const params = {
      size,
      pageNo,
      ...currentParams.value!,
    }

    const { data } = await getItaResultDataList(params)
    responseData(data)
  }

  function clear() {
    runSearch()
  }

  function runSearch() {
    const params: CharResultDto.Char.Search.Params = {
      sggCd: props.sggCd,
    }

    setParams(params)
    search(1, pageInfo.currentPageSize)
  }

  function responseData(data: CharResultDto.Char.Search.Result) {
    itaResultItems.value = data.list
    pageObj.setPageData(data.page)
  }

  function handleCurrentChange(pageNo: number) {
    search(pageNo, pageInfo.currentPageSize)
  }

  watch(
    () => props.sggCd,
    (newSggCd) => {
      if (newSggCd) {
        runSearch()
      }
    },
    { immediate: true },
  )
</script>

<style scoped lang="scss">
  .result-header {
    height: 28px;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.17;
    color: #737a89;
  }
</style>

<template>
  <div style="display: flex; width: 100%; height: 100%; padding: 0; flex-direction: column">
    <div class="urbanInfo" style="padding: 0">
      <!--
      <div class="container search">
        <div class="search-box">
          <div class="form-group">
            <label class="form-label">검색어</label>
            <div>
              <input
                type="text"
                class="customInput"
                placeholder="검색어"
                v-model="keyword"
                @keyup.enter="keyEnter"
              />
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="btn-group">
            <button type="button" class="btn-search" @click="runSearch">검색</button>
            <button type="button" class="btn-reload" @click="clear">초기화</button>
          </div>
        </div>
      </div>
      -->

      <div
        class="container info"
        style="
          overflow-y: hidden;
          flex: 1;
          padding: 0;
          box-sizing: border-box;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12);
          border: 1px solid var(--ugis-border-color-gray);
        "
      >
        <div style="display: flex; flex-direction: column; height: 100%">
          <!--
          <div class="result-header">검색결과 총 {{ pageInfo.totalCount }}건</div>
          -->
          <div class="result-wrap" style="flex: 1; overflow-y: auto">
            <DistPageList
              ref="distPageListRef"
              :area-list-items="distItems"
              @item-select="distItemselect"
            />
          </div>
          <!--
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
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import DistPageList from '@/components/common/DistList/DistPageList.vue'

  import { getCiamsDistList } from 'src/api/app/gis/dist'
  import { GisCiamsDistDTO } from '@/api/app/gis/dist/model'
  import { pageObject } from '@/js/common'

  const props = withDefaults(
    defineProps<{
      pageSize: number
    }>(),
    {
      pageSize: 4,
    },
  )

  const keyword = ref('')
  const pageObj = pageObject()
  const pageInfo = pageObj.pageInfo
  pageInfo.currentPageSize = props!.pageSize

  const currentParams = ref<GisCiamsDistDTO.Search.Params>()
  const distItems = ref<GisCiamsDistDTO.Search.Row[]>()
  const distPageListRef = ref<InstanceType<typeof DistPageList>>()

  const emits = defineEmits<{
    (e: 'item-select', type: GisCiamsDistDTO.Search.Row): void
    (e: 'onMounted'): void
    (e: 'clear'): void
  }>()

  function setParams(params: GisCiamsDistDTO.Search.Params) {
    currentParams.value = params
  }

  async function search(pageNo: number, size: number) {
    const params = {
      size,
      pageNo,
      ...currentParams.value,
    } as GisCiamsDistDTO.Search.Params

    const { data } = await getCiamsDistList(params)
    responseData(data)
  }

  async function clear() {
    keyword.value = ''

    await runSearch()
    emits('clear')
  }

  // function keyEnter() {
  //   await runSearch()
  // }

  async function runSearch() {
    const params = {
      keyword: keyword.value,
    }

    setParams(params)
    await search(1, pageInfo.currentPageSize)
  }

  function responseData(data: GisCiamsDistDTO.Search.Result) {
    distItems.value = [
      {
        rn: 0,
        distArea: data.list.reduce((acc, item) => acc + item.distArea, 0),
        distNo: '',
        distName: '대상지 총괄',
      },
      ...data.list,
    ]

    pageObj.setPageData(data.page)
  }

  function handleCurrentChange(pageNo: number) {
    search(pageNo, pageInfo.currentPageSize)
  }

  function distItemselect(item: GisCiamsDistDTO.Search.Row) {
    emits('item-select', item)
  }

  onMounted(async () => {
    await runSearch()

    emits('onMounted')
  })

  function selectIndex() {
    distPageListRef?.value.selectAreaItem(0)
  }

  defineExpose({
    selectIndex,
    distItemselect,
  })
</script>

<style scoped lang="scss">
  .urbanInfo {
    display: flex;
    flex-direction: column;
  }

  .urbanInfo .container.info {
    margin-top: 0;
  }

  .urbanInfo .search .btn-group {
    flex: 1;
  }

  .urbanInfo .result-wrap {
    height: auto;
  }

  .btn-fixed {
    display: block;

    :deep(.el-radio-button) {
      width: 100%;
      min-width: 70px;
      max-width: 75px;

      .el-radio-button__inner {
        width: 100%;
        padding: 8px;
      }
    }
  }

  .select-bottom {
    :deep(.el-input) {
      & > .is-focus {
        box-shadow: none !important;
      }

      :hover {
        box-shadow: none !important;
      }
    }

    :deep(.el-input__wrapper) {
      box-shadow: none;
      border-radius: 0;
      border-bottom: 1px solid;
    }
  }
</style>

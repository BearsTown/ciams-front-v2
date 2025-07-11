<template>
  <div style="display: flex; width: 100%; height: 100%; padding: 10px; flex-direction: column">
    <div class="urbanInfo" style="padding: 0">
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
          <div v-if="category" class="form-group">
            <label class="form-label">{{ category?.title }}</label>
            <el-select
              v-model="selected"
              :placeholder="`${category?.title}을 선택하세요`"
              size="default"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <div class="bottom">
          <div class="btn-group">
            <button type="button" class="btn-search" @click="runSearch">검색</button>
            <button type="button" class="btn-reload" @click="clear">초기화</button>
          </div>
        </div>
      </div>

      <div class="container info" style="overflow-y: hidden; flex: 1">
        <div style="display: flex; flex-direction: column; height: 100%">
          <div class="result-header">검색결과 총 {{ pageInfo.totalCount }}건</div>
          <div class="result-wrap" style="flex: 1; overflow-y: auto">
            <ZonePageList
              ref="zonePageListRef"
              :category="category"
              :area-list-items="zoneItems"
              @item-select="zoneItemSelect"
            />
          </div>
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'

  import ZonePageList from '@/components/common/ZoneTable/ZonePageList.vue'

  import { pageObject } from '@/js/common'

  import { TagCategory } from '@/types/common'
  import { getCiamsZoneList } from '@/api/app/zone'
  import { CiamsZoneDTO } from '@/api/app/zone/model'
  import CommonUtil from '@/utils/commonUtil'

  interface Category {
    name: string
    title: string
    list: TagCategory[]
  }

  const props = withDefaults(
    defineProps<{
      pageSize: number
      category: Category
    }>(),
    {
      pageSize: 4,
    },
  )

  const selected = ref<string>()

  const categoryList = ref<TagCategory[]>([])

  const keyword = ref('')
  const pageObj = pageObject()
  const pageInfo = pageObj.pageInfo
  pageInfo.currentPageSize = props!.pageSize

  const currentParams = ref<CiamsZoneDTO.Search.Params>()
  const zoneItems = ref<CiamsZoneDTO.Search.Row[]>()
  const zonePageListRef = ref<InstanceType<typeof ZonePageList>>()

  const emits = defineEmits<{
    (e: 'item-select', type: CiamsZoneDTO.Search.Row): void
    (e: 'clear'): void
  }>()

  function setParams(params: CiamsZoneDTO.Search.Params) {
    currentParams.value = params
  }

  async function search(pageNo: number, size: number) {
    const params = {
      size,
      pageNo,
      ...currentParams.value,
    } as CiamsZoneDTO.Search.Params

    const { data } = await getCiamsZoneList(params)
    responseData(data)
  }

  function clear() {
    keyword.value = ''
    selected.value = ''

    runSearch()
    emits('clear')
  }

  function keyEnter() {
    runSearch()
  }

  function runSearch() {
    // const params = {
    //   keyword: keyword.value,
    // }
    const params = {
      keyword: keyword.value,
      ...(!CommonUtil.isEmpty(selected.value) && {
        [props.category?.name]: selected.value,
      }),
    }

    setParams(params)
    search(1, pageInfo.currentPageSize)
  }

  function responseData(data: CiamsZoneDTO.Search.Result) {
    zoneItems.value = data.list
    pageObj.setPageData(data.page)
  }

  function handleCurrentChange(pageNo: number) {
    search(pageNo, pageInfo.currentPageSize)
  }

  function zoneItemSelect(item: CiamsZoneDTO.Search.Row) {
    emits('item-select', item)
  }

  watch(
    () => props.category?.list,
    (list) => {
      categoryList.value = [
        {
          label: '전체',
          value: '',
          color: '',
        },
        ...list,
      ]
    },
  )

  onMounted(async () => {
    runSearch()
  })

  defineExpose({
    zoneItemSelect,
  })
</script>

<style scoped lang="scss">
  .urbanInfo {
    display: flex;
    flex-direction: column;
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

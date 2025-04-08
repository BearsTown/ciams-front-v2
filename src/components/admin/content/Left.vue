<template>
  <div class="map-leftDrawer active">
    <div class="planningMonitoring" style="width: 355px">
      <div class="planningMonitoring-content">
        <div class="container customScroll">
          <div class="customCard search" style="height: 120px">
            <div class="search-box">
              <div class="form-group">
                <label class="form-label">계획지역명</label>
                <div>
                  <input
                    type="text"
                    class="customInput"
                    placeholder="검색어"
                    @keyup.enter="searchPlanArea"
                    v-model="search"
                  />
                </div>
              </div>
            </div>
            <div class="bottom" style="float: right">
              <div class="btn-group">
                <button type="button" class="btn-search" @click="searchPlanArea">검색</button>
                <button type="button" class="btn-reload" @click="reset">초기화</button>
              </div>
            </div>
          </div>

          <!-- container.search 높이값 + margin 10px  -->
          <div class="customCard info" style="height: calc(100% - 130px)">
            <div class="result-header">
              검색결과 총 {{ data.page.totalCount }}건
              <!-- <button type="btn-reload"></button> -->
            </div>
            <!-- pagination 없을때 class noPage 추가 -->
            <div class="result-wrap">
              <ul class="result-list customScroll">
                <AreaPageList
                  ref="areaPageListRef"
                  :area-list-items="data.list"
                  @item-select="selectData"
                />
              </ul>
            </div>
            <div class="result-pagination">
              <el-pagination
                @current-change="getActivePage"
                style="display: flex; align-items: center; justify-content: center; padding: 5px"
                layout="prev, pager, next"
                :total="data.page.totalCount"
                :page-size="data.page.size"
                :current-page="data.page.pageNo"
                size="small"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- <TotalMonitoringDialog :dialogVisible="dialogVisible" @close-dialog="dialogVisible = false" /> -->
    </div>
  </div>
</template>
<script setup lang="ts">
  import AreaPageList from '@/components/common/ZoneTable/ZonePageList.vue'
  import { onMounted, ref } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import { getPlanArea, getPlanAreaLink } from '@/api/app/plan'
  import { pageObject } from '@/js/common'
  import { Plan, CiamsPlanAreaLink } from '@/api/app/plan/model'
  import { getCodeSublist } from '@/api/app/common'

  const search = ref('')
  const pageObj = pageObject()
  const emits = defineEmits<{
    (e: 'selectArea', item: Plan.Search.Row): void
  }>()
  const selectItem = ref('')
  const group1_list = ref<TempCodeList[]>([])
  interface TempCodeList {
    code: string
    codeName: string
  }
  ;(async () => {
    try {
      const { data } = await getCodeSublist({
        code: 'G0004',
        useRoot: false,
      })

      group1_list.value = [
        {
          code: '',
          codeName: '전체',
        },
        ...data.filter((item) => item.code !== 'T0200'),
      ]
    } catch (e) {}
  })()

  const data = ref({
    page: pageObj.pageInfo,
    list: [],
  } as unknown as Plan.Search.Result)

  function getActivePage(curPage) {
    data.value.page.pageNo = curPage
    searchPlanArea()
  }

  function selectData(item) {
    selectItem.value = item.zoneNo
    emits('selectArea', item)
  }

  function searchPlanArea() {
    getPlanArea({
      size: 6,
      pageNo: data.value.page.pageNo,
      name: search.value,
    }).then((res) => {
      if (res) {
        data.value.page = res.data.page
        data.value.list = res.data.list
      }
    })
  }

  function reset() {
    search.value = ''
    getActivePage(1)
  }

  onMounted(() => {
    ;(async () => {
      try {
        await searchPlanArea()
      } catch (error) {
        console.log(error)
      }
    })()
  })
</script>
<style scoped>
  .map-leftDrawer {
    width: 355px;
    min-width: 355px;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    background: #f4f4f4;
    z-index: 8;
    border: none;
  }
</style>

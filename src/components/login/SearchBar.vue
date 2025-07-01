<template>
  <div class="search" :class="{ active: searchActive }" tabindex="0">
    <!-- <span class="search-icon"
            ><img src="../assets/img/ico_mainSearch.svg" alt=""
          /></span> -->

    <!--@blur="searchActive = false"-->
    <input
      class="search-input"
      type="text"
      placeholder="지번/도로명 검색어를 입력해주세요."
      v-model="keyword"
      maxlength="50"
      @keydown.enter="
        () => {
          search()
          searchActive = true
        }
      "
    />
    <button
      type="button"
      class="btn-search"
      @click="
        () => {
          search()
          searchActive = true
        }
      "
    >
      검색
    </button>
    <div class="search-dropdown">
      <ul class="search-tab">
        <li
          v-for="(sType, index) in searchTypeList.items"
          :key="index"
          :id="sType.id"
          :class="{ active: currentTab === index }"
          class="tab-item"
          @click="changeSearchType(sType.id, index)"
        >
          {{ sType.label }} ({{ searchedData[sType.id].total }})
        </li>
        <button
          type="button"
          class="btn-close"
          style="margin-left: auto; padding-right: 10px"
          @click="searchActive = false"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L13 13" stroke="black" stroke-width="2" stroke-linecap="round" />
            <path d="M13 1L0.999999 13" stroke="black" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </ul>
      <ul class="result-list">
        <!-- 검색결과 없을 때 -->
        <li class="no-data" v-if="searchedData[searchType].items.length == 0">
          <span class="">조회된 데이터가 없습니다.</span>
        </li>

        <!-- 검색결과 있을 때 / 키보드 방향키로 움직일 때 active 적용 -->
        <li
          class="result-item"
          else
          v-for="(item, index) in searchedData[searchType].items"
          :key="index"
        >
          <span class="result-text">{{ item.address.data }}</span>
          <span class="result-icon">
            <el-tooltip
              :content="searchType === 'ciams' ? '계획구역정보 이동' : '토지정보 이동'"
              placement="auto"
              effect="light"
            >
              <img
                src="@/assets/img/ico_mainSearch.svg"
                alt=""
                @click.prevent="
                  searchType === 'ciams' ? selectMainItem(item) : routePushWithCoord(item)
                "
              />
            </el-tooltip>
          </span>
        </li>
      </ul>

      <div class="pagination-wrap">
        <el-pagination
          style="display: flex; align-items: center; justify-content: center; padding: 5px"
          v-if="searchedData[searchType].pagination.total > 0"
          v-model:current-page="searchedData[searchType].pagination.currentPage"
          v-model:page-size="searchedData[searchType].pagination.pageSize"
          layout="prev, pager, next"
          @size-change="handleSizeChange"
          :total="searchedData[searchType].pagination.total"
          @current-change="searchByPage"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, onMounted, ref } from 'vue'
  import { AxiosResponse } from 'axios'
  import { vWorldAxiosInstance } from '@/api/vWorld'
  import { PointXY, VworldAddressSearchParam } from '@/types/map'
  import { useGlobalStore } from '@/stores/app'
  import { useMapStore } from '@/stores/map/map'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import commonUtil from '@/utils/commonUtil'
  import CommonUtil from '@/utils/commonUtil'
  // import { useMapConfig } from '@/stores/map/mapConfig'
  // import { usePlanAreaStore } from '@/stores/app/operation/planArea'
  import { useRouter } from 'vue-router'

  import tokenUtil from '@/utils/tokenUtil'
  import { useCmmConfigStore } from '@/stores/config/cmmConfig'
  // import { useConfigStore } from '@/stores/config/config'
  import { MenuType } from '@/router'

  const router = useRouter()
  const store = useAuthStore()
  const { isLoggedIn, menuInfo } = storeToRefs(store)

  const props = defineProps({
    isMain: {
      type: Boolean,
      default: false,
    },
  })

  const currentTab = ref(0)

  const searchActive = ref(false)

  if (!props.isMain) {
    useKeyLayerStore().initState()
  }

  const headerCellClassName = () => 'pl-10'

  const cellClassName = () => 'pl-10'

  const loading = ref(false)
  const globalStore = useGlobalStore()
  const cmmConfigStore = useCmmConfigStore()

  const vworldKey = ref('')
  const prefix = ref('')
  const extent = ref('')
  const proj = ref('')
  const keyword = ref('')
  const searchType = ref<string>('parcel')

  const searchTypeList = ref({
    name: 'search-type',
    type: 'radio',
    items: [
      {
        id: 'parcel',
        label: '지번',
        checked: true,
      },
      {
        id: 'road',
        label: '도로명',
        checked: false,
      },
      // {
      //   id: 'ciams',
      //   label: '계획구역',
      //   checked: false,
      // },
    ],
  })
  const pagination = ref<{
    pageSize: number
    total: number
    currentPage: number
  }>({
    pageSize: 5,
    total: 0,
    currentPage: 1,
  })
  type searchedDataItem = {
    total: number
    items: Array<{
      id: string
      address: any
    }>
    pagination: {
      pageSize: number
      total: number
      currentPage: number
    }
  }
  const searchedData = ref<{
    parcel: searchedDataItem
    road: searchedDataItem
    ciams: searchedDataItem
  }>({
    parcel: {
      total: 0,
      items: [],
      pagination: {
        pageSize: 5,
        total: 0,
        currentPage: 1,
      },
    },
    road: {
      total: 0,
      items: [],
      pagination: {
        pageSize: 5,
        total: 0,
        currentPage: 1,
      },
    },
    ciams: {
      total: 0,
      items: [],
      pagination: {
        pageSize: 5,
        total: 0,
        currentPage: 1,
      },
    },
  })

  const changeSearchType = (id: string, tabIndex: number) => {
    currentTab.value = tabIndex
    searchTypeList.value.items.forEach((item) => {
      if (item.id === id) {
        item.checked = true
        searchType.value = item.id
      } else {
        item.checked = false
      }
    })
    searchedData.value[searchType.value].pagination.currentPage = 1
    search(id)
  }
  const addressData = ref<any[]>([])
  const show = ref(false)

  const setShow = () => {
    show.value = !show.value
  }

  const routePushWithCoord = (params: {
    id: string
    point: PointXY
    address: { data: string }
  }) => {
    if (!tokenUtil.getAccessToken()) {
      commonUtil.errorMessage('사용자 로그인이 필요합니다.')
      return false
    }

    //메뉴 권한 체크
    let zoneEstablishCheck = isMenuCheck('Menu-1')
    let operationCheck = isMenuCheck('Menu-2')
    if (zoneEstablishCheck || operationCheck) {
      // searchMapStore.setCurrentMapCoord(coord)
      // router.push({ name: zoneEstablishCheck ? 'Menu-1' : 'Menu-2' })

      const mapStoure = useMapStore('Map-2')
      mapStoure.setLocParams(params)
      // router.push({ name: 'Menu-2-Sub-4', query: { coord }, })
      router.push({ name: 'Menu-2-Sub-4' })
    } else {
      commonUtil.errorMessage('메뉴 접근 권한이 필요합니다.')
      return false
    }
  }

  const selectMainItem = (data) => {
    let operationCheck = isMenuCheck('Menu-2')
    if (operationCheck) {
      const newData = {
        ...data.address,
      }
      // usePlanAreaStore().setIsMainLink(true)
      // usePlanAreaStore().setPlanArea(newData)

      router.push({ name: 'operation' })
    } else {
      commonUtil.errorMessage('메뉴 접근 권한이 필요합니다.')
      return false
    }
  }

  const selectItem = (data) => {
    const newData = {
      ...data.address,
    }
    const baseLayer = 'CIAMS_PLANID_PLAN'
    // usePlanAreaStore().setPlanArea(newData)
    // mapUtil.selectHighLight(
    //   newData.planId,
    //   'PLAN',
    //   baseLayer.replace('PLANID', newData.planId.toUpperCase()),
    //   equalTo('AREA_NAME', newData.planAreaName),
    // )
    // if (useMapStore().getCurrentMapKey() === MapType.OPERATION) {
    //   mittBus.emit('ciamsPlan-area-item-select', newData)
    // }
  }

  const handleSizeChange = (val: number) => {
    pagination.value.pageSize = val
    search()
  }

  const params = (type): VworldAddressSearchParam => {
    return {
      service: 'search',
      request: 'search',
      version: '2.0',
      crs: proj.value,
      size: pagination.value.pageSize,
      page: searchedData.value[type].pagination.currentPage,
      query: prefix.value + keyword.value,
      type: 'address',
      category: type,
      format: 'json',
      errorformat: 'json',
      key: vworldKey.value,
      bbox: extent.value,
    }
  }

  //한글,숫자, 특수문자('-') 만 가능
  const regType = /^[0-9가-힣\s\-]+$/

  const search = (_searchType?: string) => {
    if (!regType.test(keyword.value)) {
      commonUtil.errorMessage('한글,숫자,특수문자(-)만 입력 가능 합니다.')
      return
    }

    const types = searchTypeList.value.items.map((item) => item.id)
    if (keyword.value === '') return
    types.forEach((type) => {
      if (_searchType && type !== _searchType) return
      loading.value = true
      if (type === 'ciams') {
        // getPlanArea({
        //   size: searchedData.value[type].pagination.pageSize,
        //   planAreaName: keyword.value,
        // }).then((res) => {
        //   searchedData.value[type].pagination = {
        //     ...searchedData.value[type].pagination,
        //     total: +res.data.page.totalCount,
        //     currentPage: res.data.page.pageNo ? +res.data.page.pageNo : 1,
        //   }
        //   searchedData.value[type].total = +searchedData.value[type].pagination.total
        //   show.value = true
        //   searchedData.value[type].items = res.data.list.map((data) => {
        //     return {
        //       id: data.planAreaId,
        //       address: {
        //         ...data,
        //         data: data.planAreaName,
        //       },
        //     }
        //   })
        //   loading.value = false
        // })
        // return
      }

      vWorldAxiosInstance
        .get('/req/search', {
          params: params(type),
        })
        .then((res: AxiosResponse) => {
          if (res.status === 200) {
            if (res.data.response.status === 'OK') {
              const response = res.data.response
              const { current, size } = response.page

              searchedData.value[type].total = +response.record.total
              searchedData.value[type].total =
                searchedData.value[type].total > 5000 ? '5000+' : searchedData.value[type].total

              // searchedData.value[type].total = +response.record.total
              if (searchType.value !== type) return

              searchedData.value[type].items = response.result.items.map(
                (item: { id: string; address: any; point: PointXY }) => ({
                  id: item.id,
                  address: {
                    ...item.address,
                    data:
                      searchType.value === 'parcel'
                        ? item.address.parcel + ' ' + item.address.bldnm
                        : item.address.road + ' ' + item.address.bldnm + ' ' + item.address.bldnmdc,
                  },
                  point: item.point,
                }),
              )
              // searchedData.value[type].pagination = {
              //   total: parseInt(response.record.total),
              //   currentPage: parseInt(current),
              //   pageSize: parseInt(size),
              // }

              searchedData.value[type].pagination = {
                total:
                  parseInt(response.record.total) > 5000 ? 5000 : parseInt(response.record.total),
                currentPage: parseInt(current),
                pageSize: parseInt(size),
              }

              show.value = true
            } else if (res.data.response.status === 'NOT_FOUND') {
              searchedData.value[type].items = []
              searchedData.value[type].total = 0
              searchedData.value[type].pagination = {
                total: 0,
                currentPage: 1,
                pageSize: searchedData.value[type].pagination.pageSize,
              }
            } else {
              throw new Error(res.data.response.error.text)
            }
          }
          loading.value = false
        })
        .catch((error) => {
          console.error(error)
          loading.value = false
        })
    })
    exclusionVisible(true) //페이징 처리시 화면이 닫힘 (영역 외 클릭 시 닫힘 제거하게 되면 해당 부분 제거)
  }
  const searchByPage = () => {
    if (keyword.value === '') return
    loading.value = true

    // for (const type of searchTypeList.value.items) {
    //   if (type.checked === true && type.id === 'ciams') {
    //     getPlanArea({
    //       size: searchedData.value[type.id].pagination.pageSize,
    //       planAreaName: keyword.value,
    //       pageNo: searchedData.value[type.id].pagination.currentPage,
    //     }).then((res) => {
    //       exclusionVisible(true) //페이징 처리시 화면이 닫힘 (영역 외 클릭 시 닫힘 제거하게 되면 해당 부분 제거)
    //       searchedData.value[type.id].pagination = {
    //         ...searchedData.value[type.id].pagination,
    //         total: +res.data.page.totalCount,
    //         currentPage: res.data.page.pageNo ? +res.data.page.pageNo : 1,
    //       }
    //       searchedData.value[type.id].total = +searchedData.value[type.id].pagination.total
    //       searchedData.value[type.id].items = res.data.list.map((data) => {
    //         return {
    //           id: data.planAreaId,
    //           address: {
    //             ...data,
    //             data: data.planAreaName,
    //           },
    //         }
    //       })
    //       loading.value = false
    //     })
    //     return
    //   }
    // }

    vWorldAxiosInstance
      .get('/req/search', {
        params: params(searchType.value),
      })
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          if (res.data.response.status === 'OK') {
            const response = res.data.response
            // searchedData.value[searchType.value].total = +response.record.total

            searchedData.value[searchType.value].pagination = {
              ...searchedData.value[searchType.value].pagination,
              total: +res.data.page.totalCount,
              currentPage: res.data.page.pageNo ? +res.data.page.pageNo : 1,
            }

            searchedData.value[searchType.value].items = response.result.items.map(
              (item: { id: string; address: any; point: PointXY }) => ({
                id: item.id,
                address: {
                  ...item.address,
                  data:
                    searchType.value === 'parcel'
                      ? item.address.parcel + ' ' + item.address.bldnm
                      : item.address.road + ' ' + item.address.bldnm + ' ' + item.address.bldnmdc,
                },
                point: item.point,
              }),
            )
            const { current, size } = response.page
            // searchedData.value[searchType.value].pagination = {
            //   total: parseInt(response.record.total),
            //   currentPage: parseInt(current),
            //   pageSize: parseInt(size),
            // }
            searchedData.value[searchType.value].pagination = {
              total:
                parseInt(response.record.total) > 5000 ? 5000 : parseInt(response.record.total),
              currentPage: parseInt(current),
              pageSize: parseInt(size),
            }
            show.value = true
          } else if (res.data.response.status === 'NOT_FOUND') {
            searchedData.value[searchType.value].items = []
            searchedData.value[searchType.value].pagination = {
              total: 0,
              currentPage: 1,
              pageSize: searchedData.value[searchType.value].pagination.pageSize,
            }
          } else {
            throw new Error(res.data.response.error.text)
          }
        }
        loading.value = false
      })
      .catch((error) => {
        console.error(error)
        loading.value = false
      })
  }

  function exclusionVisible(isVisible: boolean) {
    show.value = isVisible
  }

  function isMenuCheck(key: MenuType) {
    const idx = menuInfo.value.findIndex((a) => a.codeVal == key)
    if (idx == -1) {
      return false
    } else {
      return true
    }
  }

  async function loadConfig() {
    try {
      await cmmConfigStore.loadCmmConfig()
      await cmmConfigStore.loadMapConfig()

      vworldKey.value = cmmConfigStore.mapConfigState['VWORLD_KEY'].confValue
      prefix.value = `${cmmConfigStore.cmmConfigState['SIDO_NAME'].confValue} ${cmmConfigStore.cmmConfigState['SGG_NAME'].confValue} `
      extent.value = JSON.parse(cmmConfigStore.mapConfigState['MAP_SGG_EXTENT'].confValue)
      proj.value = cmmConfigStore.mapConfigState['MAP_INIT_PROJ'].confValue
    } catch (err) {
      CommonUtil.errorMessage(err)
    }
  }

  onBeforeMount(async () => {
    // await loadConfig()
  })

  onMounted(async () => {
    await loadConfig()
  })

  defineExpose({
    exclusionVisible,
    isVisible: () => show.value,
  })
</script>

<style scoped lang="scss"></style>


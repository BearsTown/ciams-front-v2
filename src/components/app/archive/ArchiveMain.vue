<template>
  <div class="container">
    <div class="l-header">
      <span class="header-title">{{ archvItem.title }}</span>
      <div class="right">
        <div class="search">
          <input
            type="text"
            v-model="searchInput"
            class="customInput"
            placeholder="검색어를 입력하세요."
            @keyup.enter="getSearchList"
            @blur="inputBlur"
          />
          <button type="button" class="btn-search" @click.stop="getSearchList">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.12195 1.31707C4.36372 1.31707 1.31707 4.36372 1.31707 8.12195C1.31707 11.8802 4.36372 14.9268 8.12195 14.9268C11.8802 14.9268 14.9268 11.8802 14.9268 8.12195C14.9268 4.36372 11.8802 1.31707 8.12195 1.31707ZM0 8.12195C0 3.63632 3.63632 0 8.12195 0C12.6076 0 16.2439 3.63632 16.2439 8.12195C16.2439 12.6076 12.6076 16.2439 8.12195 16.2439C3.63632 16.2439 0 12.6076 0 8.12195Z"
                fill="#757575"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.9243 12.9233C13.1815 12.6662 13.5985 12.6662 13.8556 12.9233L17.8069 16.8746C18.064 17.1317 18.064 17.5487 17.8069 17.8059C17.5497 18.0631 17.1327 18.0631 16.8755 17.8059L12.9243 13.8547C12.6672 13.5975 12.6672 13.1805 12.9243 12.9233Z"
                fill="#757575"
              />
            </svg>
          </button>
        </div>
        <div class="btn-group">
          <button
            type="button"
            label="card"
            class="btn-list"
            :class="{ active: archvItem.viewType === 'card' }"
            @click="clickType('card')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="34"
              viewBox="0 0 42 34"
              fill="none"
            >
              <rect x="13.6699" y="9" width="6.81608" height="6.85714" rx="1" fill="#BDBDBD" />
              <rect
                x="13.6699"
                y="18.1445"
                width="6.81608"
                height="6.85714"
                rx="1"
                fill="#BDBDBD"
              />
              <rect x="22.7578" y="9" width="6.81608" height="6.85714" rx="1" fill="#BDBDBD" />
              <rect
                x="22.7578"
                y="18.1445"
                width="6.81608"
                height="6.85714"
                rx="1"
                fill="#BDBDBD"
              />
            </svg>
          </button>
          <button
            type="button"
            label="list"
            class="btn-list"
            @click="clickType('list')"
            :class="{ active: archvItem.viewType === 'list' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="34"
              viewBox="0 0 42 34"
              fill="none"
            >
              <rect x="12.9229" y="10" width="15.9042" height="2" rx="1" fill="#BDBDBD" />
              <rect x="12.9229" y="16" width="15.9042" height="2" rx="1" fill="#BDBDBD" />
              <rect x="12.9229" y="22" width="15.9042" height="2" rx="1" fill="#BDBDBD" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="content-wrap customScroll scrollY">
      <div class="content">
        <ArchiveCard
          v-if="archvItem.viewType === 'card'"
          :list="archvItem.list"
          @click-card="selectItem"
        />
        <ArchiveList
          v-if="archvItem.viewType === 'list'"
          :list="archvItem.list"
          :page="searchItem.pageNo"
          @click-row="selectItem"
        />
      </div>
    </div>

    <div class="l-footer">
      <span class="num">{{ `총 ${archvItem.total}건` }}</span>
      <div class="customPagination">
        <el-pagination
          @current-change="getPageList"
          layout="prev, pager, next"
          :total="archvItem.total"
          :page-size="searchItem.size"
          :current-page="searchItem.pageNo"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { useArchiveStore } from '@/stores/app/archive/archive'
  import { storeToRefs } from 'pinia'
  import { Search } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import ArchiveCard from './ArchiveCard.vue'
  import ArchiveList from './ArchiveList.vue'
  import { cloneDeep, conforms } from 'lodash-es'
  import { Archive } from '@/api/app/archive/model'

  const store = useArchiveStore()
  const router = useRouter()
  const { archvItem, searchItem } = storeToRefs(store)
  const searchInput = ref<string>('')

  watch(
    () => searchItem.value.categoryId,
    async () => {
      await getArchiveList()
      if (searchInput.value !== '') {
        searchInput.value = ''
      }
    },
  )
  onMounted(async () => {
    if (archvItem.value.list.length < 1 && searchItem.value.categoryId !== '') {
      await getArchiveList()
    }
  })

  async function getArchiveList() {
    const copyParam = cloneDeep(searchItem.value)
    await store.getArchvList(copyParam)
  }

  async function getSearchList() {
    if (searchItem.value.title === searchInput.value) {
      return
    }
    searchItem.value.title = searchInput.value
    const copyParam = cloneDeep(searchItem.value)
    copyParam.pageNo = 1
    await store.getArchvList(copyParam)
  }

  async function clickType(type: string) {
    if (archvItem.value.viewType === type) {
      return
    }
    archvItem.value.viewType = type
    // 페이지 초기화 관련 고민
    switch (type) {
      case 'card':
        searchItem.value.size = 9
        break
      case 'list':
        searchItem.value.size = 15
        break
    }
    const copyParam = cloneDeep(searchItem.value)
    copyParam.isPage = false
    await store.getArchvList(copyParam)
  }

  async function getPageList(page: number) {
    searchItem.value.pageNo = page
    const copyParam = cloneDeep(searchItem.value)
    copyParam.isPage = false
    await store.getArchvList(copyParam)
  }

  async function selectItem(data: Archive.ArchiveData) {
    router.push({ name: `archiveDetail`, params: { archiveId: `${data.archiveId}` } })
  }

  async function inputBlur() {
    if (searchInput.value.length === 0) {
      await getSearchList()
    }
  }
</script>

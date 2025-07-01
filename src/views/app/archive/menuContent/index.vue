<template>
  <div class="sidebar">
    <div class="sidebar-top">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-v-0cac8803=""
      >
        <g id="file-search-02" data-v-0cac8803="">
          <path
            id="Icon (Stroke)"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2.40048 4.79979C2.40049 3.14294 3.74364 1.7998 5.40048 1.7998H16.2008C17.8576 1.7998 19.2008 3.14295 19.2008 4.7998V9.5998C19.2008 9.93118 18.9321 10.1998 18.6008 10.1998C18.2694 10.1998 18.0008 9.93118 18.0008 9.5998V4.7998C18.0008 3.80569 17.1949 2.9998 16.2008 2.9998H5.40048C4.40638 2.9998 3.60049 3.80569 3.60048 4.7998L3.60039 19.1997C3.60038 20.1939 4.40627 20.9997 5.40038 20.9998H11.4004C11.7318 20.9998 12.0004 21.2684 12.0004 21.5998C12.0004 21.9311 11.7318 22.1998 11.4004 22.1998H5.40038C3.74352 22.1997 2.40038 20.8566 2.40039 19.1997L2.40048 4.79979ZM6.60077 7.1998C6.60077 6.86843 6.86939 6.5998 7.20077 6.5998H14.4008C14.7321 6.5998 15.0008 6.86843 15.0008 7.1998C15.0008 7.53118 14.7321 7.7998 14.4008 7.7998H7.20077C6.86939 7.7998 6.60077 7.53118 6.60077 7.1998ZM6.60077 10.7998C6.60077 10.4684 6.86939 10.1998 7.20077 10.1998H14.4008C14.7321 10.1998 15.0008 10.4684 15.0008 10.7998C15.0008 11.1312 14.7321 11.3998 14.4008 11.3998H7.20077C6.86939 11.3998 6.60077 11.1312 6.60077 10.7998ZM6.60077 14.3998C6.60077 14.0684 6.86939 13.7998 7.20077 13.7998H10.8008C11.1321 13.7998 11.4008 14.0684 11.4008 14.3998C11.4008 14.7312 11.1321 14.9998 10.8008 14.9998H7.20077C6.86939 14.9998 6.60077 14.7312 6.60077 14.3998ZM17.4004 14.9998C16.0749 14.9998 15.0004 16.0743 15.0004 17.3998C15.0004 18.7253 16.0749 19.7998 17.4004 19.7998C18.7259 19.7998 19.8004 18.7253 19.8004 17.3998C19.8004 16.0743 18.7259 14.9998 17.4004 14.9998ZM13.8004 17.3998C13.8004 15.4116 15.4122 13.7998 17.4004 13.7998C19.3886 13.7998 21.0004 15.4116 21.0004 17.3998C21.0004 18.1773 20.7539 18.8972 20.3348 19.4857L21.4247 20.5755C21.659 20.8099 21.659 21.1898 21.4247 21.4241C21.1903 21.6584 20.8104 21.6584 20.5761 21.4241L19.4863 20.3343C18.8978 20.7533 18.1779 20.9998 17.4004 20.9998C15.4122 20.9998 13.8004 19.388 13.8004 17.3998Z"
            fill="#E0E0E0"
            data-v-0cac8803=""
          />
        </g>
      </svg>
      <span class="text">자료실</span>
    </div>
    <div class="sidebar-menu">
      <div class="title" style="height: 10px"></div>
      <ul class="menu-list">
        <li
          v-for="item in menuList"
          :key="item.categoryId"
          :index="item.categoryId"
          @click="clickMenu(item)"
          :class="{ active: currentMenu === item.categoryId }"
          class="menu-item"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <!--
    <div class="sidebar-menu">
      <div class="title">기타</div>
      <ul class="menu-list">
        <li
          @click="clickMenu({ categoryId: '90' })"
          :class="{ active: currentMenu === '90' }"
          class="menu-item"
        >
          GeoNURIS Maple
        </li>
      </ul>
      <ul v-if="dataDownLoadVisible" class="menu-list">
        <li
          @click="clickMenu({ categoryId: '91' })"
          :class="{ active: currentMenu === '91' }"
          class="menu-item"
        >
          데이터 다운로드
        </li>
      </ul>
    </div>
    -->
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useArchiveStore } from '@/stores/app/archive/archive'
  import { storeToRefs } from 'pinia'
  import { getConfig } from '@/api/app/config'
  import { useRoute, useRouter } from 'vue-router'
  import { cloneDeep } from 'lodash-es'

  const store = useArchiveStore()
  const route = useRoute()
  const router = useRouter()
  const { archiveItem, searchItem } = storeToRefs(store)
  const menuList = ref<any[]>([])
  const currentMenu = ref('')
  const dataDownLoadVisible = ref(false)
  const subRoutePath = computed(() => route.path.split('/')[2])

  onMounted(async () => {
    await getCategoryList()
    await getDownloadVis()
  })

  onUnmounted(() => {
    store.archiveItemReset()
  })

  async function getCategoryList() {
    menuList.value = []
    const list = await store.getCategoryList()
    if (list.length > 0) {
      menuList.value = list
      archiveItem.value.title = list[0].name
      searchItem.value.categoryId = list[0].categoryId
      currentMenu.value = list[0].categoryId
    }
  }

  async function getDownloadVis() {
    getConfig('ARCHIVE_DATA_DOWNLOAD').then((res) => (dataDownLoadVisible.value = res.data.used))
  }

  function clickMenu(item) {
    if (item.isLink) {
      window.open(item.linkUrl, '_blank')
      return
    }
    if (currentMenu.value === item.categoryId && !subRoutePath.value) {
      return
    }
    currentMenu.value = item.categoryId
    archiveItem.value.list = []
    switch (item.categoryId) {
      case '1':
      case '2':
        searchItem.value.title = ''
        searchItem.value.pageNo = 1
        searchItem.value.categoryId = item.categoryId

        archiveItem.value.title = item.name

        router.push({ name: 'archiveMain', path: '', params: {} })
        break
      case '90':
        router.push({ name: 'archiveGeonuris', path: '' })
        break
      case '91':
        router.push({ name: 'archiveLayerDL', path: '' })
        break
    }
  }
</script>

<style scoped lang="scss">
  .menu {
    border-right: 0px;
  }
  .tac {
    width: 350px;
    font-weight: bold;
    float: center;
  }

  .menuItem {
    flex-direction: column;
  }

  .is-active {
    color: var(--ugis-color-white);
    background-color: var(--ugis-color-temp-3) !important;
    border-color: var(--el-color-primary-light-7) !important;

    &:hover {
      color: var(--ugis-color-white);
      background-color: var(--ugis-color-temp-3);
    }
  }
</style>

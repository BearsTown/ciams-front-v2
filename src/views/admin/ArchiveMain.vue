<template>
  <div id="reference" class="active">
    <Left @click="clickSubMenu" :menu="menu" :default-key="defaultContentKey" />
    <div class="admin-container">
      <router-view name="adminArchive" />
      <!-- <Index :category="category" /> -->
    </div>
  </div>
</template>
<script setup lang="ts">
  import Left from '@/components/admin/Left.vue'
  import { useArchiveStore } from '@/stores/admin/archive'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const archiveStore = useArchiveStore()
  const router = useRouter()
  const {
    archiveList: activeArchiveList,
    categoryList,
    pageInfo,
    search,
    reload,
    selectedCategory,
  } = storeToRefs(archiveStore)

  const defaultContentKey = ref('')

  const menu = ref([
    {
      key: 'ArchiveMain',
      name: '자료실',
      sub: [],
    },
  ])

  const clickSubMenu = (key) => {
    let find
    menu.value.forEach((item) => {
      if (item.sub.length > 0) {
        return item.sub.forEach((_item) => {
          if (key == _item.key) find = _item
        })
      } else {
        return key == item.key
      }
    })
    try {
      if (find) {
        search.value.categoryId = find.key
        let _find = categoryList.value.find((a) => a.categoryId == find.key)
        selectedCategory.value = _find
        archiveStore.getArchiveList()

        router.push({ name: 'adminArchiveMain', path: '' })
        // tabComponent.value = markRaw(find.content)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function init() {
    archiveStore.getCategoryList().then((res) => {
      search.value.categoryId = res[0].categoryId
      selectedCategory.value = res[0]
      defaultContentKey.value = res[0].categoryId

      menu.value[0].sub = []
      res.forEach((_res) => {
        menu.value[0].sub.push({
          key: _res.categoryId,
          name: _res.name,
        })
      })

      archiveStore.getArchiveList()
    })
  }

  watch(reload, () => {
    init()
  })

  onMounted(() => {
    init()
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference {
    padding-left: 0 !important;
  }
</style>

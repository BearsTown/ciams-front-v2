<template>
  <div id="reference" class="active">
    <Left
      v-if="defaultContentKey"
      @click="clickSubMenu"
      :menu="menu"
      :default-key="defaultContentKey"
    />

    <div class="admin-container">
      <ContentMain v-if="selectedMenu" :data="selectedMenu" :key="selectedMenu.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, markRaw, onMounted, ref } from 'vue'

  import Left from '@/components/admin/Left.vue'

  import ContentMain from '@/components/admin/content'

  import { getContentMenuGroupList } from '@/api/admin/content-menu'

  const tabComponent = ref()
  const selectedMenu = ref<{
    id: string | number
    title: string
  }>()

  const defaultContentKey = computed(() => menu.value[0]?.sub[0]?.key)

  const menu = ref<{}[]>([
    {
      key: 'ContentMain',
      name: '계획관리',
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
        selectedMenu.value = {
          id: find.key,
          title: find.name,
        }
        tabComponent.value = markRaw(find.content)
      }
    } catch (e) {
      console.log(e)
    }
  }

  onMounted(async () => {
    const { data } = await getContentMenuGroupList()

    menu.value[0].sub = data.map((item) => ({
      key: String(item.id),
      name: item.title,
      content: ContentMain,
    }))

    const firstMenu = menu.value[0].sub[0]
    selectedMenu.value = {
      id: Number(firstMenu.key),
      title: firstMenu.name,
    }
    tabComponent.value = markRaw(firstMenu.content)
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference {
    padding-left: 0 !important;
  }
</style>

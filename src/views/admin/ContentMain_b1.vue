<template>
  <div id="reference" class="active">
    <Left @click="clickSubMenu" :menu="menu" :default-key="defaultContentKey" />

    <div class="admin-container">
      <transition name="slide-fade" mode="out-in">
        <keep-alive>
          <component
            :is="tabComponent"
            ref="current"
            :menu-id="selectedMenuId"
            :key="selectedMenuId"
          />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, markRaw, onMounted, ref } from 'vue'

  import Left from '@/components/admin/Left.vue'

  import ContentMain from '@/components/admin/content'

  import { getContentMenuGroupList } from '@/api/admin/content-menu'

  const tabComponent = ref()
  const selectedMenuId = ref<number>()
  // const defaultContentKey = ref<string>('AreaContent')
  const defaultContentKey = computed(() => menu.value[0]?.sub[0]?.key)

  const menu = ref<{}[]>([
    {
      key: 'ContentMain',
      name: '구역계획',
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
        selectedMenuId.value = find.key
        tabComponent.value = markRaw(find.content)
      }
    } catch (e) {
      console.log(e)
    }
  }

  onMounted(async () => {
    const { data } = await getContentMenuGroupList()

    menu.value[0].sub = data.map((item) => ({
      key: item.id,
      name: item.title,
      content: ContentMain,
    }))

    const firstMenu = menu.value[0].sub[0]
    selectedMenuId.value = firstMenu.key
    tabComponent.value = markRaw(firstMenu.content)
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference {
    padding-left: 0 !important;
  }
</style>

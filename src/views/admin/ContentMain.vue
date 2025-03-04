<template>
  <div id="reference" class="active">
    <Left @click="clickSubMenu" :menu="menu" :default-key="defaultContentKey" />
    <div class="admin-container">
      <transition name="slide-fade" mode="out-in">
        <keep-alive>
          <component :is="tabComponent" ref="current" />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
  import Left from '@/components/admin/Left.vue'
  import Content from '@/components/admin/content/manage/Index.vue'
  import AreaContent from '@/components/admin/content/area/Index.vue'
  import { ref } from 'vue'
  import { markRaw } from 'vue'
  import { onMounted } from 'vue'

  const tabComponent = ref()
  const defaultContentKey = ref('AreaContent')

  const menu = [
    {
      key: 'ContentMain',
      name: '구역계획',
      sub: [
        {
          key: 'Content',
          name: '계획 관리',
          content: Content,
        },
        {
          key: 'AreaContent',
          name: '구역별 계획 지정',
          content: AreaContent,
        },
      ],
    },
  ]

  const clickSubMenu = (key) => {
    let find
    menu.forEach((item) => {
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
        tabComponent.value = markRaw(find.content)
      }
    } catch (e) {
      console.log(e)
    }
  }

  onMounted(() => {
    tabComponent.value = markRaw(AreaContent)
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference {
    padding-left: 0 !important;
  }
</style>

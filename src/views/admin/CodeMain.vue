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
  import CommonCode from '@/components/admin/code/index.vue'
  import SystemCode from '@/components/admin/config/index.vue'
  import { ref } from 'vue'
  import { markRaw } from 'vue'
  import { onMounted } from 'vue'

  const tabComponent = ref()
  const defaultContentKey = ref('CommonCode')

  const menu = [
    {
      key: 'Code',
      name: '코드',
      sub: [
        {
          key: 'CommonCode',
          name: '공통코드 관리',
          content: CommonCode,
        },
        {
          key: 'SystemCode',
          name: '시스템코드 관리',
          content: SystemCode,
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
    if (find) {
      tabComponent.value = markRaw(find.content)
    }
  }

  onMounted(() => {
    tabComponent.value = markRaw(CommonCode)
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference {
    padding-left: 0 !important;
  }
</style>

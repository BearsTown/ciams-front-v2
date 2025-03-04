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
  import Users from '@/components/admin/user/Users.vue'
  import LoginLog from '@/components/admin/user/LoginLog.vue'
  import Access from '@/components/admin/user/Access.vue'
  import { ref, markRaw, onMounted } from 'vue'

  const tabComponent = ref()
  const defaultContentKey = ref('Users')

  const menu = [
    {
      key: 'User',
      name: '사용자',
      sub: [
        {
          key: 'Users',
          name: '사용자 / 권한관리',
          content: Users,
        },
        {
          key: 'Access',
          name: '메뉴 접근 권한관리',
          content: Access,
        },
        {
          key: 'LoginLog',
          name: '접속자 통계',
          content: LoginLog,
        },
      ],
    },
  ]

  const clickSubMenu = (key) => {
    console.log(key)

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
    tabComponent.value = markRaw(Users)
  })
</script>
<style scoped>
  @import '@/assets/css/referencePage.css';

  #reference {
    padding-left: 0 !important;
  }
</style>

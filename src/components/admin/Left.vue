<template>
  <div class="sidebar">
    <div class="sidebar-top">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z"
          fill="white"
        />
      </svg>
      <span class="text">{{ userName }}</span>
    </div>

    <div class="sidebar-menu" v-for="item in menu" :key="item.key">
      <div class="title">{{ item.name }}</div>
      <ul class="menu-list" v-for="subItem in item.sub" :key="subItem.key">
        <li
          @click="clickMenu(subItem)"
          class="menu-item"
          :class="{ active: currentKey === subItem.key || initKey === subItem.key }"
        >
          {{ subItem.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'

  import { useAuthStore } from '@/stores/auth'

  const authStore = useAuthStore()
  const { userName } = storeToRefs(authStore)

  const currentKey = ref('')

  const props = withDefaults(
    defineProps<{
      menu: {
        key: string
        name: string
        sub: {
          key: string
          name: string
        }[]
      }[]
      defaultKey: string
    }>(),
    {},
  )

  const initKey = ref('')

  const emits = defineEmits<{
    (e: 'click', key: string): void
  }>()

  function clickMenu(item) {
    initKey.value = ''
    currentKey.value = item.key
    emits('click', item.key)
  }

  watch(props, () => {
    currentKey.value = ''
    initKey.value = props.defaultKey
  })

  onMounted(async () => {
    initKey.value = props.defaultKey
  })
</script>

<style scoped>
  @import '@/assets/css/referencePage.css';
</style>

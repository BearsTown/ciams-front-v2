<template>
  <div class="main-container">
    <div class="l-header">
      <span class="header-title">{{ data?.title }}</span>
      <div class="right"></div>
    </div>

    <div class="content-wrap">
      <div class="content download">
        <div class="customCard left">
          <Left :menu-id="data?.id" :menu-title="data?.title" @item-select="menuSelectListener" />
        </div>

        <div class="customCard right">
          <Main :menu-id="selectedMenuId" />
        </div>
      </div>
    </div>

    <div class="l-footer">
      <div class="customPagination"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import Left from '@/components/admin/content/Left.vue'
  import Main from '@/components/admin/content/ContentMain.vue'

  const props = withDefaults(
    defineProps<{
      data: {
        id: number
        title: string
      }
    }>(),
    {},
  )

  const selectedMenuId = ref<number>()

  const emits = defineEmits<{
    (e: 'close', status: boolean): void
  }>()

  function menuSelectListener(menuId: number) {
    selectedMenuId.value = menuId
  }
</script>

<style scoped>
  @import '@/assets/css/referencePage.css';
</style>

<style scoped lang="scss">
  #reference .content.download .customCard {
    flex: auto;
  }

  .main-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .left {
      width: calc(26% - 16px) !important;
    }

    .right {
      width: calc(74% - 16px) !important;
    }
  }
</style>

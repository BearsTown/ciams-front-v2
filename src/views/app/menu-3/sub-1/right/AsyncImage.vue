<template>
  <el-image
    v-if="imageSrc"
    style="width: 100%; height: 100%"
    :src="imageSrc"
    :preview-src-list="[imageSrc]"
    :preview-teleported="true"
    fit="contain"
  />
</template>

<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue'
  import { getImage as getImageAxios } from '@/api/app/menu-3/sub-1'

  const props = withDefaults(
    defineProps<{
      id: number
    }>(),
    {},
  )

  const imageSrc = ref<string | null>(null)

  async function getImage(id: number) {
    const response = await getImageAxios(id)
    const imageBlob = new Blob([response.data], { type: response.headers['content-type'] })
    return computed(() => URL.createObjectURL(imageBlob))
  }

  onBeforeMount(async () => {
    const computedRef = await getImage(props.id)
    imageSrc.value = computedRef.value
  })
</script>

<style scoped>
  @import '@/assets/css/errorPage.css';
</style>

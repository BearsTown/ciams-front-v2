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
  import { onMounted, ref } from 'vue'

  import { getImage as getImageAxios } from '@/api/app/plan/concept'

  const props = withDefaults(
    defineProps<{
      id: number
    }>(),
    {},
  )

  const imageSrc = ref<string | null>(null)

  async function fetchImage(id: number) {
    const response = await getImageAxios(id)
    const imageBlob = new Blob([response.data], { type: response.headers['content-type'] })
    // return computed(() => URL.createObjectURL(imageBlob))
    imageSrc.value = URL.createObjectURL(imageBlob)
  }

  onMounted(() => fetchImage(props.id))

  // onBeforeMount(async () => {
  //   const computedRef = await fetchImage(props.id)
  //   imageSrc.value = computedRef.value
  // })
</script>

<style scoped>
  @import '@/assets/css/errorPage.css';
</style>

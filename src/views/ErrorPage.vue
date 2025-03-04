<template>
  <div id="error">
    <header>
      <h1 class="logo">
        <a href="/">{{ title }}</a>
      </h1>
    </header>
    <div class="container">
      <div class="box">
        <div class="img-wrap">
          <img src="@/assets/img/img_error.png" alt="에러 이미지" />
        </div>
        <dl class="text">
          <dt>원하시는 페이지를 찾을 수 없습니다.</dt>
          <dd>
            찾으려는 페이지의 주소가 잘못 입력되었거나,<br />
            주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.<br />
            입력하신 페이지의 주소가 정확한지 다시한번 확인해주세요.
          </dd>
        </dl>
        <button type="button" class="btn-back" @click="router.push('/')">돌아가기</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { getConfig } from '@/api/app/config'

  const router = useRouter()

  const title = ref<string>()

  onBeforeMount(async () => {
    const { data } = await getConfig('SYSTEM_NAME_KOR')
    if (data) title.value = `${data.confValue}`
  })
</script>

<style scoped>
  @import '@/assets/css/errorPage.css';
</style>

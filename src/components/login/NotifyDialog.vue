<template>
  <div class="noticeDropdown" :class="{ active: isVisible }">
    <div class="title">알림</div>
    <button type="button" class="btn-close" @click="emits('close-dialog')">
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 1L13 13" stroke="black" stroke-width="2" stroke-linecap="round" />
        <path d="M13 1L0.999999 13" stroke="black" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
    <table class="customTable">
      <colgroup>
        <col width="80%" />
        <col width="20%" />
      </colgroup>
      <tbody>
        <tr>
          <td>
            <div class="customScroll scrollY">인센티브산정 대기일 30일 이하</div>
          </td>
          <th>0건</th>
        </tr>
        <tr>
          <td>
            <div class="customScroll scrollY">인센티브산정 대기일 30일 이하</div>
          </td>
          <th>0건</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
  import { computed, ref } from 'vue'

  const activeName = ref<string>('login')

  const props = withDefaults(
    defineProps<{
      isVisible: boolean
    }>(),
    {
      isVisible: false,
    },
  )

  const dialogVisible = computed({
    get() {
      return props.isVisible
    },
    set(isVisible) {
      return isVisible
    },
  })

  const emits = defineEmits<{
    (e: 'close-dialog'): void
  }>()
</script>
<style scoped></style>

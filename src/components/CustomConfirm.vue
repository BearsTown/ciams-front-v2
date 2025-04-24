<template>
  <transition name="customConfirm" appear v-if="isVisible">
    <div
      style="
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        position: fixed;
        background: rgba(0, 0, 0, 0.5);
      "
    >
      <div id="customConfirm">
        <div class="header">
          <span class="header-title">
            <slot name="title"></slot>
          </span>
          <button type="button" class="btn-close" @click="emits('close', false)">
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
        </div>
        <div class="body customScroll scrollY">
          <slot name="content"></slot>
        </div>
        <div class="footer">
          <button type="button" class="btn-confirm" @click="emits('close', false)">취소</button>
          <button type="button" class="btn-confirm" @click="emits('close', true)">완료</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      isVisible: boolean
    }>(),
    {
      isVisible: false,
    },
  )

  const emits = defineEmits<{
    (e: 'close', status: boolean): void
  }>()
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #customConfirm {
    width: 423px;
    height: 226px;
    position: fixed;
    /* position: fixed; 전체 구역에서 로딩시 fixed */
    /* position: absolute; 구역 안에서 로딩시 absolute */
    top: 50%;
    left: 50%;
    display: flex;
    flex-flow: column;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    word-break: break-all;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    transform: translate(-50%, -50%);
    z-index: 9999;
  }
  #customConfirm .header {
    position: relative;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
  }
  #customConfirm .btn-close {
    position: absolute;
    top: 0;
    right: 0;
  }
  #customConfirm .header-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #000;
  }
  #customConfirm .body {
    height: 107px;
    padding: 14px 0;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.21;
    color: #3a4767;
  }
  #customConfirm .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }
  #customConfirm .btn-confirm {
    width: 56px;
    height: 28px;
    border-radius: 4px;
    background: #7AAAD1;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: #fff;
  }
  #customConfirm .btn-confirm:not(:first-child) {
    margin-left: 6px;
  }
  #customConfirm .btn-confirm:hover {
    opacity: 0.8;
  }
</style>

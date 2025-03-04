<template>
  <div id="customLoading">
    <!-- <div class="icon-wrap"> -->
    <!-- <span class="icon"></span> -->
    <!-- </div> -->

    <div class="icon-wrap text">
      <span class="icon"></span>
      <span class="text">{{ title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      title?: string
    }>(),
    {
      title: '처리중입니다',
    },
  )
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #customLoading {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    opacity: 0.5;
  }
  #customLoading .icon-wrap {
    width: 184px;
    height: 165px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    /* background: #fff; */
    /* box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); */
  }
  #customLoading .icon-wrap.text {
    width: 184px;
    height: 165px;
    flex-flow: column;
  }
  #customLoading .icon {
    width: 52px;
    height: 52px;
    border: 8px solid transparent;
    background-image: linear-gradient(#fff, #fff), linear-gradient(to right, #fff 0%, #2d2d2d 100%);
    border-radius: 50%;
    border-image-slice: 1;
    background-origin: border-box;
    background-clip: content-box, border-box;
    animation: linear loadingSpin 1.5s infinite;
  }
  #customLoading .icon-wrap.text .text {
    margin-top: 26px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #000;
  }

  @keyframes loadingSpin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

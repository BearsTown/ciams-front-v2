<template>
  <transition name="modal" appear>
    <div class="customModal customModal-overlay">
      <!--  @click.self="$emit('close')" -->
      <div class="customModal-window">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<style>
  .customModal.customModal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .customModal-window {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);
  }

  .customModal-header {
    position: relative;
  }

  .customModal-header .title {
    padding-bottom: 16px;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.18;
    color: #000;
  }

  .customModal-header .btn-close {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>

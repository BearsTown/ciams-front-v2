<template>
  <div class="customCard checkbox" :class="{ active: isOpen }">
    <div class="card-title">
      <div class="row">
        {{ title }}
        <div class="customTooltip" v-if="tooltipTitle">
          <button type="button" class="btn-tooltip" @click="tooltipActive = !tooltipActive">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.99996 1.37969C3.89489 1.37969 1.37773 3.89684 1.37773 7.00191C1.37773 10.107 3.89489 12.6241 6.99996 12.6241C10.105 12.6241 12.6222 10.107 12.6222 7.00191C12.6222 3.89684 10.105 1.37969 6.99996 1.37969ZM0.177734 7.00191C0.177735 3.2341 3.23215 0.179687 6.99996 0.179688C10.7678 0.179688 13.8222 3.2341 13.8222 7.00191C13.8222 10.7697 10.7678 13.8241 6.99996 13.8241C3.23215 13.8241 0.177734 10.7697 0.177734 7.00191ZM6.99996 4.06858C7.33133 4.06858 7.59996 4.33721 7.59996 4.66858V4.69592C7.59996 5.02729 7.33133 5.29592 6.99996 5.29592C6.66859 5.29592 6.39996 5.02729 6.39996 4.69592V4.66858C6.39996 4.33721 6.66859 4.06858 6.99996 4.06858ZM6.99996 6.40191C7.33133 6.40191 7.59996 6.67054 7.59996 7.00191L7.59996 10.113C7.59996 10.4444 7.33133 10.713 6.99996 10.713C6.66859 10.713 6.39996 10.4444 6.39996 10.113L6.39996 7.00191C6.39996 6.67054 6.66859 6.40191 6.99996 6.40191Z"
                fill="#757575"
              />
            </svg>
          </button>
          <div class="customTooltip-box" :class="{ active: tooltipActive }">
            <p class="tooltip-title">
              <img src="@/assets/img/ico_tooltipActive.svg" alt="" />
              {{ tooltipTitle }}
            </p>
            <p class="tooltip-text">
              <slot name="tooltipContent"></slot>
            </p>
          </div>
        </div>
      </div>
      <div style="margin-left: auto">
        <slot name="button"></slot>
      </div>
      <button v-if="btnVisible" type="button" class="btn-toggle" @click="buttonAction">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="chevron-down">
            <path
              id="Vector"
              d="M7 10L12.0008 14.58L17 10"
              stroke="#424242"
              stroke-width="1.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
        </svg>
      </button>
    </div>
    <div class="checkbox-wrap">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import { useBoolean } from '@/hooks/useBoolean'

  const props = withDefaults(
    defineProps<{
      title: string
      isOpen?: boolean
      useLeftMargin?: boolean
      tooltipTitle?: string
      btnVisible?: boolean
    }>(),
    {
      title: '',
      isOpen: true,
      useLeftMargin: false,
      btnVisible: true,
    },
  )

  const tooltipActive = ref(false)

  const buttonAction = () => {
    toggle()
  }

  const { status: isOpen, toggle } = useBoolean(props.isOpen)
</script>

<style scoped lang="scss">
  .zoningSetting .customCard.checkbox .card-title {
    font-weight: normal;
    font-size: 14px;
  }
</style>

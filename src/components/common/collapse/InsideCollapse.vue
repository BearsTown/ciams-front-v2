<template>
  <div class="border-box-round" style="padding: 0 10px; margin: 5px">
    <div :class="['common-collapse', 'inside-collapse']" @click="toggle">
      <div>
        <div :class="{ 'title noSub': !$slots.sub, title: $slots.sub }">
          {{ title }}
        </div>
        <div style="flex: 1" v-if="$slots.sub">
          <slot name="sub"></slot>
        </div>
        <div>
          <el-icon class="icon-caret-collapse" :class="{ 'is-open': isOpen }">
            <CaretLeft />
          </el-icon>
        </div>
      </div>
    </div>

    <el-collapse-transition>
      <div v-show="isOpen" style="padding-bottom: 5px; white-space: pre-line">
        <slot name="content"></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
  import { useBoolean } from '@/hooks/useBoolean'

  const props = withDefaults(
    defineProps<{
      title: string
      isOpen?: boolean
    }>(),
    {
      title: '',
      isOpen: true,
    },
  )

  const { status: isOpen, toggle, on, off } = useBoolean(props.isOpen)

  defineExpose({
    on,
    off,
    toggle,
  })
</script>

<style scoped lang="scss">
  .inside-collapse {
    padding: 0;
    display: flex;
    align-items: center;

    &:deep(.icon-caret-collapse) {
      //color: var(--ugis-color-temp-2);
      color: var(--ugis-color-black);

      &.is-open {
        transform: rotate(-90deg);
      }
    }

    & > div {
      .title {
        //flex: 0.3;
      }
      .noSub {
        flex: 1 !important;
      }

      .func-button {
        width: 30px;
        justify-content: center;
        color: var(--ugis-color-white);
      }
    }
  }
</style>

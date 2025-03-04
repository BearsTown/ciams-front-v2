<template>
  <div style="margin: 5px; padding: 5px 0">
    <div :class="['common-collapse', 'group-collapse']" @click="toggle">
      <div>
        <div>
          <el-icon class="icon-caret-collapse" :class="{ 'is-open': isOpen }">
            <CaretRight />
          </el-icon>
        </div>

        <div class="title">
          {{ title }}
        </div>

        <div @click.prevent.stop>
          <slot name="sub"></slot>
        </div>
      </div>
    </div>

    <el-collapse-transition>
      <div v-show="isOpen" :class="{ 'is-left-margin': useLeftMargin }">
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
      useLeftMargin?: boolean
    }>(),
    {
      title: '',
      isOpen: true,
      useLeftMargin: false,
    },
  )

  const { status: isOpen, toggle } = useBoolean(props.isOpen)
</script>

<style scoped lang="scss">
  .group-collapse {
    padding: 3px;
  }

  .is-left-margin {
    margin-left: 15px;
  }
</style>

<template>
  <!-- <div style="margin: 5px">
    <div :class="['common-collapse', 'switch', { 'is-disabled': !isActive }]">
      <div>
        <div style="width: 30px"></div>

        <div class="title">
          {{ title }}
        </div>

        <div class="func-button" @click.prevent.stop>
          <el-switch
            size="small"
            v-model="isActive"
            @click.prevent.stop
            @change="handleSwitchChange"
            style="--el-switch-on-color: chartreuse; --el-switch-off-color: var(--ugis-color-gray)"
          />
        </div>
      </div>
    </div>
  </div> -->

  <!-- <div class="set-wrap"> -->
  <label :class="isActive ? 'set-item active' : 'set-item'" style="width: calc((100%) - 6px)">
    {{ title
    }}<input
      type="checkbox"
      v-model="isActive"
      style="display: none"
      @change="handleSwitchChange(isActive)"
    />
  </label>
  <!-- </div> -->
</template>

<script setup lang="ts">
  import { useBoolean } from '@/hooks/useBoolean'
  import { watch } from 'vue'

  const props = withDefaults(
    defineProps<{
      title: string
      isActive?: boolean
    }>(),
    {
      title: '',
      isActive: true,
    },
  )

  const { status: isActive, toggle: toggleActive } = useBoolean(props.isActive)

  const emits = defineEmits<{
    (e: 'switch-change', type: boolean): void
  }>()

  function setSwitch(val) {
    isActive.value = val
    handleSwitchChange(isActive.value)
  }

  function handleSwitchChange(val: boolean) {
    emits('switch-change', val)
  }

  watch(
    () => props.isActive,
    () => {
      isActive.value = props.isActive
    },
  )

  defineExpose({
    setSwitch,
  })
</script>

<style scoped lang="scss">
  .switch {
    cursor: default;
    background-color: var(--ugis-color-temp-3);

    & > div {
      .title {
        text-align: center;
        color: var(--ugis-color-white);
      }

      .func-button {
        width: 30px;
        justify-content: center;
        color: var(--ugis-color-white);
      }
    }
  }
</style>

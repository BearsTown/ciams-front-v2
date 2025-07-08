<template>
  <div class="collapsible-menu-container">
    <template v-for="(tab, index) in tabs" :key="tab.id">
      <CollapsibleMenuItem
        class="menu-item"
        ref="menuItemRefs"
        :title="tab.name"
        :is-open="selectedTabId === tab.id"
        :is-child="tab.isChild"
        @open-change="(isOpen) => handleMenuItemToggle(isOpen, tab.id, index)"
      >
        <template #content>
          <component :is="getComponentForTab(tab.id)" v-bind="componentProps" />
        </template>
      </CollapsibleMenuItem>

      <el-divider v-if="index < tabs.length - 1" style="margin: 10px 0" border-style="dashed" />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, PropType, ref } from 'vue'

  import CollapsibleMenuItem from '@/components/common/collapse/CollapsibleMenuItem.vue'

  export interface TabItem {
    id: string
    name: string
    isChild?: boolean
    isActive?: boolean
  }

  const props = defineProps({
    tabs: {
      type: Array as PropType<TabItem[]>,
      required: true,
    },
    selectedTabId: {
      type: String,
      required: true,
    },
    componentMap: {
      type: Object as PropType<Record<string, any>>,
      required: true,
    },
    componentProps: {
      type: Object,
      default: () => ({}),
    },
    defaultComponent: {
      type: Object,
      default: null,
    },
  })

  const emit = defineEmits(['tab-change'])

  const menuItemRefs = ref([])

  const getComponentForTab = computed(() => (tabId: string) => {
    return props.componentMap[tabId] || props.defaultComponent
  })

  function handleMenuItemToggle(isOpen: boolean, tabId: string, index: number) {
    if (!isOpen) return

    // Close all other menu items
    menuItemRefs.value.forEach((item, i) => {
      if (i !== index && item?.setOpen) {
        item.setOpen(false)
      }
    })

    // Emit the selected tab to parent
    emit('tab-change', tabId)
  }

  onMounted(() => {
    // Any initialization logic can go here
  })
</script>

<style scoped lang="scss">
  .collapsible-menu-container {
    display: flex;
    width: 100%;
    flex-direction: column;
  }

  .menu-item {
    overflow-y: hidden;
  }
</style>

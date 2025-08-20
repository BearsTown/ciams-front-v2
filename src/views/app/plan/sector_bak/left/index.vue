<template>
  <div class="zoningSetting">
    <ul class="zoningSetting-tab customTab">
      <li
        v-for="(group, index) in groups"
        :key="index"
        @click.prevent="handleTabChange(group)"
        :class="{ active: group.isActive }"
        class="customTab-item"
      >
        {{ group.title }}
      </li>
    </ul>

    <div class="zoningSetting-content border-container">
      <keep-alive>
        <component
          :is="Left"
          v-if="selectedGroupId"
          :key="selectedGroupId"
          :parent-id="selectedGroupId"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'

  import { Style } from 'ol/style'

  import MenuCollapse from '@/components/common/collapse/MenuCollapse.vue'
  import { usePlanSectorStore } from '@/stores/app/plan/sector'
  import { getContentMenuList } from '@/api/app/content'
  import Left from '@/components/app/plan/Improvement-zone/left'

  const planSectorStore = usePlanSectorStore()

  function handleTabChange(group: {}) {
    planSectorStore.selectGroup(group)
  }

  const groups = computed(() => planSectorStore.groups)
  const selectedGroupId = computed(() => planSectorStore?.selectedGroup?.id)

  onMounted(async () => {
    const { data } = await getContentMenuList(1)
    planSectorStore.setGroupList(data)

    handleTabChange(data[0])
  })
</script>

<style lang="scss">
  //@import '@/assets/css/zoningSetting.css';

  .zoningSetting .zoningSetting-top .customSelect {
    border: 0;
  }

  .zoningSetting-top.customCard .customSelect-value {
    font-size: 14px;
    border: 0;
    padding: 0;
  }

  .zoningSetting .customTab-item:not(.disabled).active {
    background: #7aaad1;
    color: #fff;
  }
</style>

<style scoped lang="scss">
  .zoningSetting-tab {
    margin: 0;
  }

  .customTab {
    display: flex;
    padding: 10px 0 10px 0;
    justify-content: space-between;

    .customTab-item {
      flex: 1;
      padding: 0;
      margin-left: 10px;
      background-color: white;
    }

    .customTab-item:first-child {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .menuButton {
    overflow-y: hidden;

    &:not(:first-child) {
      //margin-top: 8px;
    }
  }
</style>

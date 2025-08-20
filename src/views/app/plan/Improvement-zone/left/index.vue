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

  import Left from '@/components/app/plan/Improvement-zone/left'

  import { ContentMenu } from '@/models/services/app/content-menu'
  import { getContentMenuList } from '@/services/app/content-menu'

  import { usePlanImprovementZoneStore } from '@/stores/app/plan/Improvement-zone'

  const planImprovementZoneStore = usePlanImprovementZoneStore()

  function handleTabChange(group: ContentMenu) {
    planImprovementZoneStore.selectGroup(group)
  }

  const groups = computed<ContentMenu[]>(() => planImprovementZoneStore.groups)
  const selectedGroupId = computed<number | undefined>(
    () => planImprovementZoneStore?.selectedGroup?.id,
  )

  onMounted(async () => {
    const data = await getContentMenuList(2)
    planImprovementZoneStore.setGroupList(data)
    planImprovementZoneStore.selectGroup(data[0])
  })
</script>

<style scoped lang="scss">
  .urbanInfo {
    padding: 0;
  }

  .zoningSetting-top {
    min-height: 0px;
    padding: 10px;
  }

  .zoningSetting-tab {
    margin: 0;
  }

  .customTab {
    display: flex;
    overflow: visible;
    padding: 10px 0 10px 0;
    justify-content: space-between;

    .customTab-item {
      flex: 1;
      padding: 0 !important;
      //margin-left: 5px !important;
      background-color: white;
      border-radius: 0;
      box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.12);
    }

    .customTab-item:first-child {
      margin-left: 0;
      margin-right: 0;
    }
  }

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

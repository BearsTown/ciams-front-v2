<template>
  <div class="panel">
    <keep-alive>
      <component :is="currentTabComponent" />
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
  import { computed, DefineComponent } from 'vue'

  import DistrictComp from '@/components/app/basic/urban/district/panel'
  import CompanyComp from '@/components/app/basic/urban/company/panel'
  import IndCharComp from '@/components/app/basic/urban/ind-char/panel'

  import { BasicUrbanTabIdType, useBasicUrbanStore } from '@/stores/app/basic/urban'

  const basicUrbanStore = useBasicUrbanStore()

  const components: Record<BasicUrbanTabIdType, DefineComponent> = {
    TabB: DistrictComp,
    TabC: CompanyComp,
    TabD: IndCharComp,
  }

  const currentTabComponent = computed(
    () => components[basicUrbanStore.selectedTabId] || DistrictComp,
  )
</script>

<style scoped lang="scss">
  .panel {
    height: 100%;
    //padding: 15px 12px;
    padding: 10px;
    background-color: #f4f4f4;
  }
</style>

<!-- 사용 안함-->
<template>
  <MainContainer :use-left="false" :use-right="false">
    <!-- <template #map-content>
      <Center />
      <div class="archive">
        <router-view name="userArchive" />
      </div>
    </template>     -->
  </MainContainer>
</template>

<script setup lang="ts">
  import MainContainer from '@/components/common/MainContainer'
  import Center from '@/views/app/archive/center'
</script>

<style scoped></style>

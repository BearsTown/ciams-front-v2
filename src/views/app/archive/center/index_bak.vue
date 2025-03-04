<template>
  <div id="reference" class="active">
    <MenuContent />
    <router-view name="userArchive" />
  </div>
</template>

<script setup lang="ts">
  import MenuContent from '@/views/app/archive/menuContent'
</script>

<style>
  @import '@/assets/css/referencePage.css';

  #reference {
    min-width: 0;
    padding-left: 70px;
  }
</style>

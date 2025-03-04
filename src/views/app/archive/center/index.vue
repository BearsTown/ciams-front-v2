<template>
  <div id="reference" class="active">
    <MenuContent />
    <component :is="currentComponent" />
  </div>
</template>

<script setup lang="ts">
  import MenuContent from '@/views/app/archive/menuContent'

  import ArchiveMain from '@/components/app/archive/ArchiveMain.vue'
  import ArchiveDetail from '@/components/app/archive/Detail.vue'
  import ArchiveGeonuris from '@/components/app/archive/ArchiveGeonuris.vue'
  import ArchiveLayerDL from '@/components/app/archive/ArchiveLayerDownLoad.vue'

  import { computed, watch, ref } from 'vue'
  import { RouteName, RouteNameType } from '@/router'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const routeName = computed(() => route.name)

  const currentView = ref('main')

  const currentComponent = computed(() => {
    switch (currentView.value) {
      case 'main':
        return ArchiveMain
      case 'detail':
        return ArchiveDetail
      case 'geonuris':
        return ArchiveGeonuris
      case 'layerDL':
        return ArchiveLayerDL
      default:
        return ArchiveMain
    }
  })

  watch(routeName, () => {
    authStore.checkToken()

    if (!routeName.value) return

    switch (routeName.value) {
      case 'archiveMain':
        currentView.value = 'main'
        break
      case 'archiveDetail':
        currentView.value = 'detail'
        break
      case 'archiveGeonuris':
        currentView.value = 'geonuris'
        break
      case 'archiveLayerDL':
        currentView.value = 'layerDL'
        break
    }
  })
</script>

<style>
  @import '@/assets/css/referencePage.css';

  #reference {
    min-width: 0;
  }
</style>

<template>
  <div class="bg-white flex overflow-hidden" style="height: 100vh;">
    <!-- Sidebar di kiri fixed -->
    <Sidebar
      :open="sidebarOpen"
      @close-sidebar="sidebarOpen = false"
      class="shrink-0 border-r-2 border-white/50 bg-blue-900/95 backdrop-blur-xl transition-all duration-300 z-50"
      style="box-shadow: 4px 0 20px 0 rgba(0,0,0,0.08); width: 280px;"
    />
    <!-- Content area -->
    <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <!-- Header fixed top -->
      <Header
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        class="h-20 shrink-0 border-b-2 border-white/30 shadow-lg"
        style="z-index: 40; background-color: #1F4F85;"
      />
      <!-- Topbar di bawah Header -->
      <Topbar class="shrink-0" />
      
      <!-- Main content scrollable -->
      <main class="flex-1 overflow-y-auto p-8 pb-20 bg-white custom-content-scroll">
        <Breadcrumb class="mb-6" />
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.custom-content-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.custom-content-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-content-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-content-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>

<script setup lang="ts">
// Layout dashboard: Sidebar kiri + Header atas konten
// tanpa Navbar/Footer
import { ref } from 'vue';
import Sidebar from '~/components/Sidebar.vue';
import Header from '~/components/Header.vue';
import Topbar from '~/components/Topbar.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
const sidebarOpen = ref(true)
</script>


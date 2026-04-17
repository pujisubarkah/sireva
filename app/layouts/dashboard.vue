<template>
  <div class="bg-gray-50 flex overflow-hidden" style="height: 100vh;">
    <!-- Sidebar di kiri fixed -->
    <Sidebar
      :open="sidebarOpen"
      @close-sidebar="sidebarOpen = false"
      class="shrink-0 border-r-2 border-white/50 bg-blue-900/95 backdrop-blur-xl transition-all duration-300 z-50"
      style="box-shadow: 4px 0 20px 0 rgba(0,0,0,0.08); width: 280px;"
    />
    <!-- Content area -->
    <div class="flex-1 flex flex-col">
      <!-- Header fixed top -->
      <Header
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        class="h-20 shrink-0 border-b-2 border-white/30 bg-linear-to-r from-blue-900/95 to-blue-800/95 backdrop-blur-xl shadow-lg"
        style="z-index: 40;"
      />
      <!-- Main content scrollable -->
      <main class="flex-1 overflow-y-auto p-8 pb-12" style="min-height:0;">
        <Breadcrumb />
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout dashboard: Sidebar kiri + Header atas konten
// tanpa Navbar/Footer
import { ref } from 'vue';
import Sidebar from '~/components/Sidebar.vue';
import Header from '~/components/Header.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
const sidebarOpen = ref(true)
</script>


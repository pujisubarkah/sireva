<script setup lang="ts">
const route = useRoute()
const unitName = computed(() => route.params.slug)

definePageMeta({ layout: 'dashboard' })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div class="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
      <h1 class="text-2xl font-bold text-blue-700 mb-2">Selamat Datang!</h1>
      <p class="text-gray-600 mb-4 font-medium">
        Anda berhasil login sebagai <span class="text-blue-600" v-text="unitName"></span>.
      </p>
      <p class="text-gray-400 text-sm">Halaman ini masih dalam pengembangan.<br>Silakan hubungi admin jika Anda membutuhkan akses fitur lebih lanjut.</p>
    </div>
  </div>
</template>
<style scoped>
/* Empty style to clear cache */
</style>

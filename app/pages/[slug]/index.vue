<script setup lang="ts">
const route = useRoute()
const unitName = computed(() => route.params.slug)

definePageMeta({ layout: 'dashboard' })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4">
    <div class="bg-white shadow-2xl rounded-3xl p-12 max-w-2xl w-full text-center border border-blue-100 relative overflow-hidden">
      <div class="flex flex-col items-center mb-8">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" class="mb-4">
          <circle cx="48" cy="48" r="48" fill="#2663A3" fill-opacity="0.08"/>
          <g>
            <polygon points="48,22 54,40 73,40 57,52 63,70 48,59 33,70 39,52 23,40 42,40" fill="#2663A3"/>
            <polygon points="48,28 52,40 64,40 54,48 58,60 48,53 38,60 42,48 32,40 44,40" fill="#FBB23B"/>
          </g>
        </svg>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow" style="color:#F2BD1D">Selamat Datang!</h1>
        <p class="text-lg md:text-2xl text-gray-700 font-semibold mb-2">Anda berhasil login sebagai <span class="text-[#F2BD1D]">admin</span></p>
      </div>
      <p class="text-gray-500 text-base md:text-lg mb-6">Halaman ini masih dalam pengembangan.<br>Silakan hubungi admin jika Anda membutuhkan akses fitur lebih lanjut.</p>
      <div class="absolute -bottom-8 -right-8 opacity-10 pointer-events-none select-none">
        <svg width="180" height="180" fill="none" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="90" fill="#2663A3" />
        </svg>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* Empty style to clear cache */
</style>

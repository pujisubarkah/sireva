<template>
  <header class="cd-main-header menu indo-new-menu w-full bg-blue-900 border-b border-gray-200" style="box-shadow: none;">
    <div class="flex items-center justify-between px-4 py-2">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink id="hdr_logo" class="cd-logo flex items-center shrink-0" to="/" title="IM3 - Simpel. Jujur. Transparan">
          <img id="hdr_img_logo" alt="Logo" width="90" height="60" src="/logolanwhite.png" style="border: 2.5px solid white; border-radius: 8px; padding: 2px; background: transparent;" />
        </NuxtLink>
        <div class="hidden sm:flex flex-col justify-center leading-tight">
          <span class="text-white font-bold text-lg tracking-wide">SIREVA - NG</span>
          <span class="font-normal text-xs text-yellow-400">Sistem Informasi Perencanaan dan Evaluasi New Generation</span>
        </div>
      </div>
      <ul class="cd-header-buttons before-login-header-comp flex items-center gap-2 ml-8" id="ul_main_menu">
        <li>
          <NuxtLink to="/" class="text-white hover:text-yellow-400 font-medium px-3 py-1">Beranda</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ path: '/visi-misi' }" class="text-white hover:text-yellow-400 font-medium px-3 py-1">Visi & Misi</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="{ path: '/produk-hukum' }" class="text-white hover:text-yellow-400 font-medium px-3 py-1">Produk Hukum</NuxtLink>
        </li>
        <li>
          <a href="https://ppid.lan.go.id/" target="_blank" rel="noopener" class="text-white hover:text-yellow-400 font-medium px-3 py-1">PPID</a>
        </li>
        <li>
          <button id="hdr_login" class="beforelogin-btn px-4 py-1 rounded text-yellow-400 border border-yellow-300 hover:bg-yellow-50 font-semibold" type="button" @click="showLogin = true">
            <span>MASUK</span>
          </button>
        </li>
        <li>
          <button class="cd-search-trigger w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100" type="button" aria-label="Search">
            <span class="block w-4 h-4 bg-gray-400 rounded-full"></span>
          </button>
        </li>
        <li>
          <button class="cd-nav-trigger w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100" id="mobile_icon" type="button" aria-label="Menu">
            <span id="s_mobile_icon" class="block w-5 h-0.5 bg-gray-100 rounded"></span>
          </button>
        </li>
      </ul>
    </div>
  </header>

  <LoginModal v-model="showLogin" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showLogin = ref(false)
</script>

<style scoped>
.cd-logo img {
  display: block;
}
.beforelogin-btn {
  transition: background 0.2s, color 0.2s;
}
.indo-register-btn {
  transition: background 0.2s, color 0.2s;
}
</style>

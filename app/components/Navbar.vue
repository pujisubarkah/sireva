<template>
  <header class="cd-main-header menu indo-new-menu w-full bg-blue-900 border-b border-gray-200" style="box-shadow: none;">
    <div class="flex items-center justify-between px-4 py-2">
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink id="hdr_logo" class="cd-logo flex items-center shrink-0" to="/" title="SIREVA - NG">
          <img id="hdr_img_logo" alt="Logo" width="160" height="96" src="/logolanwhite.png" class="navbar-logo" />
        </NuxtLink>
        <div class="hidden sm:flex flex-col justify-center leading-tight">
          <span class="text-white font-bold text-lg tracking-wide">SIREVA - NG</span>
          <span class="font-normal text-xs text-yellow-400">Sistem Informasi Perencanaan dan Evaluasi - New Generation</span>
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
.navbar-logo {
  display: block;
  width: 120px;
  height: 72px;
  border: none;
  border-radius: 8px;
  background: transparent;
  padding: 0;
  margin-right: 12px;
  object-fit: contain;
  box-shadow: none;
}
.beforelogin-btn {
  transition: background 0.2s, color 0.2s;
}
.indo-register-btn {
  transition: background 0.2s, color 0.2s;
}
</style>

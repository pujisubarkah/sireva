<template>
  <footer id="contact-us" class="bg-blue-900 text-gray-100 pt-8 pb-4 mt-8">
    <div class="container mx-auto px-4">
      <div class="footer-content">
        <div class="flex flex-col md:flex-row md:space-x-8">
          <!-- Left: Logo/Image -->
          <div class="md:w-1/2 w-full flex justify-center md:justify-start mb-6 md:mb-0">
            <img src="/LANRI-ORG.png" width="300" alt="Logo" style="filter: drop-shadow(0 0 16px white);" />
          </div>
          <!-- Right: Info & Social -->
          <div class="md:w-1/2 w-full flex flex-col justify-center">
            <h2 class="text-2xl font-bold mb-2">Tentang <em class="not-italic text-yellow-400">e-SAKIP</em></h2>
            <p class="mb-4">e-SAKIP merupakan Sistem Informasi Laporan Akuntabilitas Kinerja Instansi Pemerintah Online Kabupaten Tasikmalaya</p>
            <ul class="flex space-x-4 text-xl">
              <li><a href="https://web.facebook.com/pemkabtasik/" target="_blank" aria-label="Facebook"><i class="fa fa-facebook"></i></a></li>
              <li><a href="https://twitter.com/pemkabtasik" target="_blank" aria-label="Twitter"><i class="fa fa-twitter"></i></a></li>
              <li><a href="https://www.instagram.com/pemkabtasik/" target="_blank" aria-label="Instagram"><i class="fa fa-instagram"></i></a></li>
              <li><a href="https://tasikmalayakab.go.id/index.php/en/" target="_blank" aria-label="Website"><i class="fa fa-globe"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-8 border-t border-gray-700 pt-4 text-center">
        <p class="text-sm">Copyright © 2026 Lembaga Administrasi Negara
          <!--| Designed by <a rel="nofollow" href="https://templatemo.com">TemplateMo</a> -->
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No logic needed for static footer
</script>

<style scoped>
.footer-content em {
  font-style: normal;
  color: #facc15;
}
</style>

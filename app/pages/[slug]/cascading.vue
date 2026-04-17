<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Cascading Kinerja</h1>
          <p class="text-sm text-slate-500 mt-1">Peta penurunan (alignment) sasaran dari tingkat organisasi hingga individu.</p>
        </div>
        <button
          type="button"
          class="px-3 py-1 rounded-lg border border-blue-800 text-blue-800 text-xs font-semibold hover:bg-blue-50"
        >
          Unduh Pohon Kinerja
        </button>
      </div>

      <div class="p-8 flex flex-col items-center relative overflow-x-auto">
        <div class="w-full max-w-xl flex flex-col items-center">
          <div class="bg-blue-800 text-white rounded-2xl px-8 py-6 mb-4 w-full relative">
            <div class="text-xs font-semibold text-yellow-400 mb-1">JPT UTAMA (SASARAN STRATEGIS)</div>
            <div class="text-lg font-bold mb-1">Meningkatnya Kualitas Tata Kelola Lembaga Administrasi Negara</div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="bg-blue-900 text-white text-xs px-2 py-0.5 rounded">Kepala LAN RI</span>
              <span class="ml-auto bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded">IKU: NILAI SAKIP LAN</span>
              <span class="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded">Target: A</span>
            </div>
          </div>

          <div class="w-1 h-6 bg-blue-200 mx-auto" />

          <div class="bg-white border border-blue-200 rounded-2xl px-8 py-6 mb-4 w-full relative">
            <div class="text-xs font-semibold text-blue-800 mb-1">JPT PRATAMA (SASARAN PROGRAM)</div>
            <div class="text-lg font-bold mb-1 text-blue-900">Terwujudnya ASN yang Profesional dan Kompeten</div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="bg-blue-50 text-blue-900 text-xs px-2 py-0.5 rounded">Kepala Pusbangkom Pejabat Negara</span>
              <span class="ml-auto bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded">IKP: INDEKS KEPUASAN LATSAR</span>
              <span class="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded">Target: 85.0</span>
            </div>
          </div>

          <div class="w-1 h-6 bg-blue-200 mx-auto" />

          <div class="bg-emerald-50 border border-emerald-200 rounded-2xl px-8 py-6 w-full relative">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <div class="text-xs font-semibold text-emerald-700">ADMINISTRATOR (SASARAN KEGIATAN)</div>
              <span class="bg-emerald-200 text-emerald-800 text-xs px-2 py-0.5 rounded-full">TUGAS ANDA</span>
            </div>
            <div class="text-lg font-bold mb-1 text-emerald-900">Penyusunan Kurikulum PKN I</div>
            <div class="flex items-center gap-2">
              <span class="bg-emerald-100 text-emerald-900 text-xs px-2 py-0.5 rounded">TARGET 1 Dokumen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
</script>

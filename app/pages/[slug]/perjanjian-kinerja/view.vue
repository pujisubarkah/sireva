<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Detail Perjanjian Kinerja</h1>
          <p class="text-sm text-slate-500 mt-0.5">Rincian data sasaran, indikator, dan target tahunan.</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="router.push(`/${$route.params.slug}/perjanjian-kinerja/edit?id=${id}`)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm transition-colors cursor-pointer"
          >
            <IconPencil :size="16" />
            Edit
          </button>
          <button
            @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)"
            class="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Kembali"
          >
            <IconX :size="20" />
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="fetching" class="p-12 text-center text-slate-500">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p>Memuat rincian data...</p>
      </div>

      <!-- Detail Content -->
      <div v-else class="p-6 space-y-8">
        <!-- Section: Informasi Perjanjian Kinerja -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-700 rounded-full"></span>
            Informasi Perjanjian Kinerja
          </h2>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- Sasaran -->
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Sasaran</span>
              <p class="text-sm text-slate-800 font-bold bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                {{ viewData.sasaran || '-' }}
              </p>
            </div>

            <!-- Indikator -->
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Indikator</span>
              <p class="text-sm text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed italic">
                {{ viewData.indikator || '-' }}
              </p>
            </div>

            <!-- Target -->
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Target</span>
              <div class="flex items-center gap-3">
                <p class="text-lg text-blue-700 font-black px-5 py-2 bg-blue-50 border border-blue-100 rounded-2xl">
                  {{ viewData.target || '-' }}
                </p>
                <span class="text-xs font-bold text-slate-400 uppercase">Tahun Berjalan</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Footer Metadata -->
        <div class="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
          <p>ID Perjanjian Kinerja: {{ id }}</p>
          <button 
            @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)"
            class="text-blue-600 hover:underline cursor-pointer"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen View Perjanjian Kinerja
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconX, IconPencil } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();

// State
const id = Number(route.query.id);
const fetching = ref(true);
const viewData = ref({
  sasaran: '',
  indikator: '',
  target: ''
});

// Fetch data on mount
onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/perjanjian-kinerja`);
    return;
  }

  try {
    fetching.value = true;
    
    // Mocking API call to load data
    console.log('Fetching data for ID:', id);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data based on the row selected
    viewData.value = {
      sasaran: id === 1 ? 'Terwujudnya ASN yang Profesional dan Kompeten' : 
               id === 2 ? 'Meningkatnya Kualitas Kurikulum Kediklatan ASN' : 
               'Terintegrasinya Sistem Pembelajaran Digital LAN',
      indikator: id === 1 ? 'Indeks Kepuasan Peserta Pelatihan' : 
                 id === 2 ? 'Jumlah Modul Pelatihan Kepemimpinan Tersusun' : 
                 'Jumlah Fitur Platform Pembelajaran Aktif',
      target: id === 1 ? '85.0' : id === 2 ? '4 Modul' : '3 Fitur'
    };

  } catch (error) {
    console.error('Error fetching view data:', error);
  } finally {
    fetching.value = false;
  }
});
</script>

<style scoped>
/* Scoped styles if needed */
</style>

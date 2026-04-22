<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Detail Sasaran Program</h1>
          <p class="text-sm text-slate-500 mt-0.5">Rincian data sasaran program, unit pelaksana, dan target multi-tahun.</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="router.push(`/${$route.params.slug}/sasaran-program/edit?id=${id}`)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm transition-colors cursor-pointer"
          >
            <IconPencil :size="16" />
            Edit
          </button>
          <button
            @click="router.push(`/${$route.params.slug}/sasaran-program`)"
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
        <!-- Section: Identitas Program -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-700 rounded-full"></span>
            Informasi Sasaran Program
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2 space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Nama Sasaran Program</span>
              <p class="text-sm text-slate-800 font-bold bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                {{ viewData.sasaranProgram || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Satuan</span>
              <p class="text-base text-slate-800 font-semibold px-4 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full inline-block">
                {{ viewData.satuan || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Unit Kerja Pelaksana</span>
              <p class="text-base text-slate-800 font-bold flex items-center gap-2">
                <IconSitemap :size="18" class="text-blue-600" />
                {{ viewData.unitKerja || '-' }}
              </p>
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <div class="space-y-4">
          <Accordion title="Target Kinerja Renstra" defaultOpen>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
              <div v-for="year in years" :key="`renstra-${year}`" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-center shadow-sm">
                <span class="block text-xs font-bold text-slate-400 uppercase mb-2">{{ year }}</span>
                <span class="text-xl font-black text-emerald-900">{{ viewData.targetRenstra[year] || '0' }}</span>
              </div>
            </div>
          </Accordion>

          <Accordion title="Target Perjanjian Kinerja (PK)">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
              <div v-for="year in years" :key="`pk-${year}`" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-center shadow-sm">
                <span class="block text-xs font-bold text-slate-400 uppercase mb-2">{{ year }}</span>
                <span class="text-xl font-black text-amber-900">{{ viewData.targetPerjanjian[year] || '0' }}</span>
              </div>
            </div>
          </Accordion>
        </div>

        <!-- Section: Footer Metadata -->
        <div class="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
          <p>ID Sasaran Program: {{ id }}</p>
          <button 
            @click="router.push(`/${$route.params.slug}/sasaran-program`)"
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
 * Komponen View Detail Sasaran Program
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconX, IconPencil, IconSitemap } from '@tabler/icons-vue';
import Accordion from '@/components/UI/accordion.vue';

const route = useRoute();
const router = useRouter();
const years = [2025, 2026, 2027, 2028, 2029];

// State
const id = Number(route.query.id);
const fetching = ref(true);
const viewData = ref({
  sasaranProgram: '',
  satuan: '',
  unitKerja: '',
  targetRenstra: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>),
  targetPerjanjian: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

// Fetch data on mount
onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/sasaran-program`);
    return;
  }

  try {
    fetching.value = true;
    
    // Mocking API call to load data
    console.log('Fetching detail for Sasaran Program ID:', id);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data based on the row selected
    const mockData = [
      {
        id: 1,
        sasaranProgram: 'Program Pelatihan ASN',
        satuan: 'Orang',
        targetRenstra: { 2025: 800, 2026: 900, 2027: 1000, 2028: 1100, 2029: 1200 },
        targetPerjanjian: { 2025: 780, 2026: 880, 2027: 980, 2028: 1050, 2029: 1150 },
        unitKerja: 'Pusbangkom ASN',
      },
      {
        id: 2,
        sasaranProgram: 'Program Penguatan Inovasi Kelembagaan',
        satuan: 'Inovasi',
        targetRenstra: { 2025: 8, 2026: 10, 2027: 12, 2028: 14, 2029: 16 },
        targetPerjanjian: { 2025: 7, 2026: 9, 2027: 11, 2028: 13, 2029: 15 },
        unitKerja: 'Puslatbang KDOD',
      },
      {
        id: 3,
        sasaranProgram: 'Program Digitalisasi Layanan Pembelajaran',
        satuan: 'Layanan',
        targetRenstra: { 2025: 5, 2026: 7, 2027: 9, 2028: 11, 2029: 13 },
        targetPerjanjian: { 2025: 5, 2026: 6, 2027: 8, 2028: 10, 2029: 12 },
        unitKerja: 'Pusdatin LAN',
      }
    ];

    const data = mockData.find(m => m.id === id);
    if (data) {
      viewData.value = {
        ...data,
        targetRenstra: Object.entries(data.targetRenstra).reduce((acc, [y, v]) => ({ ...acc, [Number(y)]: String(v) }), {}),
        targetPerjanjian: Object.entries(data.targetPerjanjian).reduce((acc, [y, v]) => ({ ...acc, [Number(y)]: String(v) }), {})
      } as any;
    }

  } catch (error) {
    console.error('Error fetching view data:', error);
  } finally {
    fetching.value = false;
  }
});
</script>

<style scoped>
/* Scoped styles */
</style>

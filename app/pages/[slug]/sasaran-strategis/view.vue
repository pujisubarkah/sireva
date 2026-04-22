<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Detail Sasaran Strategis</h1>
          <p class="text-sm text-slate-500 mt-0.5">Informasi lengkap sasaran, indikator, dan target tahunan.</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${indicatorId}`)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm transition-colors cursor-pointer"
          >
            <IconPencil :size="16" />
            Edit
          </button>
          <button
            @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
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
        <!-- Section: Identitas -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-700 rounded-full"></span>
            Informasi Sasaran
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Tujuan</span>
              <p class="text-sm text-slate-800 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                {{ viewData.tujuanText || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Sasaran Strategis</span>
              <p class="text-sm text-slate-800 font-bold bg-slate-50 p-3 rounded-lg border border-slate-100">
                {{ viewData.sasaranText || '-' }}
              </p>
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Section: Indikator -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-emerald-700 rounded-full"></span>
            Indikator Kinerja
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Nama Indikator</span>
              <p class="text-base text-slate-800 font-bold">
                {{ viewData.namaIndikator || '-' }}
              </p>
            </div>
            <div class="space-y-1">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Satuan</span>
              <p class="text-base text-slate-800 font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full inline-block">
                {{ viewData.satuan || '-' }}
              </p>
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Section: Target -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-amber-700 rounded-full"></span>
            Target Capaian Tahunan
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div v-for="year in years" :key="year" class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 text-center shadow-sm">
              <span class="block text-xs font-bold text-slate-400 uppercase mb-2">{{ year }}</span>
              <span class="text-xl font-black text-blue-900">{{ viewData.targets[year] || '0' }}</span>
            </div>
          </div>
        </div>

        <!-- Section: Footer Metadata -->
        <div class="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
          <p>ID Indikator: {{ indicatorId }}</p>
          <button 
            @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
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
 * Komponen View Sasaran Strategis
 * Digusur untuk menampilkan rincian data tanpa mode edit.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconX, IconPencil } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const years = [2025, 2026, 2027, 2028, 2029];

// State
const indicatorId = Number(route.query.id);
const fetching = ref(true);
const viewData = ref({
  tujuanText: '',
  sasaranText: '',
  namaIndikator: '',
  satuan: '',
  targets: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

// Fetch data on mount
onMounted(async () => {
  if (!indicatorId) {
    router.push(`/${route.params.slug}/sasaran-strategis`);
    return;
  }

  try {
    fetching.value = true;
    
    // Fetch resources
    const [indRes, sasRes, tarRes, thnRes, tujRes] = await Promise.all([
      $fetch<any[]>(`/api/indikator-kinerja?id=${indicatorId}`),
      $fetch<any[]>('/api/sasaran-strategis'),
      $fetch<any[]>('/api/target-indikator'),
      $fetch<any[]>('/api/tahun'),
      $fetch<any[]>('/api/tujuan')
    ]);

    const indicator = indRes[0];
    if (!indicator) throw new Error('Data tidak ditemukan');

    const sasaran = sasRes.find(s => s.id === indicator.sasaranId);
    const tujuan = tujRes.find(t => t.id === sasaran?.tujuanId);

    viewData.value.namaIndikator = indicator.namaIndikator;
    viewData.value.satuan = indicator.satuan;
    viewData.value.sasaranText = sasaran?.sasaranText || '';
    viewData.value.tujuanText = tujuan?.tujuanText || '';

    // Map targets
    const tahunMap: Record<number, number> = thnRes.reduce((acc: any, t: any) => {
      acc[t.id] = t.tahun;
      return acc;
    }, {});

    const indicatorTargets = tarRes.filter((t: any) => t.indikatorId === indicatorId);
    indicatorTargets.forEach((t: any) => {
      const year = tahunMap[t.tahunId];
      if (year && years.includes(year)) {
        viewData.value.targets[year] = t.target || '0';
      }
    });

  } catch (error) {
    console.error('Error fetching view data:', error);
  } finally {
    fetching.value = false;
  }
});
</script>

<style scoped>
/* No additional complex styles needed, using Tailwind-like classes from parent system */
</style>

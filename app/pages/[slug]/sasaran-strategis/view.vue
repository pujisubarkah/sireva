<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-10">
    <!-- Breadcrumb / Kembali -->
    <div class="flex items-center justify-between">
      <button 
        @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
        class="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#2663A3] transition-colors"
      >
        <div class="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
          <IconArrowLeft :size="16" />
        </div>
        Kembali ke Daftar
      </button>

      <div class="flex items-center gap-2">
        <button
          @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${indicatorId}`)"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-lg shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] transition-all"
        >
          <IconPencil :size="18" />
          Edit Data
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-8 py-8 border-b border-slate-100 bg-gradient-to-br from-blue-50/50 via-white to-white relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <IconFileDescription :size="120" stroke-width="1" class="text-[#2663A3]" />
        </div>
        
        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#2663A3] text-[10px] font-black uppercase tracking-widest mb-4">
            Rincian Indikator Kinerja
          </div>
          <h1 class="text-3xl font-black text-slate-800 leading-tight max-w-3xl">
            {{ viewData.namaIndikator || 'Memuat...' }}
          </h1>
          <div class="flex flex-wrap items-center gap-4 mt-6">
            <div class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              <IconBuilding :size="18" class="text-slate-400" />
              <span class="text-sm font-bold text-slate-600">{{ viewData.unitKerja || 'Semua Unit' }}</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              <IconChecklist :size="18" class="text-emerald-500" />
              <span class="text-sm font-bold text-slate-600">{{ viewData.satuan || '-' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="fetching" class="p-20 text-center">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin inline-block mb-4"></div>
        <p class="text-slate-500 font-medium">Menyusun dokumen detail...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <!-- Left Side: Metadata -->
        <div class="lg:col-span-2 p-8 space-y-10">
          <!-- Tujuan & Sasaran -->
          <div class="space-y-6">
            <div class="space-y-2">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <IconTarget :size="16" />
                Tujuan Strategis
              </h3>
              <p class="text-lg font-medium text-slate-600 leading-relaxed italic">
                "{{ viewData.tujuanText || '-' }}"
              </p>
            </div>

            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200 border-l-4 border-l-[#2663A3]">
              <h3 class="text-xs font-black text-[#2663A3] uppercase tracking-widest mb-3">Sasaran Strategis Terkait</h3>
              <p class="text-lg font-bold text-slate-800 leading-snug">
                {{ viewData.sasaranText || '-' }}
              </p>
            </div>
          </div>

          <!-- Description Placeholder -->
          <div class="space-y-4">
             <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Informasi Tambahan</h3>
             <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">ID Referensi</p>
                  <p class="text-sm font-mono font-bold text-slate-700">#IND-{{ indicatorId.toString().padStart(4, '0') }}</p>
                </div>
                <div class="p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Status Perencanaan</p>
                  <p class="text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Aktif (Renstra)
                  </p>
                </div>
             </div>
          </div>
        </div>

        <!-- Right Side: Target Board -->
        <div class="bg-slate-50/50 p-8 space-y-6">
          <h3 class="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <IconFlag :size="16" />
            Target Capaian Renstra
          </h3>

          <div class="space-y-3">
            <div v-for="year in years" :key="year" 
                 class="group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <p class="text-[10px] font-black text-slate-400 uppercase group-hover:text-[#2663A3]">Tahun {{ year }}</p>
                  <p class="text-2xl font-black text-slate-800">{{ viewData.targets[year] || '0' }}</p>
                </div>
                <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-[#2663A3] transition-colors">
                  <IconCalendar :size="20" />
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 mt-8">
            <p class="text-[10px] font-black uppercase opacity-60 mb-1">Target Akhir Renstra</p>
            <div class="flex items-end justify-between">
               <p class="text-3xl font-black">{{ viewData.targets[2029] || '-' }}</p>
               <IconChecklist :size="32" class="opacity-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen View Sasaran Strategis
 * Layout dokumen premium untuk melihat detail data secara elegan.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconPencil, IconBuilding, IconChecklist, 
  IconFileDescription, IconTarget, IconFlag, IconCalendar 
} from '@tabler/icons-vue';

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
  unitKerja: 'Pusbangkom ASN', // Dummy default for aesthetic
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
/* Transisi halus untuk hover cards */
.group:hover {
  transform: translateY(-2px);
}
</style>

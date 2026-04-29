<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
      <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <button @click="router.push(`/${$route.params.slug}/sasaran-program`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
          <IconArrowLeft :size="14" />
          Sasaran Program
        </button>
        <span>/</span>
        <span class="text-slate-600 tracking-normal capitalize font-black">Detail Program</span>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="router.push(`/${$route.params.slug}/sasaran-program/edit?id=${id}`)"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
        >
          <IconPencil :size="18" class="text-blue-600" />
          Edit Data
        </button>
        <button 
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all"
        >
          <IconFileExport :size="18" />
          Cetak PDF
        </button>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
      <!-- Loading State -->
      <div v-if="fetching" class="p-24 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold">Menyiapkan rincian program...</p>
      </div>

      <div v-else>
        <!-- Document Header Decor -->
        <div class="h-3 bg-gradient-to-r from-blue-600 via-[#2663A3] to-indigo-600"></div>

        <div class="p-10 md:p-16 space-y-12">
          <!-- Title Section -->
          <div class="text-center space-y-4 max-w-3xl mx-auto">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
              Dokumen Sasaran Program
            </div>
            <h1 class="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
              {{ viewData.sasaranProgram }}
            </h1>
            <div class="flex items-center justify-center gap-6 pt-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <IconLayout :size="18" />
                </div>
                <div class="text-left">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Satuan Ukur</p>
                  <p class="text-sm font-bold text-slate-700">{{ viewData.satuan }}</p>
                </div>
              </div>
              <div class="w-px h-8 bg-slate-100"></div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <IconBuilding :size="18" />
                </div>
                <div class="text-left">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Unit Pelaksana</p>
                  <p class="text-sm font-bold text-slate-700">{{ viewData.unitKerja }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Targets Visualization Section -->
          <div class="space-y-10">
            <!-- Targets Table/Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Renstra Column -->
              <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                    <IconFlag :size="20" />
                  </div>
                  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Target Tahunan Renstra</h3>
                </div>
                <div class="grid grid-cols-5 gap-3">
                  <div v-for="year in years" :key="`renstra-view-${year}`" class="space-y-1 text-center">
                    <p class="text-[9px] font-black text-slate-400 uppercase">{{ year }}</p>
                    <p class="text-base font-black text-emerald-700">{{ viewData.targetRenstra[year] || '0' }}</p>
                  </div>
                </div>
              </div>

              <!-- PK Column -->
              <div class="p-8 rounded-3xl bg-slate-50 border border-slate-100 space-y-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-[#2663A3] flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <IconTarget :size="20" />
                  </div>
                  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Target Perjanjian Kinerja</h3>
                </div>
                <div class="grid grid-cols-5 gap-3">
                  <div v-for="year in years" :key="`pk-view-${year}`" class="space-y-1 text-center">
                    <p class="text-[9px] font-black text-slate-400 uppercase">{{ year }}</p>
                    <p class="text-base font-black text-blue-700">{{ viewData.targetPerjanjian[year] || '0' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Context Box -->
            <div class="p-8 border border-slate-100 rounded-3xl space-y-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <IconInfoCircle :size="16" class="text-slate-300" />
                Catatan Strategis
              </h3>
              <p class="text-sm text-slate-600 leading-relaxed italic">
                Sasaran program ini merupakan bagian dari cascading kinerja organisasi yang berkontribusi langsung pada pencapaian Sasaran Strategis instansi. Seluruh target telah diselaraskan dengan ketersediaan sumber daya dan peta proses bisnis Level 2.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Notice -->
        <div class="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-between text-slate-400">
          <p class="text-[10px] font-bold uppercase tracking-widest italic">ID: SP-{{ id.toString().padStart(3, '0') }}</p>
          <p class="text-[10px] font-bold uppercase tracking-widest">SI-REVA Dashboard Perencanaan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen View Detail Sasaran Program
 * UI Premium dengan fokus pada visualisasi target multi-tahun.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconPencil, IconBuilding, IconFileExport, 
  IconLayout, IconFlag, IconTarget, IconInfoCircle 
} from '@tabler/icons-vue';

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
    
    // Simulasi pengambilan data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockData = [
      {
        id: 1,
        sasaranProgram: 'Program Pelatihan ASN',
        satuan: 'Orang',
        targetRenstra: { 2025: 800, 2026: 900, 2027: 1000, 2028: 1100, 2029: 1200 },
        targetPerjanjian: { 2025: 780, 2026: 880, 2027: 980, 2028: 1050, 2029: 1150 },
        unitKerja: 'Pusbangkom ASN',
      }
    ];

    const data = mockData.find(m => m.id === id) || mockData[0];
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
/* Transisi halus */
.group:hover {
  transform: scale(1.01);
}
</style>

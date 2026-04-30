<template>
  <div class="space-y-6 pb-20">
    <!-- Header Page -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-6 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <IconHierarchy2 class="text-blue-600" :size="24" />
            Cascading Kinerja (Pohon Kinerja)
          </h1>
          <p class="text-sm text-slate-500 font-medium mt-0.5">Visualisasi penyelarasan sasaran dari tingkat makro hingga mikro.</p>
        </div>
        <div class="flex items-center gap-3">
          <FilterDropdown v-model="selectedYear" :options="['2025', '2026', '2027', '2028', '2029']" :icon="IconCalendar" />
          <button class="px-5 py-2.5 bg-blue-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all flex items-center gap-2">
            <IconDownload :size="16" />
            Cetak Pohon
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-20 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Menyusun Hirarki...</p>
      </div>

      <!-- Tree Container -->
      <div v-else class="p-8 overflow-x-auto min-h-[600px] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
        <div class="flex flex-col items-center gap-12 min-w-max pb-10">
          
          <!-- LEVEL 1: SASARAN STRATEGIS -->
          <div class="flex flex-wrap justify-center gap-10 relative">
            <div 
              v-for="ss in strategisList" 
              :key="ss.id"
              class="relative flex flex-col items-center"
            >
              <!-- Card Strategis -->
              <div class="w-[340px] bg-blue-800 text-white rounded-2xl p-6 shadow-2xl shadow-blue-900/20 border border-blue-700 relative z-10 hover:scale-[1.02] transition-transform duration-300">
                <div class="flex items-center justify-between mb-4">
                  <span class="px-3 py-1 bg-yellow-400 text-blue-900 text-[10px] font-black rounded-lg uppercase tracking-tighter">Level 1: Strategis</span>
                  <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <IconStar :size="16" class="text-yellow-300" />
                  </div>
                </div>
                <h3 class="font-bold text-base leading-tight mb-4 min-h-[3rem]">{{ ss.sasaranText }}</h3>
                <div class="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div class="text-[10px] font-medium text-blue-100 flex items-center gap-1">
                    <IconBuilding :size="12" />
                    {{ ss.unitKerja || 'Kepala LAN RI' }}
                  </div>
                  <div class="px-2 py-1 bg-emerald-500/20 rounded-md text-[10px] font-black text-emerald-300 border border-emerald-500/30">
                    SAKIP: A
                  </div>
                </div>
              </div>

              <!-- Connector to Level 2 -->
              <div class="w-1 h-12 bg-blue-200" />

              <!-- LEVEL 2: SASARAN PROGRAM -->
              <div class="flex gap-8 relative">
                <div 
                  v-for="sp in getChildrenProgram(ss.id)" 
                  :key="sp.id"
                  class="flex flex-col items-center"
                >
                  <!-- Card Program -->
                  <div class="w-[300px] bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-xl shadow-indigo-100/50 hover:border-indigo-400 transition-all duration-300 relative z-10 group">
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">SP</div>
                      <span class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Level 2: Program</span>
                    </div>
                    <p class="text-sm font-bold text-slate-700 leading-snug mb-4 line-clamp-3 group-hover:text-indigo-700 transition-colors">
                      {{ sp.sasaranText }}
                    </p>
                    <div class="flex items-center gap-2 pt-3 border-t border-slate-100 text-[9px] font-black text-slate-400">
                      <IconUsers :size="12" />
                      {{ sp.unitKerja || 'Semua Unit' }}
                    </div>
                  </div>

                  <!-- Connector to Level 3 -->
                  <div class="w-0.5 h-10 bg-indigo-100" />

                  <!-- LEVEL 3: SASARAN KEGIATAN -->
                  <div class="flex flex-col gap-4">
                    <div 
                      v-for="sk in getChildrenKegiatan(sp.id)" 
                      :key="sk.id"
                      class="w-[280px] bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-default group/keg"
                    >
                      <div class="flex items-start gap-3">
                        <div class="mt-1 w-2 h-2 rounded-full bg-emerald-500" />
                        <div class="space-y-1">
                          <p class="text-[13px] font-bold text-slate-600 leading-tight group-hover/keg:text-emerald-700 transition-colors">
                            {{ sk.sasaranText }}
                          </p>
                          <div class="flex items-center gap-2 text-[10px] font-medium text-slate-400 group-hover/keg:text-emerald-500 transition-colors">
                            <IconWallet :size="10" />
                            Rp {{ Number(sk.anggaran || 0).toLocaleString('id-ID') }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Cascading Kinerja (Premium v2)
 * Menampilkan hirarki 4 level dengan visualisasi pohon.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { 
  IconHierarchy2, 
  IconCalendar, 
  IconDownload, 
  IconStar, 
  IconBuilding, 
  IconUsers,
  IconWallet,
  IconPlus
} from '@tabler/icons-vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import useSWRV from 'swrv';

const selectedYear = ref('2025');
const fetcher = (url: string) => fetch(url).then(r => r.json());

// Data Fetching
const { data: strategisList } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: programList } = useSWRV('/api/sasaran-program', fetcher);
const { data: kegiatanList } = useSWRV('/api/sasaran-kegiatan', fetcher);
const { data: renstraList } = useSWRV('/api/indikator-kinerja', fetcher); // To map SS to SP

const loading = computed(() => !strategisList.value || !programList.value);

/**
 * Get children programs for a strategic goal
 * Matches via Renstra (indikator_kinerja) mapping
 */
const getChildrenProgram = (strategisId: number) => {
  if (!renstraList.value || !programList.value) return [];
  
  // 1. Find program IDs linked to this strategic goal in Renstra
  const linkedProgramIds = (renstraList.value as any[])
    .filter(i => i.sasaranId === strategisId)
    .map(i => i.programId);
    
  // 2. Return unique programs from planning table
  return (programList.value as any[])
    .filter(p => linkedProgramIds.includes(p.programId));
};

/**
 * Get children activities for a program
 */
const getChildrenKegiatan = (programId: number) => {
  if (!kegiatanList.value) return [];
  return (kegiatanList.value as any[]).filter(k => k.sasaranProgramId === programId);
};
</script>

<style scoped>
/* Custom animations if needed */
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: slide-down 0.5s ease-out forwards;
}
</style>

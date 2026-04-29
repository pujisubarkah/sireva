<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
      <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <button @click="router.push(`/${$route.params.slug}/rencana-aksi`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
          <IconArrowLeft :size="14" />
          Rencana Aksi
        </button>
        <span>/</span>
        <span class="text-slate-600 tracking-normal capitalize font-black">Detail Rencana</span>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="router.push(`/${$route.params.slug}/rencana-aksi/edit?id=${id}`)"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
        >
          <IconPencil :size="18" class="text-blue-600" />
          Edit Rencana
        </button>
        <button 
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-black transition-all"
        >
          <IconHistory :size="18" />
          Log Aktivitas
        </button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
      <!-- Loading -->
      <div v-if="fetching" class="p-24 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold">Mengambil rincian aksi...</p>
      </div>

      <div v-else>
        <!-- Document Header Decor -->
        <div class="h-4 bg-gradient-to-r from-[#2663A3] to-blue-500"></div>

        <div class="p-10 md:p-16 space-y-16">
          <!-- Main Context Section -->
          <div class="space-y-8">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100">
              Rincian Rencana Aksi Operasional
            </div>
            
            <div class="space-y-4 max-w-4xl">
              <h1 class="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                {{ viewData.rencanaAksi }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 pt-2">
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100">
                  <IconBuilding :size="16" class="text-blue-600" />
                  <span class="text-xs font-bold text-blue-700 uppercase tracking-tighter">{{ viewData.unitKerja }}</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  <IconCalendar :size="16" class="text-slate-400" />
                  <span class="text-xs font-bold text-slate-600 uppercase tracking-tighter">Tahun Anggaran 2025</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Hierarchy & Metrics Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <!-- Strategic Path -->
            <div class="lg:col-span-2 space-y-8">
              <div class="space-y-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                    <IconTarget :size="18" />
                  </div>
                  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Alur Strategis</h3>
                </div>
                
                <div class="space-y-4">
                  <div class="p-6 rounded-3xl bg-slate-50 border border-slate-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-5">
                      <IconTarget :size="80" />
                    </div>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sasaran</p>
                    <p class="text-sm font-bold text-slate-700 leading-relaxed">{{ viewData.sasaran }}</p>
                  </div>
                  
                  <div class="flex justify-center -my-2 relative z-10">
                    <div class="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                      <IconArrowDown :size="14" />
                    </div>
                  </div>

                  <div class="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4 opacity-10 text-indigo-600">
                      <IconChartBar :size="80" />
                    </div>
                    <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Indikator Kinerja</p>
                    <p class="text-sm font-black text-indigo-900 leading-relaxed">{{ viewData.indikator }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Target Progress Visualization -->
            <div class="space-y-8">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                  <IconFlag :size="18" />
                </div>
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Target Capaian</h3>
              </div>

              <div class="bg-white border border-slate-100 rounded-3xl p-8 space-y-8 shadow-xl shadow-slate-100/50">
                <div class="text-center space-y-2">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Target Tahunan</p>
                  <p class="text-5xl font-black text-[#2663A3] tracking-tighter">{{ viewData.target }}</p>
                  <p class="text-xs font-bold text-slate-400 italic">Terdistribusi ke 4 Triwulan</p>
                </div>

                <div class="space-y-4">
                  <div v-for="tw in [1, 2, 3, 4]" :key="tw" class="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:scale-[1.02] transition-transform">
                    <span class="text-xs font-black text-slate-400 uppercase">Triwulan {{ tw }}</span>
                    <span class="text-base font-black text-slate-700">{{ viewData[`tw${tw}`] || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-between text-slate-400">
          <div class="flex items-center gap-4">
            <p class="text-[10px] font-bold uppercase tracking-widest">ID: RA-{{ id.toString().padStart(3, '0') }}</p>
            <div class="w-1 h-1 rounded-full bg-slate-300"></div>
            <p class="text-[10px] font-bold uppercase tracking-widest italic">Terakhir diupdate: 2 jam yang lalu</p>
          </div>
          <p class="text-[10px] font-black uppercase tracking-widest">SI-REVA Planning Engine</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen View Detail Rencana Aksi
 * Visualisasi hierarki dari Sasaran -> Indikator -> Aksi
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconPencil, IconHistory, IconBuilding, IconCalendar, 
  IconTarget, IconChartBar, IconFlag, IconArrowDown 
} from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();

// State
const id = Number(route.query.id);
const fetching = ref(true);
const viewData = ref<any>({
  sasaran: '',
  indikator: '',
  rencanaAksi: '',
  target: 0,
  tw1: 0,
  tw2: 0,
  tw3: 0,
  tw4: 0,
  unitKerja: '',
});

onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/rencana-aksi`);
    return;
  }

  try {
    fetching.value = true;
    
    // Simulasi pengambilan data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    viewData.value = {
      id: id,
      sasaran: 'Terwujudnya ASN Berakhlak dan Berdaya Saing Global',
      indikator: 'Persentase ASN yang lulus sertifikasi kompetensi global',
      rencanaAksi: 'Melakukan pemetaan kompetensi ASN di seluruh instansi pusat dan daerah serta menyusun roadmap pengembangan karir berbasis digital.',
      target: 85,
      tw1: 20,
      tw2: 40,
      tw3: 60,
      tw4: 85,
      unitKerja: 'Pusbangkom ASN',
    };

  } catch (error) {
    console.error('Error fetching view data:', error);
  } finally {
    fetching.value = false;
  }
});
</script>

<style scoped>
/* Custom curve for a more fluid feel */
.bg-white {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

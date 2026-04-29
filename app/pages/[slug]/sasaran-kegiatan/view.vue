<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Actions -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
      <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <button @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
          <IconArrowLeft :size="14" />
          Sasaran Kegiatan
        </button>
        <span>/</span>
        <span class="text-slate-600 tracking-normal capitalize font-black">Detail Kegiatan</span>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${id}`)"
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
        <p class="text-slate-500 font-bold">Menyiapkan rincian kegiatan...</p>
      </div>

      <div v-else>
        <!-- Document Header Decor -->
        <div class="h-3 bg-gradient-to-r from-blue-600 via-[#2663A3] to-indigo-600"></div>

        <div class="p-10 md:p-16 space-y-12">
          <!-- Title Section -->
          <div class="text-center space-y-4 max-w-3xl mx-auto">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
              Dokumen Sasaran Kegiatan
            </div>
            <h1 class="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
              {{ viewData.namaKegiatan }}
            </h1>
            <div class="flex items-center justify-center gap-6 pt-2">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                  <IconCalendar :size="18" />
                </div>
                <div class="text-left">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Tahun Anggaran</p>
                  <p class="text-sm font-bold text-slate-700">2025</p>
                </div>
              </div>
              <div class="w-px h-8 bg-slate-100"></div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <IconCoin :size="18" />
                </div>
                <div class="text-left">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID Dokumen</p>
                  <p class="text-sm font-bold text-slate-700">SK-{{ id.toString().padStart(3, '0') }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            <!-- Left Column: Context -->
            <div class="md:col-span-2 space-y-8">
              <!-- Program Box -->
              <div class="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-500">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <IconSitemap :size="20" />
                  </div>
                  <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest">Program Strategis Terkait</h3>
                </div>
                <p class="text-xl font-bold text-slate-800 leading-relaxed group-hover:text-blue-700 transition-colors">
                  {{ viewData.program }}
                </p>
              </div>

              <!-- Deskripsi Tambahan (Placeholder if any) -->
              <div class="p-8 border border-slate-100 rounded-3xl space-y-4">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <IconFileDescription :size="16" class="text-slate-300" />
                  Konteks Operasional
                </h3>
                <p class="text-sm text-slate-600 leading-relaxed">
                  Kegiatan ini dirancang untuk mendukung pencapaian indikator kinerja utama pada level program, dengan fokus pada efisiensi operasional dan kualitas output yang terukur.
                </p>
              </div>
            </div>

            <!-- Right Column: Stats & Meta -->
            <div class="space-y-6">
              <!-- Anggaran Card -->
              <div class="p-8 rounded-3xl bg-[#2663A3] text-white shadow-2xl shadow-blue-700/30 relative overflow-hidden group">
                <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <IconCoin :size="120" />
                </div>
                <h3 class="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4">Total Anggaran</h3>
                <p class="text-3xl font-black tracking-tight">
                  {{ formatCurrency(viewData.total) }}
                </p>
                <div class="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span class="text-[10px] font-bold text-blue-100 uppercase tracking-tighter">Status: Alokasi Tersedia</span>
                </div>
              </div>

              <!-- Metadata Box -->
              <div class="p-6 rounded-3xl border border-slate-100 space-y-4">
                <div class="space-y-1">
                  <p class="text-[10px] font-black text-slate-400 uppercase">Unit Pelaksana</p>
                  <p class="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <IconBuilding :size="14" class="text-blue-600" />
                    Pusbangkom ASN
                  </p>
                </div>
                <div class="space-y-1">
                  <p class="text-[10px] font-black text-slate-400 uppercase">Terakhir Diperbarui</p>
                  <p class="text-sm font-bold text-slate-700">29 April 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Notice -->
        <div class="bg-slate-50 px-10 py-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
          <IconInfoCircle :size="16" />
          <p class="text-[10px] font-bold uppercase tracking-widest">Dokumen ini merupakan bagian dari sistem perencanaan SI-REVA</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen View Detail Sasaran Kegiatan
 * UI Premium dengan fokus pada penyajian data sebagai dokumen resmi.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconPencil, IconSitemap, IconFileExport, 
  IconCalendar, IconCoin, IconBuilding, IconFileDescription, IconInfoCircle 
} from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();

// State
const id = Number(route.query.id);
const fetching = ref(true);
const viewData = ref({
  program: '',
  namaKegiatan: '',
  total: 0
});

function formatCurrency(value: any): string {
  if (!value) return 'Rp 0'
  const num = parseFloat(value)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

// Fetch data on mount
onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/sasaran-kegiatan`);
    return;
  }

  try {
    fetching.value = true;
    
    const [kegRes, progRes] = await Promise.all([
      $fetch<any[]>('/api/master-kegiatan'),
      $fetch<any[]>('/api/master-program')
    ]);

    const activity = kegRes.find((k: any) => k.id === id);
    if (activity) {
      const program = progRes.find((p: any) => p.id === activity.programId);
      viewData.value = {
        program: program?.namaProgram || '-',
        namaKegiatan: activity.namaKegiatan,
        total: activity.total
      };
    } else {
      throw new Error('Data tidak ditemukan');
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

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Detail Sasaran Kegiatan</h1>
          <p class="text-sm text-slate-500 mt-0.5">Rincian kegiatan operasional dan alokasi anggaran.</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${id}`)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm transition-colors cursor-pointer"
          >
            <IconPencil :size="16" />
            Edit
          </button>
          <button
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
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
        <p>Memuat rincian kegiatan...</p>
      </div>

      <!-- Detail Content -->
      <div v-else class="p-6 space-y-8">
        <!-- Section: Informasi Utama -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-700 rounded-full"></span>
            Informasi Sasaran Kegiatan
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Program -->
            <div class="md:col-span-2 space-y-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Program Terkait</span>
              <p class="text-base text-slate-800 font-bold flex items-center gap-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <IconSitemap :size="20" class="text-blue-600" />
                {{ viewData.program || '-' }}
              </p>
            </div>

            <!-- Kegiatan -->
            <div class="md:col-span-2 space-y-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Nama Sasaran Kegiatan</span>
              <p class="text-sm text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed italic">
                {{ viewData.namaKegiatan || '-' }}
              </p>
            </div>

            <!-- Anggaran -->
            <div class="space-y-2">
              <span class="text-xs font-semibold text-slate-400 uppercase tracking-tight">Alokasi Anggaran</span>
              <div class="flex items-center gap-3">
                <p class="text-2xl text-emerald-700 font-black px-5 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  {{ formatCurrency(viewData.total) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section: Footer Metadata -->
        <div class="pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400 font-medium">
          <p>ID Sasaran Kegiatan: {{ id }}</p>
          <button 
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
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
 * Komponen View Detail Sasaran Kegiatan
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconX, IconPencil, IconSitemap } from '@tabler/icons-vue';

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
    
    // Fetch resources
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
/* Scoped styles */
</style>

<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center justify-between gap-4 px-2">
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
          v-if="canInput"
          @click="router.push(`/${$route.params.slug}/sasaran-program/edit?id=${id}`)"
          class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
        >
          <IconPencil :size="18" class="text-blue-600" />
          Edit Data
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-5xl mx-auto space-y-6">
      <div v-if="fetching" class="bg-white rounded-3xl border border-slate-200 p-24 text-center shadow-sm">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold tracking-widest text-xs uppercase">Menyiapkan Rincian...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Section 01: Informasi Utama -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#2663A3]">
              <IconTarget :size="18" stroke-width="2.5" />
            </div>
            <h2 class="text-sm font-black text-[#2663A3] uppercase tracking-wider">Perencanaan - Sasaran Program</h2>
          </div>
          
          <div class="p-8 space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="md:col-span-2 space-y-1">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran Program</p>
                <p class="text-lg font-black text-slate-800 leading-tight uppercase tracking-tight">{{ detail?.sasaranText }}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Sasaran</p>
                <span class="inline-block px-3 py-1 bg-blue-50 text-[#2663A3] text-sm font-black rounded-lg border border-blue-100 uppercase">
                  {{ detail?.kode || '-' }}
                </span>
              </div>
            </div>

            <div class="space-y-3">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Kerja Pelaksana</p>
              <div class="flex flex-wrap gap-2">
                <div v-for="unit in (detail?.unitKerjaNames || [])" :key="unit" class="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span class="text-xs font-bold text-slate-700">{{ unit }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 02: Indikator Kinerja & Target multi-tahun -->
        <div class="space-y-4">
          <div class="flex items-center gap-2 px-2">
            <IconListDetails :size="20" class="text-indigo-600" />
            <h3 class="text-sm font-black text-slate-700 uppercase tracking-widest">Daftar Indikator & Target Tahunan</h3>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div 
              v-for="ind in groupedIndikators" 
              :key="ind.id"
              class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:border-indigo-200 transition-all group"
            >
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex-1 space-y-2">
                  <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Indikator Program</p>
                  <p class="text-base font-black text-slate-800 leading-snug uppercase tracking-tight">{{ ind.nama }}</p>
                  <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Satuan: <span class="text-slate-600">{{ ind.satuan }}</span></p>
                </div>

                <div class="grid grid-cols-5 gap-2 min-w-[350px]">
                  <div v-for="t in ind.targets" :key="t.tahun" class="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center group-hover:bg-indigo-50/50 group-hover:border-indigo-100 transition-colors">
                    <p class="text-[9px] font-black text-slate-400 uppercase mb-1">{{ t.tahun }}</p>
                    <p class="text-sm font-black text-[#2663A3]">{{ t.target || '0' }}</p>
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
 * Komponen View Sasaran Program Standardized (Read Only)
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  IconArrowLeft, IconTarget, IconListDetails, IconPencil 
} from '@tabler/icons-vue';
import { useAuthUser } from '~/composables/useAuthUser';

const router = useRouter();
const route = useRoute();
const { role } = useAuthUser();

const id = Number(route.query.id);
const fetching = ref(true);
const detail = ref<any>(null);
const rawDetailRows = ref<any[]>([]);

const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'));
const canInput = computed(() => {
  return ['super_admin', 'admin'].includes(normalizedRole.value);
});

const groupedIndikators = computed(() => {
  const map = new Map<number, any>();
  const targetYears = [2025, 2026, 2027, 2028, 2029];

  for (const row of rawDetailRows.value) {
    if (!row.indikatorId) continue;
    if (!map.has(row.indikatorId)) {
      const normalizedTargets = targetYears.map((tahun) => {
        const found = (row.targets || []).find((t: any) => Number(t.tahun) === tahun);
        return { tahun, target: found?.target || '0' };
      });

      map.set(row.indikatorId, {
        id: row.indikatorId,
        nama: row.indikatorNama,
        satuan: row.indikatorSatuan,
        targets: normalizedTargets
      });
    }
  }
  return Array.from(map.values());
});

onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/sasaran-program`);
    return;
  }

  try {
    fetching.value = true;
    const res = await $fetch<any[]>(`/api/sasaran-program/${id}`);
    rawDetailRows.value = res || [];
    detail.value = (res || [])[0];
    
    if (!detail.value) {
      alert('Data tidak ditemukan');
      router.push(`/${route.params.slug}/sasaran-program`);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    fetching.value = false;
  }
});
</script>

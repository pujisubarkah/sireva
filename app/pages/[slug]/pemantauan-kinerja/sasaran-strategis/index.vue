<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50">
        <h1 class="text-lg font-semibold text-slate-800">Pemantauan Kinerja - Sasaran Strategis</h1>
        <p class="text-sm text-slate-500 mt-1">Pantau target dan realisasi dari indikator sasaran strategis.</p>
      </div>

      <!-- Konten Tabel -->
      <div v-if="loading" class="p-6 text-sm text-slate-500 text-center">
        <div class="inline-block animate-pulse">Memuat data...</div>
      </div>
      <div v-else-if="!tableRows.length" class="p-6 text-sm text-slate-500 text-center italic">Data belum tersedia.</div>
      
      <div v-else class="overflow-x-auto">
        <div style="min-width: 1000px;" class="p-5">
          <Table :columns="columns" :data="tableRows" :showPagination="false" rowKey="id">
            <template #cell-capaian="{ row }">
              <span :class="{'text-emerald-600 font-bold': parseFloat(row.capaian) >= 100, 'text-amber-600 font-bold': parseFloat(row.capaian) >= 50 && parseFloat(row.capaian) < 100, 'text-red-600 font-bold': parseFloat(row.capaian) < 50}">
                {{ row.capaian }}%
              </span>
            </template>
            <template #cell-aksi="{ row }">
              <div class="flex items-center justify-center gap-2">
                <button 
                  type="button"
                  @click="openModal(row)"
                  title="Input Realisasi" 
                  class="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <IconPencil :size="14" />
                  Input Realisasi
                </button>
              </div>
            </template>
          </Table>
        </div>
      </div>
    </div>

    <!-- Modal Input Realisasi -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 class="text-lg font-bold text-slate-800">Input Realisasi</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200 transition-colors">
            <IconX :size="20" />
          </button>
        </div>
        
        <form @submit.prevent="submitRealisasi" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Indikator Kinerja</label>
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium">
              {{ selectedRow?.indikatorKinerja }}
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Target Tahun Ini</label>
              <div class="p-2.5 bg-blue-50 text-blue-800 border border-blue-100 rounded-lg font-bold text-center">
                {{ selectedRow?.target }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
              <input type="number" v-model="form.tahun" class="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" readonly />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nilai Realisasi <span class="text-red-500">*</span></label>
            <input 
              type="number" 
              step="0.01"
              v-model="form.realisasi" 
              class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold" 
              placeholder="Masukkan angka realisasi..." 
              required 
            />
          </div>

          <div class="pt-4 flex gap-3">
            <button type="button" @click="closeModal" class="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" :disabled="submitting" class="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useSWRV from 'swrv';
import { IconPencil, IconX } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';

const router = useRouter();
const fetcher = (url: string) => fetch(url).then(r => r.json());

const currentYear = new Date().getFullYear();

const { data: sasaranRes, isValidating: sasLoading } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: indikatorRes, isValidating: indikLoading } = useSWRV('/api/indikator-kinerja', fetcher);
const { data: targetRes, isValidating: targetLoading } = useSWRV('/api/target-indikator', fetcher);
const { data: tahunRes, isValidating: tahunLoading } = useSWRV('/api/tahun', fetcher);
const { data: realisasiRes, isValidating: realisasiLoading, mutate: mutateRealisasi } = useSWRV('/api/realisasi-indikator', fetcher);

const loading = computed(() => sasLoading.value || indikLoading.value || targetLoading.value || tahunLoading.value || realisasiLoading.value);

const columns = [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaranStrategis', label: 'Sasaran Strategis' },
  { key: 'indikatorKinerja', label: 'Indikator Kinerja' },
  { key: 'target', label: `Target (${currentYear})`, className: 'text-center' },
  { key: 'realisasi', label: `Realisasi (${currentYear})`, className: 'text-center' },
  { key: 'capaian', label: 'Capaian', className: 'text-center w-24' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-32' },
];

const tableRows = computed(() => {
  if (loading.value || !sasaranRes.value || !indikatorRes.value || !targetRes.value || !tahunRes.value || !realisasiRes.value) return [];

  // Cari ID tahun untuk tahun berjalan
  const currentTahunObj = tahunRes.value.find((t: any) => t.tahun === currentYear);
  const currentTahunId = currentTahunObj ? currentTahunObj.id : null;

  const sasaranMap = sasaranRes.value.reduce((acc: any, s: any) => {
    acc[s.id] = s.sasaranText;
    return acc;
  }, {});

  const targetMap = targetRes.value.reduce((acc: any, t: any) => {
    if (t.tahunId === currentTahunId) {
      acc[t.indikatorId] = t.target;
    }
    return acc;
  }, {});

  const realisasiMap = realisasiRes.value.reduce((acc: any, r: any) => {
    if (r.tahun === currentYear && r.indikatorKode) {
      acc[r.indikatorKode] = parseFloat(r.realisasi) || 0;
    }
    return acc;
  }, {});

  return indikatorRes.value.map((indikator: any, index: number) => {
    const target = parseFloat(targetMap[indikator.id]) || 0;
    const realisasi = realisasiMap[indikator.kode] || 0;
    
    let capaian = 0;
    if (target > 0) {
      capaian = (realisasi / target) * 100;
    }

    return {
      id: indikator.id,
      no: index + 1,
      indikatorKode: indikator.kode,
      sasaranStrategis: sasaranMap[indikator.sasaranId] || '-',
      indikatorKinerja: indikator.namaIndikator,
      target: targetMap[indikator.id] || '-',
      targetVal: target,
      realisasi: realisasi || '-',
      capaian: capaian.toFixed(1),
    };
  });
});

// Modal Logic
const isModalOpen = ref(false);
const submitting = ref(false);
const selectedRow = ref<any>(null);

const form = ref({
  tahun: currentYear,
  realisasi: null as number | null,
});

function openModal(row: any) {
  selectedRow.value = row;
  form.value.realisasi = row.realisasi !== '-' ? parseFloat(row.realisasi) : null;
  form.value.tahun = currentYear;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedRow.value = null;
  form.value.realisasi = null;
}

async function submitRealisasi() {
  if (!selectedRow.value || form.value.realisasi === null) return;
  submitting.value = true;
  
  try {
    // Kita cek dulu apakah sudah ada realisasi untuk indikator ini dan tahun ini
    const existing = realisasiRes.value?.find((r: any) => r.indikatorKode === selectedRow.value.indikatorKode && r.tahun === currentYear);
    
    const payload = {
      indikatorKode: selectedRow.value.indikatorKode,
      tahun: currentYear,
      target: selectedRow.value.targetVal,
      realisasi: form.value.realisasi,
      ...(existing ? { id: existing.id } : {})
    };

    const method = existing ? 'PUT' : 'POST';

    await $fetch('/api/realisasi-indikator', {
      method,
      body: payload
    });

    mutateRealisasi();
    closeModal();
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menyimpan realisasi.');
  } finally {
    submitting.value = false;
  }
}
</script>

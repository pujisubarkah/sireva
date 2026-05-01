<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/sasaran-program`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Sasaran Program
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Tambah Baru</span>
    </div>

    <!-- Premium Form Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-gradient-to-r from-[#2663A3] to-[#1e4e82] relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <IconPlus :size="120" class="text-white" />
        </div>
        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <IconPlus :size="32" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">Buat Sasaran Program Baru</h1>
            <p class="text-blue-100 mt-1 text-sm font-medium">Hubungkan program dengan sasaran strategis dan tetapkan target indikator.</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-12">
        
        <!-- Section 01: Hirarki & Sasaran -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Hirarki & Sasaran</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Induk Sasaran Strategis -->
            <div class="md:col-span-2 space-y-2">
              <label for="sasaranStrategisId" class="block text-sm font-bold text-slate-700 ml-1">Induk Sasaran Strategis</label>
              <select 
                id="sasaranStrategisId" 
                v-model="form.sasaranStrategisId" 
                class="field-input"
                required
                @change="handleSSChange"
              >
                <option :value="null" disabled>-- Pilih Sasaran Strategis --</option>
                <option v-for="s in uniqueSasaranStrategisList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
              </select>
            </div>


            <!-- Program Kerja (Auto or Manual Fallback) -->
            <div v-if="form.sasaranStrategisId" class="space-y-2 md:col-span-2 p-4 bg-blue-50/50 rounded-xl border border-blue-100 border-dashed animate-in fade-in slide-in-from-top-2 duration-500">
              <label class="block text-[11px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                <IconInfoCircle :size="14" />
                {{ filteredProgramList.length > 0 ? 'Program Kerja (Terdeteksi Otomatis)' : 'Pilih Program Kerja (Manual)' }}
              </label>
              
              <div v-if="filteredProgramList.length > 0" class="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-200">
                <div class="p-2 bg-blue-100 rounded-lg text-[#2663A3]">
                  <IconBriefcase :size="20" />
                </div>
                <div>
                  <p class="text-xs font-black text-slate-400 uppercase tracking-tighter">Program Terpilih:</p>
                  <p class="text-sm font-bold text-slate-800">{{ filteredProgramList[0].namaProgram }}</p>
                </div>
              </div>
              
              <select 
                v-else 
                v-model="manualProgramId" 
                class="field-input !bg-white"
                required
              >
                <option :value="null" disabled>-- Tidak ada program otomatis, silakan pilih manual --</option>
                <option v-for="p in allPrograms" :key="p.id" :value="p.id">{{ p.namaProgram }}</option>
              </select>
              
              <p v-if="filteredProgramList.length === 0" class="text-[10px] text-amber-600 font-bold mt-2 italic">
                * Sasaran Strategis ini belum terhubung ke Program manapun. Silakan pilih program kerja yang sesuai secara manual.
              </p>
            </div>

            <!-- Sinkronisasi Indikator Strategis -->
            <div v-if="form.sasaranStrategisId" class="md:col-span-2 p-5 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-blue-600 rounded-lg shadow-md shadow-blue-200">
                  <IconTarget :size="16" class="text-white" />
                </div>
                <div>
                  <label for="existingIndikator" class="block text-[11px] font-black text-[#2663A3] uppercase tracking-widest">Sinkronkan Indikator (Opsional)</label>
                  <p class="text-[10px] text-slate-500 font-medium">Pilih indikator strategis untuk mengisi data otomatis.</p>
                </div>
              </div>
              
              <select 
                id="existingIndikator" 
                v-model="selectedIndikatorId" 
                class="field-input !bg-white !border-blue-200 focus:!border-blue-500 focus:!ring-blue-100"
                @change="autoFillFromIndikator"
              >
                <option :value="null">-- Input Manual (Tanpa Sinkronisasi) --</option>
                <option v-for="i in filteredIndikatorList" :key="i.id" :value="i.id">{{ i.namaIndikator }}</option>
              </select>
            </div>

            <!-- Nama Sasaran Program -->
            <div class="md:col-span-2 space-y-2">
              <label for="sasaranProgram" class="block text-sm font-bold text-slate-700 ml-1">Nama Sasaran Program (Outcome Antara)</label>
              <textarea 
                id="sasaranProgram" 
                v-model="form.sasaranProgram" 
                rows="3"
                class="field-input resize-none"
                placeholder="Masukkan deskripsi sasaran program..."
                required
              ></textarea>
            </div>

            <!-- Indikator Program -->
            <div class="md:col-span-2 space-y-2">
              <label for="namaIndikator" class="block text-sm font-bold text-slate-700 ml-1">Indikator Kinerja Program</label>
              <input 
                id="namaIndikator" 
                v-model="form.namaIndikator" 
                type="text" 
                class="field-input" 
                placeholder="Masukkan nama indikator..." 
                required
              />
            </div>

            <!-- Satuan -->
            <div class="space-y-2">
              <label for="satuan" class="block text-sm font-bold text-slate-700 ml-1">Satuan</label>
              <input 
                id="satuan" 
                v-model="form.satuan" 
                type="text" 
                class="field-input" 
                placeholder="Misal: Orang, Persentase, Skor..." 
                required
              />
            </div>

            <!-- Unit Kerja -->
            <div class="space-y-2">
              <label for="unitKerja" class="block text-sm font-bold text-slate-700 ml-1">Unit Kerja Pelaksana</label>
              <select 
                id="unitKerja" 
                v-model="form.unitKerja" 
                class="field-input"
                required
              >
                <option value="" disabled selected>Pilih Unit Kerja...</option>
                <option v-for="unit in units" :key="unit.id" :value="unit.nama">
                  {{ unit.nama }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-8 mt-4 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/sasaran-program`)"
            class="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <IconCheck v-if="!submitting" :size="20" :stroke-width="3" />
            <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Simpan Data Program
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Sasaran Program
 * Menambahkan fitur auto-fill target dari indikator strategis.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconArrowLeft, IconPlus, IconCheck, IconTarget, IconInfoCircle, IconBriefcase } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const years = [2025, 2026, 2027, 2028, 2029];

const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: units } = useSWRV('/api/unit-kerja', fetcher);
const { data: sasaranStrategisList } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: allProgramsRaw } = useSWRV('/api/program', fetcher);
const { data: allIndikators } = useSWRV('/api/indikator-kinerja', fetcher);

// Filter program berdasarkan SS yang dipilih
const filteredProgramList = computed(() => {
  if (!form.value.sasaranStrategisId || !allPrograms.value) return [];
  return (allPrograms.value as any[]).filter(p => p.sasaranId === form.value.sasaranStrategisId);
});

// Deduplicated Sasaran List
const uniqueSasaranStrategisList = computed(() => {
  if (!sasaranStrategisList.value) return [];
  const map = new Map();
  (sasaranStrategisList.value as any[]).forEach(s => {
    if (!map.has(s.sasaranText)) {
      map.set(s.sasaranText, s);
    }
  });
  return Array.from(map.values());
});

// State Form
const submitting = ref(false);
const selectedIndikatorId = ref<number | null>(null);
const loadingTargets = ref(false);
const isAutoFilled = ref(false);
const manualProgramId = ref<number | null>(null);
const allPrograms = ref<any[]>([]);

const form = ref({
  sasaranStrategisId: null as number | null,
  programId: null as number | null,
  sasaranProgram: '',
  namaIndikator: '',
  satuan: '',
  unitKerja: '',
});

// Filter indikator berdasarkan SS yang dipilih
const filteredIndikatorList = computed(() => {
  if (!form.value.sasaranStrategisId || !allIndikators.value) return [];
  return (allIndikators.value as any[]).filter(i => i.sasaranId === form.value.sasaranStrategisId);
});

// Fetch all programs for fallback
onMounted(async () => {
  try {
    const res = await $fetch<any[]>('/api/program');
    allPrograms.value = res;
  } catch (err) {
    console.error('Failed to fetch programs:', err);
  }
});

/**
 * Reset selection when SS changes
 */
const handleSSChange = () => {
  form.value.programId = null;
  manualProgramId.value = null;
  selectedIndikatorId.value = null;
  isAutoFilled.value = false;
};

/**
 * Auto-fill form from selected existing indicator
 */
const autoFillFromIndikator = async () => {
  if (!selectedIndikatorId.value || !allIndikators.value) {
    isAutoFilled.value = false;
    return;
  }

  const indicator = (allIndikators.value as any[]).find(i => i.id === selectedIndikatorId.value);
  if (!indicator) return;

  // Fill Basic Info
  form.value.namaIndikator = indicator.namaIndikator;
  form.value.satuan = indicator.satuan || '';
  form.value.unitKerja = indicator.unitKerja || form.value.unitKerja;

  // Fetch Targets
  loadingTargets.value = true;
  try {
    const targets = await $fetch<any[]>('/api/target-indikator');
    const filteredTargets = targets.filter(t => t.indikatorId === indicator.id);
    
    isAutoFilled.value = true;
    setTimeout(() => { isAutoFilled.value = false }, 3000); // Visual feedback duration

  } catch (error) {
    console.error('Failed to fetch targets:', error);
  } finally {
    loadingTargets.value = false;
  }
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  let targetProgramId = null;

  if (filteredProgramList.value.length > 0) {
    targetProgramId = filteredProgramList.value[0].id;
  } else if (manualProgramId.value) {
    targetProgramId = manualProgramId.value;
  }

  if (!targetProgramId) {
    alert('Silakan pilih Program Kerja terlebih dahulu (Gunakan pilihan manual jika tidak muncul otomatis).');
    return;
  }

  submitting.value = true;
  try {
    const result = await $fetch<any>('/api/sasaran-program', {
      method: 'POST',
      body: {
        programId: targetProgramId,
        sasaranText: form.value.sasaranProgram,
        unitKerja: form.value.unitKerja,
        kode: 'SP-' + Math.floor(Math.random() * 1000)
      }
    });

    if (result) {
      router.push(`/${route.params.slug}/sasaran-program`);
    }
  } catch (error: any) {
    console.error('Error saving data:', error);
    const msg = error.data?.message || error.data?.statusMessage || 'Terjadi kesalahan pada server.';
    alert('Gagal menyimpan data: ' + msg);
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background-color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.field-input:focus {
  outline: none;
  border-color: #2663A3;
  box-shadow: 0 0 0 4px rgba(38, 99, 163, 0.1);
}

.field-input::placeholder {
  color: rgb(203 213 225);
}
</style>

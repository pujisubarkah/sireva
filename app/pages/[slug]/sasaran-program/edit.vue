<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/sasaran-program`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Sasaran Program
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Edit Program</span>
    </div>

    <!-- Premium Form Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-gradient-to-r from-blue-700 to-indigo-800 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <IconPencil :size="120" class="text-white" />
        </div>
        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <IconPencil :size="32" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">Perbarui Sasaran Program</h1>
            <p class="text-blue-100 mt-1 text-sm font-medium">Lakukan perubahan pada data sasaran program dan target tahunan.</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="fetching" class="p-20 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold">Memuat data program...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-8 space-y-12">
        
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
              >
                <option :value="null" disabled>-- Pilih Sasaran Strategis --</option>
                <option v-for="s in sasaranStrategisList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
              </select>
            </div>

            <!-- Nama Sasaran Program -->
            <div class="md:col-span-2 space-y-2">
              <label for="sasaranProgram" class="block text-sm font-bold text-slate-700 ml-1">Nama Sasaran Program</label>
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

        <div class="h-px bg-slate-100"></div>

        <!-- Section 02: Target Kinerja -->
        <div class="space-y-8">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-600/20">
              02
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Target Tahunan</h2>
          </div>

          <!-- Target Renstra Grid -->
          <div class="space-y-4">
            <h3 class="text-xs font-bold text-emerald-700 flex items-center gap-2 ml-1">
              <IconFlag :size="16" />
              Target Kinerja Renstra
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div v-for="year in years" :key="`renstra-${year}`" class="relative group">
                <div class="absolute -top-2 left-3 px-2 bg-white text-[9px] font-black text-slate-400 group-focus-within:text-emerald-600 transition-colors z-10">
                  {{ year }}
                </div>
                <input 
                  v-model="form.targetRenstra[year]" 
                  type="text" 
                  class="field-input !pt-4 text-center font-bold text-emerald-700" 
                  placeholder="0" 
                />
              </div>
            </div>
          </div>

          <!-- Target PK Grid -->
          <div class="space-y-4">
            <h3 class="text-xs font-bold text-amber-700 flex items-center gap-2 ml-1">
              <IconTarget :size="16" />
              Target Perjanjian Kinerja (PK)
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div v-for="year in years" :key="`pk-${year}`" class="relative group">
                <div class="absolute -top-2 left-3 px-2 bg-white text-[9px] font-black text-slate-400 group-focus-within:text-amber-600 transition-colors z-10">
                  {{ year }}
                </div>
                <input 
                  v-model="form.targetPerjanjian[year]" 
                  type="text" 
                  class="field-input !pt-4 text-center font-bold text-amber-700" 
                  placeholder="0" 
                />
              </div>
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
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <IconCheck v-if="!submitting" :size="20" :stroke-width="3" />
            <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Edit Sasaran Program
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconArrowLeft, IconPencil, IconCheck, IconFlag, IconTarget } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const years = [2025, 2026, 2027, 2028, 2029];

const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: units } = useSWRV('/api/unit-kerja', fetcher);
const { data: sasaranStrategisList } = useSWRV('/api/sasaran-strategis', fetcher);

// State
const id = Number(route.query.id);
const fetching = ref(true);
const submitting = ref(false);

const form = ref({
  id: id,
  sasaranStrategisId: null as number | null,
  sasaranProgram: '',
  namaIndikator: '',
  satuan: '',
  unitKerja: '',
  targetRenstra: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>),
  targetPerjanjian: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

// Load data on mount
onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/sasaran-program`);
    return;
  }

  try {
    fetching.value = true;
    
    // Fetch real data
    const res = await $fetch<any>(`/api/sasaran-program?id=${id}`);
    const data = Array.isArray(res) ? res[0] : res;
    
    if (data) {
      form.value = {
        id: data.id,
        sasaranStrategisId: data.sasaranStrategisId,
        sasaranProgram: data.sasaranText,
        namaIndikator: data.namaIndikator || '',
        satuan: data.satuan || '',
        unitKerja: data.unitKerja || '',
        targetRenstra: {
          2025: data.target2025 || '0',
          2026: data.target2026 || '0',
          2027: data.target2027 || '0',
          2028: data.target2028 || '0',
          2029: data.target2029 || '0'
        },
        targetPerjanjian: years.reduce((acc, y) => ({ ...acc, [y]: '0' }), {}) // PK target logic might be different later
      } as any;
    }

  } catch (error) {
    console.error('Gagal mengambil data:', error);
  } finally {
    fetching.value = false;
  }
});

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  try {
    const payload = {
      id: form.value.id,
      sasaranStrategisId: form.value.sasaranStrategisId,
      sasaranText: form.value.sasaranProgram,
      namaIndikator: form.value.namaIndikator,
      satuan: form.value.satuan,
      unitKerja: form.value.unitKerja,
      target2025: form.value.targetRenstra[2025],
      target2026: form.value.targetRenstra[2026],
      target2027: form.value.targetRenstra[2027],
      target2028: form.value.targetRenstra[2028],
      target2029: form.value.targetRenstra[2029]
    };

    const result = await $fetch<any>('/api/sasaran-program', {
      method: 'PUT',
      body: payload
    });

    if (result) {
      router.push(`/${route.params.slug}/sasaran-program`);
    }
  } catch (error: any) {
    console.error('Error updating data:', error);
    alert('Gagal menyimpan perubahan: ' + (error.data?.statusMessage || 'Terjadi kesalahan.'));
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
  border-color: rgb(37 99 235);
  box-shadow: 0 0 0 4px rgb(191 219 254 / 0.4);
}

.field-input::placeholder {
  color: rgb(203 213 225);
}
</style>

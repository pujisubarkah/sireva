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
            <p class="text-blue-100 mt-1 text-sm font-medium">Input data sasaran program, indikator, dan target tahunan.</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-12">
        
        <!-- Section 01: Informasi Utama -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Informasi Utama</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sasaran Program -->
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
              <input 
                id="unitKerja" 
                v-model="form.unitKerja" 
                type="text" 
                class="field-input" 
                placeholder="Misal: Pusbangkom ASN" 
                required
              />
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
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <IconCheck v-if="!submitting" :size="20" :stroke-width="3" />
            <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Simpan Data
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Sasaran Program
 */

definePageMeta({ layout: 'dashboard' })

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconArrowLeft, IconPlus, IconCheck, IconFlag, IconTarget } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const years = [2025, 2026, 2027, 2028, 2029];

// State Form
const submitting = ref(false);

const form = ref({
  sasaranProgram: '',
  satuan: '',
  unitKerja: '',
  targetRenstra: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>),
  targetPerjanjian: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  submitting.value = true;
  try {
    console.log('Saving Sasaran Program:', form.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push(`/${route.params.slug}/sasaran-program`);
  } catch (error) {
    console.error('Error saving data:', error);
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

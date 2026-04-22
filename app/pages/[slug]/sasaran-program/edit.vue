<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Edit Sasaran Program</h1>
          <p class="text-sm text-slate-500 mt-0.5">Perbarui data sasaran program, indikator, dan target tahunan.</p>
        </div>
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-program`)"
          class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Kembali"
        >
          <IconX :size="20" />
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="fetching" class="p-12 text-center text-slate-500">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p>Memuat rincian data...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-8">
        
        <!-- Section: Informasi Utama -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-700 rounded-full"></span>
            Informasi Sasaran Program
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Sasaran Program -->
            <div class="md:col-span-2 space-y-1.5">
              <label for="sasaranProgram" class="block text-sm font-medium text-slate-700">Nama Sasaran Program</label>
              <textarea 
                id="sasaranProgram" 
                v-model="form.sasaranProgram" 
                required 
                class="field-input min-h-[80px]" 
                placeholder="Masukkan deskripsi sasaran program..."
              ></textarea>
            </div>

            <!-- Satuan -->
            <div class="space-y-1.5">
              <label for="satuan" class="block text-sm font-medium text-slate-700">Satuan</label>
              <input 
                id="satuan" 
                v-model="form.satuan" 
                type="text" 
                required 
                class="field-input" 
                placeholder="Contoh: Orang, Persentase, Skor, dsb" 
              />
            </div>

            <!-- Unit Kerja -->
            <div class="space-y-1.5">
              <label for="unitKerja" class="block text-sm font-medium text-slate-700">Unit Kerja Pelaksana</label>
              <input 
                id="unitKerja" 
                v-model="form.unitKerja" 
                type="text" 
                required 
                class="field-input" 
                placeholder="Contoh: Pusbangkom ASN" 
              />
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Section: Target Renstra -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-emerald-700 rounded-full"></span>
            Target Kinerja Renstra
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div v-for="year in years" :key="`renstra-${year}`" class="space-y-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-inner">
              <label :for="`renstra-${year}`" class="block text-xs font-bold text-slate-500 uppercase text-center">{{ year }}</label>
              <input 
                :id="`renstra-${year}`" 
                v-model="form.targetRenstra[year]" 
                type="text" 
                class="field-input text-center font-bold text-emerald-700 text-lg" 
                placeholder="0" 
              />
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Section: Target PK -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-amber-700 rounded-full"></span>
            Target Perjanjian Kinerja (PK)
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div v-for="year in years" :key="`pk-${year}`" class="space-y-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-inner">
              <label :for="`pk-${year}`" class="block text-xs font-bold text-slate-500 uppercase text-center">{{ year }}</label>
              <input 
                :id="`pk-${year}`" 
                v-model="form.targetPerjanjian[year]" 
                type="text" 
                class="field-input text-center font-bold text-amber-700 text-lg" 
                placeholder="0" 
              />
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/sasaran-program`)"
            class="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="px-8 py-2.5 rounded-lg bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <IconCheck v-if="!submitting" :size="20" />
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
import { IconX, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const years = [2025, 2026, 2027, 2028, 2029];

// State
const id = Number(route.query.id);
const fetching = ref(true);
const submitting = ref(false);

const form = ref({
  id: id,
  sasaranProgram: '',
  satuan: '',
  unitKerja: '',
  targetRenstra: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>),
  targetPerjanjian: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

// Load data on mount
onMounted(async () => {
  if (!id) {
    alert('ID tidak ditemukan.');
    router.push(`/${route.params.slug}/sasaran-program`);
    return;
  }

  try {
    fetching.value = true;
    
    // Mocking API call to load data
    console.log('Fetching data for Sasaran Program ID:', id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data based on the row selected
    const mockData = [
      {
        id: 1,
        sasaranProgram: 'Program Pelatihan ASN',
        satuan: 'Orang',
        targetRenstra: { 2025: 800, 2026: 900, 2027: 1000, 2028: 1100, 2029: 1200 },
        targetPerjanjian: { 2025: 780, 2026: 880, 2027: 980, 2028: 1050, 2029: 1150 },
        unitKerja: 'Pusbangkom ASN',
      },
      {
        id: 2,
        sasaranProgram: 'Program Penguatan Inovasi Kelembagaan',
        satuan: 'Inovasi',
        targetRenstra: { 2025: 8, 2026: 10, 2027: 12, 2028: 14, 2029: 16 },
        targetPerjanjian: { 2025: 7, 2026: 9, 2027: 11, 2028: 13, 2029: 15 },
        unitKerja: 'Puslatbang KDOD',
      },
      {
        id: 3,
        sasaranProgram: 'Program Digitalisasi Layanan Pembelajaran',
        satuan: 'Layanan',
        targetRenstra: { 2025: 5, 2026: 7, 2027: 9, 2028: 11, 2029: 13 },
        targetPerjanjian: { 2025: 5, 2026: 6, 2027: 8, 2028: 10, 2029: 12 },
        unitKerja: 'Pusdatin LAN',
      }
    ];

    const data = mockData.find(m => m.id === id);
    if (data) {
      form.value = {
        ...data,
        targetRenstra: Object.entries(data.targetRenstra).reduce((acc, [y, v]) => ({ ...acc, [Number(y)]: String(v) }), {}),
        targetPerjanjian: Object.entries(data.targetPerjanjian).reduce((acc, [y, v]) => ({ ...acc, [Number(y)]: String(v) }), {})
      } as any;
    }

  } catch (error) {
    console.error('Gagal mengambil data:', error);
    alert('Terjadi kesalahan saat memuat data.');
  } finally {
    fetching.value = false;
  }
});

/**
 * Handle form submission (Update)
 */
const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    // Mocking API call to update data
    console.log('Updating Sasaran Program data:', form.value);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect back to index
    router.push(`/${route.params.slug}/sasaran-program`);
  } catch (error) {
    console.error('Error updating data:', error);
    alert('Gagal menyimpan perubahan ke server. Silakan coba lagi.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(214 211 209);
  border-radius: 0.75rem;
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  color: rgb(15 23 42);
  background-color: white;
  transition: all 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: rgb(37 99 235);
  box-shadow: 0 0 0 4px rgb(191 219 254 / 0.4);
}

.field-input:disabled {
  background-color: rgb(248 250 252);
  color: rgb(148 163 184);
  cursor: not-allowed;
  border-color: rgb(241 245 249);
}
</style>

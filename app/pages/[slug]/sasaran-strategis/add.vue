<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Tambah Sasaran Strategis</h1>
          <p class="text-sm text-slate-500 mt-0.5">Input data sasaran, indikator, dan target tahunan.</p>
        </div>
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
          class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Kembali"
        >
          <IconX :size="20" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-8">
        
        <!-- Section: Tujuan & Sasaran -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-700 rounded-full"></span>
            Informasi Sasaran Strategis
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Pilih Tujuan -->
            <div class="space-y-1.5">
              <label for="tujuanId" class="block text-sm font-medium text-slate-700">Pilih Tujuan</label>
              <select 
                id="tujuanId" 
                v-model="form.tujuanId" 
                class="field-input"
                required
              >
                <option :value="null">-- Pilih Tujuan --</option>
                <option v-for="t in tujuanList" :key="t.id" :value="t.id">{{ t.tujuanText }}</option>
              </select>
            </div>

            <!-- Pilih Sasaran (Jika tidak membuat baru) -->
            <div class="space-y-1.5">
              <label for="sasaranId" class="block text-sm font-medium text-slate-700">Pilih Sasaran Strategis</label>
              <div class="flex flex-col gap-2">
                <select 
                  id="sasaranId" 
                  v-model="form.sasaranId" 
                  class="field-input"
                  :disabled="isNewSasaran"
                  :required="!isNewSasaran"
                >
                  <option :value="null">-- Pilih Sasaran Strategis --</option>
                  <option v-for="s in filteredSasaranList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
                </select>
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="newSasaranToggle" v-model="isNewSasaran" class="rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <label for="newSasaranToggle" class="text-xs text-slate-500 font-medium cursor-pointer">Buat Sasaran Strategis Baru</label>
                </div>
              </div>
            </div>

            <!-- Input Sasaran Baru (Jika checkbox dicentang) -->
            <div v-if="isNewSasaran" class="md:col-span-2 space-y-1.5">
              <label for="sasaranText" class="block text-sm font-medium text-slate-700">Nama Sasaran Strategis Baru</label>
              <textarea 
                id="sasaranText" 
                v-model="form.sasaranText" 
                required 
                class="field-input min-h-[80px]" 
                placeholder="Masukkan deskripsi sasaran strategis baru..."
              ></textarea>
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Section: Indikator -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-emerald-700 rounded-full"></span>
            Indikator Kinerja
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-2 space-y-1.5">
              <label for="namaIndikator" class="block text-sm font-medium text-slate-700">Nama Indikator</label>
              <input 
                id="namaIndikator" 
                v-model="form.namaIndikator" 
                type="text" 
                required 
                class="field-input" 
                placeholder="Masukkan nama indikator kinerja..." 
              />
            </div>
            <div class="space-y-1.5">
              <label for="satuan" class="block text-sm font-medium text-slate-700">Satuan</label>
              <input 
                id="satuan" 
                v-model="form.satuan" 
                type="text" 
                required 
                class="field-input" 
                placeholder="Contoh: Persentase, Skor, Rp, dsb" 
              />
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Section: Target Tahunan -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-amber-700 rounded-full"></span>
            Target Capaian Tahunan (Renstra)
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div v-for="year in years" :key="year" class="space-y-2 p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-inner">
              <label :for="`target-${year}`" class="block text-xs font-bold text-slate-500 uppercase text-center">{{ year }}</label>
              <input 
                :id="`target-${year}`" 
                v-model="form.targets[year]" 
                type="text" 
                class="field-input text-center font-bold text-blue-700 text-lg" 
                placeholder="0" 
              />
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
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
            Simpan Data
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Sasaran Strategis (Improved)
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconX, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const years = [2025, 2026, 2027, 2028, 2029];

// State Form
const isNewSasaran = ref(false);
const submitting = ref(false);
const tujuanList = ref<any[]>([]);
const sasaranList = ref<any[]>([]);

const form = ref({
  tujuanId: null as number | null,
  sasaranId: null as number | null,
  sasaranText: '',
  namaIndikator: '',
  satuan: '',
  targets: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

// Filter sasaran berdasarkan tujuan yang dipilih
const filteredSasaranList = computed(() => {
  if (!form.value.tujuanId) return [];
  return sasaranList.value.filter(s => s.tujuanId === form.value.tujuanId);
});

// Load data on mount
onMounted(async () => {
  try {
    const [tujuanData, sasaranData] = await Promise.all([
      $fetch<any[]>('/api/tujuan'),
      $fetch<any[]>('/api/sasaran-strategis')
    ]);
    tujuanList.value = tujuanData;
    sasaranList.value = sasaranData;
  } catch (error) {
    console.error('Gagal mengambil data referensi:', error);
  }
});

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    const result = await $fetch<any>('/api/sasaran-strategis/create', {
      method: 'POST',
      body: {
        ...form.value,
        isNewSasaran: isNewSasaran.value
      }
    });
    
    if (result.success) {
      router.push(`/${route.params.slug}/sasaran-strategis`);
    } else {
      alert('Gagal: ' + result.message);
    }
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Gagal menyimpan data ke server. Silakan coba lagi.');
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

input[type="checkbox"] {
  width: 1.1rem;
  height: 1.1rem;
}
</style>

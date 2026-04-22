<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Edit Sasaran Strategis</h1>
          <p class="text-sm text-slate-500 mt-0.5">Perbarui data sasaran, indikator, dan target tahunan.</p>
        </div>
        <NuxtLink
          :to="`/${$route.params.slug}/sasaran-strategis`"
          class="text-slate-400 hover:text-slate-600 transition-colors"
          title="Kembali"
        >
          <IconX :size="20" />
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="fetching" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 text-sm font-medium">Mengambil data...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Section: Sasaran -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-700 rounded-full"></span>
            Informasi Sasaran
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1.5">
              <label for="sasaranId" class="block text-sm font-medium text-slate-700">Sasaran Strategis</label>
              <select 
                id="sasaranId" 
                v-model="form.sasaranId" 
                class="field-input"
                required
              >
                <option :value="null">-- Pilih Sasaran --</option>
                <option v-for="s in sasaranList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
              </select>
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Section: Indikator -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-emerald-700 rounded-full"></span>
            Indikator Kinerja
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2 space-y-1.5">
              <label for="namaIndikator" class="block text-sm font-medium text-slate-700">Nama Indikator</label>
              <input 
                id="namaIndikator" 
                v-model="form.namaIndikator" 
                type="text" 
                required 
                class="field-input" 
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
              />
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Section: Target Tahunan -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-amber-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-amber-700 rounded-full"></span>
            Target Capaian Berdasarkan Tahun
          </h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div v-for="year in years" :key="year" class="space-y-1.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
              <label :for="`target-${year}`" class="block text-xs font-bold text-slate-500 uppercase">{{ year }}</label>
              <input 
                :id="`target-${year}`" 
                v-model="form.targets[year]" 
                type="text" 
                class="field-input text-center font-bold text-blue-700" 
              />
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 px-2">
          <button 
            type="button" 
            @click="$router.push(`/${$route.params.slug}/sasaran-strategis`)"
            class="px-5 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="px-5 py-2 rounded-lg bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <IconCheck v-if="!submitting" :size="18" />
            <span v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Edit Sasaran Strategis
 * Digunakan untuk memperbarui data indikator dan target yang sudah ada.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { IconX, IconCheck } from '@tabler/icons-vue';

const route = useRoute();
const router = useRouter();
const years = [2025, 2026, 2027, 2028, 2029];

// State
const indicatorId = Number(route.query.id);
const fetching = ref(true);
const submitting = ref(false);
const sasaranList = ref<{ id: number, sasaranText: string }[]>([]);

const form = ref({
  id: indicatorId,
  sasaranId: null as number | null,
  namaIndikator: '',
  satuan: '',
  targets: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

// Load data on mount
onMounted(async () => {
  if (!indicatorId) {
    alert('ID Indikator tidak ditemukan.');
    router.push(`/${route.params.slug}/sasaran-strategis`);
    return;
  }

  try {
    fetching.value = true;
    
    // 1. Ambil List Sasaran (untuk dropdown)
    // 2. Ambil Data Indikator
    // 3. Ambil Data Target
    // 4. Ambil Data Tahun (untuk mapping id -> tahun)
    
    const [sasRes, indRes, tarRes, thnRes] = await Promise.all([
      $fetch<any[]>('/api/sasaran-strategis'),
      $fetch<any[]>(`/api/indikator-kinerja?id=${indicatorId}`),
      $fetch<any[]>('/api/target-indikator'), // Fetch all and filter client side for simplicity if no specific API
      $fetch<any[]>('/api/tahun')
    ]);

    sasaranList.value = sasRes;
    
    const indicator = indRes[0];
    if (!indicator) throw new Error('Data indikator tidak ditemukan.');

    form.value.sasaranId = indicator.sasaranId;
    form.value.namaIndikator = indicator.namaIndikator;
    form.value.satuan = indicator.satuan;

    // Mapping targets
    const tahunMap: Record<number, number> = thnRes.reduce((acc: any, t: any) => {
      acc[t.id] = t.tahun;
      return acc;
    }, {});

    const indicatorTargets = tarRes.filter((t: any) => t.indikatorId === indicatorId);
    indicatorTargets.forEach((t: any) => {
      const year = tahunMap[t.tahunId];
      if (year && years.includes(year)) {
        form.value.targets[year] = t.target || '';
      }
    });

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
    const result = await $fetch<any>('/api/sasaran-strategis/update', {
      method: 'PUT',
      body: form.value
    });
    
    if (result.success) {
      router.push(`/${route.params.slug}/sasaran-strategis`);
    } else {
      alert('Gagal: ' + result.message);
    }
  } catch (error) {
    console.error('Error updating data:', error);
    alert('Gagal menyimpan perubahan ke server.');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(214 211 209);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background-color: white;
  transition: all 0.15s ease;
}

.field-input:focus {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(191 219 254 / 0.5);
}
</style>

<template>
  <div class="space-y-6 max-w-4xl mx-auto pb-10">
    <!-- Breadcrumb / Kembali -->
    <button 
      @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
      class="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#2663A3] transition-colors"
    >
      <div class="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
        <IconArrowLeft :size="16" />
      </div>
      Kembali ke Daftar
    </button>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Edit Sasaran Strategis</h1>
          <p class="text-sm text-slate-500 mt-1">Perbarui detail indikator dan target rencana strategis Anda.</p>
        </div>
        <div class="hidden sm:block">
          <div class="p-3 bg-blue-50 rounded-2xl border border-blue-100">
            <IconPencil :size="24" class="text-[#2663A3]" />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="fetching" class="p-20 text-center">
        <div class="relative inline-flex mb-4">
          <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
        </div>
        <p class="text-slate-500 font-medium italic">Mengambil data terbaru...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-8 space-y-8">
        
        <!-- Section: Identitas Indikator -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Identitas Indikator</h2>
          </div>
          
          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-2">
              <label for="sasaranId" class="block text-sm font-bold text-slate-700 ml-1">Sasaran Strategis</label>
              <select 
                id="sasaranId" 
                v-model="form.sasaranId" 
                class="field-input"
                required
              >
                <option :value="null">-- Pilih Sasaran Strategis --</option>
                <option v-for="s in sasaranList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="md:col-span-2 space-y-2">
                <label for="namaIndikator" class="block text-sm font-bold text-slate-700 ml-1">Nama Indikator Kinerja</label>
                <input 
                  id="namaIndikator" 
                  v-model="form.namaIndikator" 
                  type="text" 
                  required 
                  placeholder="Masukkan nama indikator..."
                  class="field-input" 
                />
              </div>
              <div class="space-y-2">
                <label for="satuan" class="block text-sm font-bold text-slate-700 ml-1">Satuan</label>
                <input 
                  id="satuan" 
                  v-model="form.satuan" 
                  type="text" 
                  required 
                  placeholder="Contoh: %, Dokumen, Orang"
                  class="field-input" 
                />
              </div>
            </div>
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Section: Target Per Tahun -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-500/20">
              02
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Target Rencana Strategis (Renstra)</h2>
          </div>

          <div class="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div v-for="year in years" :key="year" class="space-y-2 group">
                <label :for="`target-${year}`" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center group-focus-within:text-blue-600 transition-colors">TAHUN {{ year }}</label>
                <div class="relative">
                  <input 
                    :id="`target-${year}`" 
                    v-model="form.targets[year]" 
                    type="text" 
                    class="field-input text-center font-bold text-blue-700 focus:scale-105 transition-transform" 
                  />
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
            <p class="text-[11px] text-slate-400 mt-6 text-center italic">
              * Isi target sesuai dengan dokumen perencanaan strategis instansi Anda.
            </p>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4">
          <button 
            type="button" 
            @click="handleDelete"
            class="w-full sm:w-auto px-6 py-3 rounded-xl border border-red-100 text-red-500 font-bold text-sm hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center gap-2"
          >
            <IconTrash :size="18" />
            Hapus Indikator
          </button>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <button 
              type="button" 
              @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
              class="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="submitting"
              class="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <IconCheck v-if="!submitting" :size="20" :stroke-width="3" />
              <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Simpan Perubahan
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Edit Sasaran Strategis
 * UI Modern dengan pengalaman pengguna yang ditingkatkan.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconArrowLeft, IconPencil, IconCheck, IconTrash } from '@tabler/icons-vue';

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
    
    const [sasRes, indRes, tarRes, thnRes] = await Promise.all([
      $fetch<any[]>('/api/sasaran-strategis'),
      $fetch<any[]>(`/api/indikator-kinerja?id=${indicatorId}`),
      $fetch<any[]>('/api/target-indikator'),
      $fetch<any[]>('/api/tahun')
    ]);

    sasaranList.value = sasRes;
    
    const indicator = indRes[0];
    if (!indicator) throw new Error('Data indikator tidak ditemukan.');

    form.value.sasaranId = indicator.sasaranId;
    form.value.namaIndikator = indicator.namaIndikator;
    form.value.satuan = indicator.satuan;

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

const handleDelete = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus indikator ini?')) return;
  
  try {
    await $fetch('/api/indikator-kinerja', {
      method: 'DELETE',
      body: { id: indicatorId }
    });
    router.push(`/${route.params.slug}/sasaran-strategis`);
  } catch (error) {
    console.error(error);
    alert('Gagal menghapus data.');
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
  background-color: white;
}

.field-input::placeholder {
  color: rgb(203 213 225);
}
</style>

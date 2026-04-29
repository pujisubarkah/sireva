<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/rencana-aksi`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Rencana Aksi
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Tambah Baru</span>
    </div>

    <!-- Premium Form Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-gradient-to-r from-blue-600 to-[#2663A3] relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <IconPlus :size="120" class="text-white" />
        </div>
        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <IconPlus :size="32" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">Buat Rencana Aksi Baru</h1>
            <p class="text-blue-100 mt-1 text-sm font-medium">Definisikan langkah operasional untuk mencapai target indikator.</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-12">
        
        <!-- Section 01: Konteks Strategis -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Konteks Strategis</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Pilih Sasaran -->
            <div class="space-y-2">
              <label for="sasaranId" class="block text-sm font-bold text-slate-700 ml-1">Sasaran Terkait</label>
              <select 
                id="sasaranId" 
                v-model="form.sasaranId" 
                class="field-input"
                required
              >
                <option :value="null" disabled>-- Pilih Sasaran --</option>
                <option v-for="s in sasaranList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
              </select>
            </div>

            <!-- Pilih Indikator -->
            <div class="space-y-2">
              <label for="indikatorId" class="block text-sm font-bold text-slate-700 ml-1">Indikator Kinerja</label>
              <select 
                id="indikatorId" 
                v-model="form.indikatorId" 
                class="field-input"
                required
                :disabled="!form.sasaranId"
              >
                <option :value="null" disabled>-- Pilih Indikator --</option>
                <option v-for="i in filteredIndikatorList" :key="i.id" :value="i.id">{{ i.namaIndikator }}</option>
              </select>
              <p v-if="!form.sasaranId" class="text-[10px] text-amber-600 font-bold ml-1">Pilih sasaran terlebih dahulu.</p>
            </div>
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Section 02: Rincian Aksi -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-600/20">
              02
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Detail Rencana Aksi</h2>
          </div>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- Deskripsi Aksi -->
            <div class="space-y-2">
              <label for="rencanaAksi" class="block text-sm font-bold text-slate-700 ml-1">Deskripsi Rencana Aksi</label>
              <textarea 
                id="rencanaAksi" 
                v-model="form.rencanaAksi" 
                rows="4"
                class="field-input resize-none"
                placeholder="Jelaskan langkah nyata yang akan dilakukan..."
                required
              ></textarea>
            </div>

            <!-- Target Capaian -->
            <div class="space-y-4 pt-4">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.1em] ml-1">Target Capaian Operasional</h3>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div class="space-y-2 col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-black text-slate-400 uppercase text-center tracking-tighter">Total Target</label>
                  <input 
                    v-model.number="form.target" 
                    type="number" 
                    step="0.01"
                    class="field-input !p-3 text-center font-black text-[#2663A3] text-lg bg-blue-50/50 border-blue-100" 
                    placeholder="0"
                    required
                  />
                </div>
                <div v-for="tw in [1, 2, 3, 4]" :key="tw" class="space-y-2">
                  <label class="block text-[10px] font-bold text-slate-400 uppercase text-center tracking-tighter">TW {{ tw }}</label>
                  <input 
                    v-model.number="form[`tw${tw}`]" 
                    type="number" 
                    step="0.01"
                    class="field-input !p-3 text-center font-bold text-slate-600" 
                    placeholder="0"
                  />
                </div>
              </div>
              <p class="text-[11px] text-slate-400 italic ml-1">Target TW (Triwulan) digunakan untuk memonitor progres berkala.</p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-8 mt-4 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/rencana-aksi`)"
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
            Simpan Rencana
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Rencana Aksi
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconArrowLeft, IconPlus, IconCheck } from '@tabler/icons-vue';
import useSWRV from 'swrv';

const router = useRouter();
const route = useRoute();

// State
const submitting = ref(false);

const form = ref<any>({
  sasaranId: null,
  indikatorId: null,
  rencanaAksi: '',
  target: 0,
  tw1: 0,
  tw2: 0,
  tw3: 0,
  tw4: 0,
});

// Fetchers
const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: sasaranList } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: indikatorList } = useSWRV('/api/indikator-kinerja', fetcher);

const filteredIndikatorList = computed(() => {
  if (!form.value.sasaranId || !indikatorList.value) return [];
  return (indikatorList.value as any[]).filter(i => i.sasaranId === form.value.sasaranId);
});

const handleSubmit = async () => {
  submitting.value = true;
  try {
    console.log('Saving Rencana Aksi:', form.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push(`/${route.params.slug}/rencana-aksi`);
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

select.field-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style>

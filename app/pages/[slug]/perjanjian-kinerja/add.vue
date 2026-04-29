<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Perjanjian Kinerja
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Tambah Baru</span>
    </div>

    <!-- Premium Form Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-gradient-to-r from-blue-600 to-[#2663A3] relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <IconFileCheck :size="120" class="text-white" />
        </div>
        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <IconFileCheck :size="32" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">Buat Komitmen Kinerja</h1>
            <p class="text-blue-100 mt-1 text-sm font-medium">Lengkapi rincian indikator dan target untuk perjanjian kinerja tahunan.</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-12">
        
        <!-- Section 01: Deskripsi Kinerja -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Deskripsi Kinerja</h2>
          </div>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- Sasaran -->
            <div class="space-y-2">
              <label for="sasaran" class="block text-sm font-bold text-slate-700 ml-1">Sasaran</label>
              <textarea 
                id="sasaran" 
                v-model="form.sasaran" 
                rows="3"
                class="field-input resize-none"
                placeholder="Masukkan deskripsi sasaran..."
                required
              ></textarea>
            </div>

            <!-- Indikator -->
            <div class="space-y-2">
              <label for="indikator" class="block text-sm font-bold text-slate-700 ml-1">Indikator Kinerja</label>
              <textarea 
                id="indikator" 
                v-model="form.indikator" 
                rows="3"
                class="field-input resize-none"
                placeholder="Masukkan deskripsi indikator..."
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Section 02: Target Capaian -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-600/20">
              02
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Target Capaian</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Target -->
            <div class="space-y-2">
              <label for="target" class="block text-sm font-bold text-slate-700 ml-1">Target Tahunan</label>
              <input 
                id="target" 
                v-model="form.target" 
                type="text" 
                class="field-input font-bold text-[#2663A3]"
                placeholder="Misal: 85%, 10 Modul, dsb" 
                required
              />
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-8 mt-4 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)"
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
            Simpan Data PK
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Perjanjian Kinerja
 */

definePageMeta({ layout: 'dashboard' })

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconArrowLeft, IconFileCheck, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();

// State Form
const submitting = ref(false);

const form = ref({
  sasaran: '',
  indikator: '',
  target: ''
});

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  submitting.value = true;
  try {
    console.log('Saving PK data:', form.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push(`/${route.params.slug}/perjanjian-kinerja`);
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

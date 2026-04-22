<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Tambah Perjanjian Kinerja</h1>
          <p class="text-sm text-slate-500 mt-0.5">Input data sasaran, indikator, dan target tahunan.</p>
        </div>
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)"
          class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Kembali"
        >
          <IconX :size="20" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-8">
        
        <!-- Section: Informasi Perjanjian Kinerja -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-blue-700 rounded-full"></span>
            Informasi Perjanjian Kinerja
          </h2>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- Sasaran -->
            <div class="space-y-1.5">
              <label for="sasaran" class="block text-sm font-medium text-slate-700">Sasaran</label>
              <textarea 
                id="sasaran" 
                v-model="form.sasaran" 
                required 
                class="field-input min-h-[80px]" 
                placeholder="Masukkan deskripsi sasaran..."
              ></textarea>
            </div>

            <!-- Indikator -->
            <div class="space-y-1.5">
              <label for="indikator" class="block text-sm font-medium text-slate-700">Indikator</label>
              <textarea 
                id="indikator" 
                v-model="form.indikator" 
                required 
                class="field-input min-h-[80px]" 
                placeholder="Masukkan deskripsi indikator..."
              ></textarea>
            </div>

            <!-- Target -->
            <div class="space-y-1.5">
              <label for="target" class="block text-sm font-medium text-slate-700">Target</label>
              <input 
                id="target" 
                v-model="form.target" 
                type="text" 
                required 
                class="field-input" 
                placeholder="Contoh: 85%, 10 Modul, dsb" 
              />
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/perjanjian-kinerja`)"
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
 * Komponen Tambah Perjanjian Kinerja
 */

definePageMeta({ layout: 'dashboard' })

import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconX, IconCheck } from '@tabler/icons-vue';

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
    // Mocking API call
    console.log('Saving data:', form.value);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect back to index
    router.push(`/${route.params.slug}/perjanjian-kinerja`);
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
</style>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div>
          <h1 class="text-lg font-semibold text-slate-800">Tambah Sasaran Kegiatan</h1>
          <p class="text-sm text-slate-500 mt-0.5">Input rincian kegiatan baru dan alokasi anggaran.</p>
        </div>
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
          class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title="Kembali"
        >
          <IconX :size="20" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-8">
        
        <!-- Section: Detail Kegiatan -->
        <div class="space-y-6">
          <h2 class="text-sm font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-emerald-700 rounded-full"></span>
            Rincian Sasaran Kegiatan
          </h2>
          
          <div class="grid grid-cols-1 gap-6">
            <!-- Program (Select) -->
            <div class="space-y-1.5">
              <label for="program" class="block text-sm font-medium text-slate-700">Program Terkait</label>
              <select id="program" v-model="form.programId" required class="field-input">
                <option value="" disabled>Pilih Program</option>
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.namaProgram }}</option>
              </select>
            </div>

            <!-- Kegiatan -->
            <div class="space-y-1.5">
              <label for="kegiatan" class="block text-sm font-medium text-slate-700">Nama Sasaran Kegiatan</label>
              <textarea 
                id="kegiatan" 
                v-model="form.namaKegiatan" 
                required 
                class="field-input min-h-[80px]" 
                placeholder="Masukkan deskripsi kegiatan..."
              ></textarea>
            </div>

            <!-- Anggaran -->
            <div class="space-y-1.5">
              <label for="anggaran" class="block text-sm font-medium text-slate-700">Total Anggaran (IDR)</label>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-slate-400 font-bold z-10 pointer-events-none">Rp</span>
                <input 
                  id="anggaran" 
                  v-model="form.total" 
                  type="number" 
                  required 
                  class="field-input !pl-11" 
                  placeholder="0" 
                />
              </div>
              <p class="text-[11px] text-slate-400 mt-1 italic">Format angka murni tanpa titik/koma.</p>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
            class="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="px-8 py-2.5 rounded-lg bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-700/20 hover:bg-emerald-800 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <IconCheck v-if="!submitting" :size="20" />
            <span v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Simpan Kegiatan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Sasaran Kegiatan
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconX, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();

// State
const submitting = ref(false);
const programs = ref<any[]>([]);

const form = ref({
  programId: '',
  namaKegiatan: '',
  total: 0
});

// Load programs on mount
onMounted(async () => {
  try {
    const progRes = await $fetch<any[]>('/api/master-program');
    programs.value = progRes;
  } catch (error) {
    console.error('Gagal mengambil daftar program:', error);
  }
});

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    // Mocking API call
    console.log('Saving Sasaran Kegiatan data:', form.value);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect back to index
    router.push(`/${route.params.slug}/sasaran-kegiatan`);
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
  border-color: rgb(16 185 129);
  box-shadow: 0 0 0 4px rgb(16 185 129 / 0.1);
}

.field-input:disabled {
  background-color: rgb(248 250 252);
  color: rgb(148 163 184);
  cursor: not-allowed;
  border-color: rgb(241 245 249);
}

.field-input.\!pl-11 {
  padding-left: 2.75rem !important;
}

select.field-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style>

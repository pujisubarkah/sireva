<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/rencana-aksi`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Rencana Aksi
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Edit Rencana</span>
    </div>

    <!-- Premium Form Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-gradient-to-r from-indigo-700 to-indigo-900 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <IconPencil :size="120" class="text-white" />
        </div>
        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <IconPencil :size="32" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">Perbarui Rencana Aksi</h1>
            <p class="text-indigo-100 mt-1 text-sm font-medium">Sesuaikan langkah operasional dan target triwulanan.</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="fetching" class="p-20 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-700/30 border-t-indigo-700 mb-4"></div>
        <p class="text-slate-500 font-bold tracking-widest text-xs uppercase">Menyiapkan Data...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-8 space-y-12">
        
        <!-- Section 01: Konteks Strategis -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Konteks Strategis</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70 cursor-not-allowed">
            <!-- Sasaran (Readonly in Edit) -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700 ml-1">Sasaran Terkait</label>
              <div class="field-input bg-slate-50 font-medium">
                {{ form.sasaran || 'Memuat...' }}
              </div>
            </div>

            <!-- Indikator (Readonly in Edit) -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-slate-700 ml-1">Indikator Kinerja</label>
              <div class="field-input bg-slate-50 font-medium">
                {{ form.indikator || 'Memuat...' }}
              </div>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 italic ml-1">* Konteks strategis tidak dapat diubah setelah data dibuat.</p>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Section 02: Rincian Aksi -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              02
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Detail Perubahan</h2>
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
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-700/20 hover:bg-indigo-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
 * Komponen Edit Rencana Aksi
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconArrowLeft, IconPencil, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();

// State
const id = Number(route.query.id);
const fetching = ref(true);
const submitting = ref(false);

const form = ref<any>({
  id: id,
  sasaran: '',
  indikator: '',
  rencanaAksi: '',
  target: 0,
  tw1: 0,
  tw2: 0,
  tw3: 0,
  tw4: 0,
});

onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/rencana-aksi`);
    return;
  }

  try {
    fetching.value = true;
    
    // Simulasi pengambilan data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    form.value = {
      id: id,
      sasaran: 'Terwujudnya ASN Berakhlak dan Berdaya Saing Global',
      indikator: 'Persentase ASN yang lulus sertifikasi kompetensi global',
      rencanaAksi: 'Melakukan pemetaan kompetensi ASN di seluruh instansi pusat dan daerah.',
      target: 85,
      tw1: 20,
      tw2: 40,
      tw3: 60,
      tw4: 85,
    };

  } catch (error) {
    console.error('Gagal mengambil data:', error);
  } finally {
    fetching.value = false;
  }
});

const handleSubmit = async () => {
  submitting.value = true;
  try {
    console.log('Updating Rencana Aksi:', form.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push(`/${route.params.slug}/rencana-aksi`);
  } catch (error) {
    console.error('Error updating data:', error);
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
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
}

.field-input::placeholder {
  color: rgb(203 213 225);
}
</style>

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
            <p class="text-blue-100 mt-1 text-sm font-medium">Definisikan langkah operasional untuk mencapai target output kegiatan.</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-12">
        
        <!-- Section 01: Konteks Operasional -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Konteks Operasional</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Unit Kerja -->
            <div class="space-y-2 md:col-span-2">
              <label for="unitKerja" class="block text-sm font-bold text-slate-700 ml-1">Unit Kerja Pelaksana</label>
              <select 
                id="unitKerja" 
                v-model="form.unitKerja" 
                class="field-input"
                required
              >
                <option value="" disabled selected>-- Pilih Unit Kerja --</option>
                <option v-for="unit in units" :key="unit.id" :value="unit.nama">
                  {{ unit.nama }}
                </option>
              </select>
            </div>

            <!-- Pilih Sasaran Kegiatan -->
            <div class="space-y-2 md:col-span-2">
              <label for="kegiatanId" class="block text-sm font-bold text-slate-700 ml-1">Induk Sasaran Kegiatan (Output)</label>
              <select 
                id="kegiatanId" 
                v-model="form.kegiatanId" 
                class="field-input"
                required
              >
                <option :value="null" disabled>-- Pilih Sasaran Kegiatan --</option>
                <option v-for="k in kegiatanList" :key="k.id" :value="k.id">{{ k.sasaranText }}</option>
              </select>
            </div>

            <!-- Info Indikator (Read Only atau Select jika ada banyak) -->
            <div class="space-y-2 md:col-span-2">
              <label class="block text-sm font-bold text-slate-700 ml-1">Indikator Output Terkait</label>
              <div class="field-input bg-slate-50 text-slate-500 font-medium">
                {{ selectedKegiatan?.namaIndikator || 'Pilih kegiatan terlebih dahulu' }}
              </div>
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
              <label for="rencanaAksi" class="block text-sm font-bold text-slate-700 ml-1">Deskripsi Rencana Aksi (Tahapan)</label>
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
              <div class="flex items-center justify-between ml-1">
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.1em]">Target Capaian Operasional</h3>
                <span v-if="isAutoFilled" class="text-[9px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <IconLock :size="10" /> Sinkron PK
                </span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-6 gap-4">
                <div class="space-y-2 col-span-2 sm:col-span-1">
                  <label class="block text-[10px] font-black text-slate-400 uppercase text-center tracking-tighter">Total Target</label>
                  <input 
                    v-model.number="form.target" 
                    type="number" 
                    step="0.01"
                    class="field-input !p-3 text-center font-black text-[#2663A3] text-lg transition-all duration-500" 
                    placeholder="0"
                    required
                  />
                </div>
                <!-- Monthly Inputs B01-B12 -->
                <div v-for="m in 12" :key="m" class="space-y-2">
                  <label class="block text-[10px] font-bold text-slate-400 uppercase text-center tracking-tighter">B{{ String(m).padStart(2, '0') }}</label>
                  <input 
                    v-model.number="form['b' + String(m).padStart(2, '0')]" 
                    type="number" 
                    step="0.01"
                    class="field-input !p-2 text-center text-xs font-semibold text-slate-600" 
                    placeholder="0"
                  />
                </div>
              </div>
              <p class="text-[11px] text-slate-400 italic ml-1 flex items-center gap-1">
                <IconCheck v-if="isAutoFilled" :size="12" class="text-blue-500" />
                {{ isAutoFilled ? 'Total target terkunci sesuai sasaran kegiatan.' : 'Target TW (Triwulan) digunakan untuk memonitor progres berkala.' }}
              </p>
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
import { IconArrowLeft, IconPlus, IconCheck, IconLock } from '@tabler/icons-vue';
import useSWRV from 'swrv';

const router = useRouter();
const route = useRoute();

// State
const submitting = ref(false);
const isAutoFilled = ref(false);

const form = ref<any>({
  kegiatanId: null,
  unitKerja: '',
  rencanaAksi: '',
  target: 0,
  ...Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`b${String(i + 1).padStart(2, '0')}`, 0]))
});

// Watch kegiatan change to auto-fill target
import { watch } from 'vue';
watch(() => form.value.kegiatanId, (newId) => {
  if (newId && kegiatanList.value) {
    const k = (kegiatanList.value as any[]).find(item => item.id === newId);
    if (k) {
      form.value.unitKerja = k.unitKerja || '';
      form.value.target = Number(k.anggaran || 100); 
      isAutoFilled.value = true;
    }
  } else {
    isAutoFilled.value = false;
  }
});

// Fetchers
const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: kegiatanList } = useSWRV('/api/sasaran-kegiatan', fetcher);
const { data: units } = useSWRV('/api/unit-kerja', fetcher);

const selectedKegiatan = computed(() => {
  if (!form.value.kegiatanId || !kegiatanList.value) return null;
  return (kegiatanList.value as any[]).find(k => k.id === form.value.kegiatanId);
});

const handleSubmit = async () => {
  if (!form.value.kegiatanId) {
    alert('Silakan pilih Sasaran Kegiatan terlebih dahulu.');
    return;
  }

  submitting.value = true;
  try {
    const result = await $fetch<any>('/api/rencana-aksi', {
      method: 'POST',
      body: {
        indikatorId: form.value.kegiatanId,
        namaAksi: form.value.rencanaAksi,
        unitKerja: form.value.unitKerja,
        target: form.value.target,
        b01: form.value.b01, b02: form.value.b02, b03: form.value.b03, b04: form.value.b04,
        b05: form.value.b05, b06: form.value.b06, b07: form.value.b07, b08: form.value.b08,
        b09: form.value.b09, b10: form.value.b10, b11: form.value.b11, b12: form.value.b12
      }
    });

    if (result && (result.success !== false)) {
      router.push(`/${route.params.slug}/rencana-aksi`);
    } else {
      alert('Gagal menyimpan: ' + (result?.message || 'Data tidak tersimpan.'));
    }
  } catch (error: any) {
    console.error('Error saving data:', error);
    const msg = error.data?.statusMessage || error.data?.message || 'Terjadi kesalahan pada server.';
    alert('Gagal menyimpan data: ' + msg);
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

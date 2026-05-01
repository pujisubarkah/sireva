<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Sasaran Kegiatan
      </button>
      <span>/</span>
      <span class="text-slate-600">Edit Kegiatan</span>
    </div>

    <!-- Premium Form Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-gradient-to-r from-blue-700 to-indigo-800 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <IconPencil :size="120" class="text-white" />
        </div>
        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <IconPencil :size="32" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">Perbarui Sasaran Kegiatan</h1>
            <p class="text-blue-100 mt-1 text-sm font-medium">Lakukan perubahan pada rincian kegiatan, indikator output, dan alokasi anggaran.</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="fetching" class="p-20 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-bold">Memuat data kegiatan...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-8 space-y-10">
        
        <!-- Section 01: Hirarki & Konteks -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Hirarki & Konteks</h2>
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

            <!-- Pilih Program -->
            <div class="space-y-2 md:col-span-2">
              <label for="programId" class="block text-sm font-bold text-slate-700 ml-1">Induk Sasaran Program (Outcome Antara)</label>
              <select 
                id="programId" 
                v-model="form.programId" 
                class="field-input"
                required
              >
                <option value="" disabled>-- Pilih Sasaran Program --</option>
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.sasaranProgram || p.namaProgram }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Section 02: Rincian Kegiatan -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-600/20">
              02
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Detail Kegiatan & Anggaran</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nama Kegiatan -->
            <div class="space-y-2 md:col-span-2">
              <label for="namaKegiatan" class="block text-sm font-bold text-slate-700 ml-1">Nama Sasaran Kegiatan (Output)</label>
              <textarea 
                id="namaKegiatan" 
                v-model="form.namaKegiatan" 
                rows="3"
                class="field-input resize-none"
                placeholder="Deskripsi kegiatan..."
                required
              ></textarea>
            </div>

            <!-- Indikator Kegiatan -->
            <div class="space-y-2 md:col-span-2">
              <label for="namaIndikator" class="block text-sm font-bold text-slate-700 ml-1">Indikator Kinerja Kegiatan (Output)</label>
              <input 
                id="namaIndikator" 
                v-model="form.namaIndikator" 
                type="text" 
                class="field-input" 
                placeholder="Masukkan nama indikator output..." 
                required
              />
            </div>

            <!-- Anggaran -->
            <div class="space-y-2">
              <label for="total" class="block text-sm font-bold text-slate-700 ml-1">Total Anggaran (IDR)</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                <input 
                  id="total" 
                  v-model="form.total" 
                  type="number" 
                  class="field-input !pl-12 font-bold text-slate-800"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <!-- Target & Satuan -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label for="target" class="block text-sm font-bold text-slate-700 ml-1">Target Kinerja</label>
                <input 
                  id="target" 
                  v-model="form.target" 
                  type="number" 
                  class="field-input font-bold" 
                  placeholder="0" 
                  required
                />
              </div>
              <div class="space-y-2">
                <label for="satuan" class="block text-sm font-bold text-slate-700 ml-1">Satuan</label>
                <input 
                  id="satuan" 
                  v-model="form.satuan" 
                  type="text" 
                  class="field-input" 
                  placeholder="Misal: Dokumen, Laporan..." 
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-8 mt-4 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
            class="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
 * Komponen Edit Sasaran Kegiatan
 * UI Modern dengan alur kerja yang ditingkatkan.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconArrowLeft, IconPencil, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();

// State
const id = Number(route.query.id);
const fetching = ref(true);
const submitting = ref(false);
const programs = ref<any[]>([]);

const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: units } = useSWRV('/api/unit-kerja', fetcher);

const form = ref({
  id: id,
  programId: '',
  unitKerja: '',
  namaKegiatan: '',
  namaIndikator: '',
  satuan: '',
  target: 0,
  total: 0
});

// Load data on mount
onMounted(async () => {
  if (!id) {
    router.push(`/${route.params.slug}/sasaran-kegiatan`);
    return;
  }

  try {
    fetching.value = true;
    
    // Fetch individual record
    const res = await $fetch<any>(`/api/sasaran-kegiatan?id=${id}`);
    const existingData = Array.isArray(res) ? res[0] : res;
    
    // Fetch master programs for dropdown
    programs.value = await $fetch<any[]>('/api/master-program');

    if (existingData) {
      form.value = {
        id: existingData.id,
        programId: existingData.programId,
        unitKerja: existingData.unitKerja || '',
        namaKegiatan: existingData.sasaranText,
        namaIndikator: existingData.namaIndikator || '',
        satuan: existingData.satuan || '',
        target: existingData.target || 0,
        total: Number(existingData.anggaran || 0)
      };
    } else {
      throw new Error('Data tidak ditemukan');
    }

  } catch (error) {
    console.error('Gagal mengambil data:', error);
    alert('Terjadi kesalahan saat memuat data.');
    router.push(`/${route.params.slug}/sasaran-kegiatan`);
  } finally {
    fetching.value = false;
  }
});

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  try {
    await $fetch<any>('/api/sasaran-kegiatan', {
      method: 'PUT',
      body: {
        id: form.value.id,
        programId: form.value.programId,
        sasaranText: form.value.namaKegiatan,
        namaIndikator: form.value.namaIndikator,
        satuan: form.value.satuan,
        target: form.value.target,
        unitKerja: form.value.unitKerja,
        anggaran: String(form.value.total)
      }
    });
    
    router.push(`/${route.params.slug}/sasaran-kegiatan`);
  } catch (error: any) {
    console.error('Error updating data:', error);
    alert('Gagal menyimpan perubahan: ' + (error.data?.statusMessage || 'Terjadi kesalahan pada server.'));
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
  border-color: rgb(37 99 235);
  box-shadow: 0 0 0 4px rgb(191 219 254 / 0.4);
}

.field-input:disabled {
  background-color: rgb(248 250 252);
  color: rgb(148 163 184);
  cursor: not-allowed;
  border-color: rgb(241 245 249);
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

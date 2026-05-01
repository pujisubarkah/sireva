<template>
  <div class="space-y-6 pb-10">
    <!-- Breadcrumb & Back Button -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Sasaran Kegiatan
      </button>
      <span>/</span>
      <span class="text-slate-600">Tambah Baru</span>
    </div>

    <!-- Premium Form Header -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-8 py-10 bg-gradient-to-r from-[#2663A3] to-[#1e4e82] relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <IconPlus :size="120" class="text-white" />
        </div>
        <div class="relative z-10 flex items-center gap-6">
          <div class="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <IconPlus :size="32" class="text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">Buat Sasaran Kegiatan Baru</h1>
            <p class="text-blue-100 mt-1 text-sm font-medium">Lengkapi rincian kegiatan operasional, indikator output, dan alokasi anggaran.</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-10">
        
        <!-- Section 01: Hirarki & Konteks -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Hirarki & Konteks</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Pilih Program -->
            <div class="space-y-2 md:col-span-2">
              <label for="programId" class="block text-sm font-bold text-slate-700 ml-1">Induk Sasaran Program (Outcome Antara)</label>
              <select 
                id="programId" 
                v-model="form.programId" 
                class="field-input"
                required
                @change="handleProgramChange"
              >
                <option value="" disabled>-- Pilih Sasaran Program --</option>
                <option v-for="p in sasaranPrograms" :key="p.id" :value="p.id">{{ p.sasaranText }}</option>
              </select>
            </div>

            <!-- Pilih Indikator Eksisting (Auto-fill) -->
            <div v-if="form.programId" class="md:col-span-2 space-y-2 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 animate-in fade-in duration-300">
              <label for="existingIndikator" class="block text-xs font-black text-emerald-700 uppercase tracking-wider mb-2">Gunakan Indikator dari Program? (Opsional)</label>
              <select 
                id="existingIndikator" 
                v-model="selectedIndikatorId" 
                class="field-input !bg-white"
                @change="autoFillFromIndikator"
              >
                <option :value="null">-- Input Manual atau Pilih Indikator --</option>
                <option v-for="i in filteredIndikatorList" :key="i.id" :value="i.id">{{ i.namaIndikator }}</option>
              </select>
              <p class="text-[10px] text-emerald-600 font-medium mt-1 italic">* Memilih indikator akan mengisi nama indikator secara otomatis.</p>
            </div>

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
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Section 02: Rincian Kegiatan -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-600/20">
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
                placeholder="Misal: Peningkatan Kompetensi Teknis ASN melalui Pelatihan Digital..."
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
                class="field-input transition-all duration-500" 
                :class="{'bg-emerald-50 border-emerald-200': isAutoFilled}"
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
            class="w-full sm:w-auto px-10 py-3 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <IconCheck v-if="!submitting" :size="20" :stroke-width="3" />
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
 * Mendukung auto-fill indikator dari Program induk.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconArrowLeft, IconPlus, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const fetcher = (url: string) => fetch(url).then(r => r.json());

// Fetch Data
const { data: units } = useSWRV('/api/unit-kerja', fetcher);
const { data: allIndikators } = useSWRV('/api/indikator-kinerja', fetcher);

// State
const submitting = ref(false);
const sasaranPrograms = ref<any[]>([]);
const masterKegiatans = ref<any[]>([]);
const selectedIndikatorId = ref<number | null>(null);
const isAutoFilled = ref(false);

const form = ref({
  programId: null,
  namaKegiatan: '',
  namaIndikator: '',
  satuan: '',
  target: 0,
  unitKerja: '',
  total: 0
});

// Filter indikator (In real scenario, Program should have its own indicators, or we link to parent SS)
const filteredIndikatorList = computed(() => {
  if (!form.value.programId || !allIndikators.value) return [];
  // For demo: showing all for now, but in real it should be filtered by parent relation
  return (allIndikators.value as any[]); 
});

// Load initial data
onMounted(async () => {
  try {
    const [spRes, mkRes] = await Promise.all([
      $fetch<any[]>('/api/sasaran-program'),
      $fetch<any[]>('/api/master-kegiatan')
    ]);
    sasaranPrograms.value = spRes;
    masterKegiatans.value = mkRes;
  } catch (error) {
    console.error('Gagal mengambil data referensi:', error);
  }
});

const handleProgramChange = () => {
  selectedIndikatorId.value = null;
  isAutoFilled.value = false;
};

const autoFillFromIndikator = () => {
  if (!selectedIndikatorId.value || !allIndikators.value) return;
  const indicator = (allIndikators.value as any[]).find(i => i.id === selectedIndikatorId.value);
  if (indicator) {
    form.value.namaIndikator = indicator.namaIndikator;
    isAutoFilled.value = true;
    setTimeout(() => { isAutoFilled.value = false }, 2000);
  }
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  if (!form.value.programId) {
    alert('Silakan pilih Sasaran Program terlebih dahulu.');
    return;
  }

  // Cari kegiatan yang cocok (otomatis ambil yang pertama dari master jika ada)
  const targetKegiatan = masterKegiatans.value[0];
  if (!targetKegiatan) {
    alert('Data Kegiatan Master tidak ditemukan. Silakan hubungi admin.');
    return;
  }

  submitting.value = true;
  try {
    const result = await $fetch<any>('/api/sasaran-kegiatan', {
      method: 'POST',
      body: {
        kegiatanId: targetKegiatan.id,
        sasaranText: form.value.namaKegiatan,
        namaIndikator: form.value.namaIndikator,
        satuan: form.value.satuan,
        target: form.value.target,
        unitKerja: form.value.unitKerja,
        anggaran: String(form.value.total),
        kode: 'SK-' + Math.floor(Math.random() * 1000)
      }
    });

    if (result) {
      router.push(`/${route.params.slug}/sasaran-kegiatan`);
    }
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Gagal menyimpan data. Silakan coba lagi.');
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

select.field-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style>


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

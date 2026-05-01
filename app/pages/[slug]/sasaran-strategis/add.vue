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
          <h1 class="text-2xl font-bold text-slate-800">Tambah Sasaran Strategis</h1>
          <p class="text-sm text-slate-500 mt-1">Input data sasaran, indikator, dan target tahunan baru.</p>
        </div>
        <div class="hidden sm:block">
          <div class="p-3 bg-blue-50 rounded-2xl border border-blue-100">
            <IconPlus :size="24" class="text-[#2663A3]" />
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-8">
        
        <!-- Section 01: Konteks Strategis -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Konteks Strategis</h2>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Pilih Unit Kerja -->
            <div class="space-y-2">
              <label for="unitKerja" class="block text-sm font-bold text-slate-700 ml-1">Unit Kerja</label>
              <select 
                id="unitKerja" 
                v-model="form.unitKerja" 
                class="field-input"
                required
              >
                <option :value="null">-- Pilih Unit Kerja --</option>
                <option v-for="unit in unitKerjaList" :key="unit.id" :value="unit.nama">{{ unit.nama }}</option>
              </select>
            </div>
            <!-- Pilih Kegiatan -->
            <div class="space-y-2">
              <label for="tujuanId" class="block text-sm font-bold text-slate-700 ml-1">Nama Kegiatan</label>
              <div class="space-y-3">
                <select 
                  id="tujuanId" 
                  v-model="form.tujuanId" 
                  class="field-input shadow-sm"
                  :disabled="isNewKegiatan"
                  :required="!isNewKegiatan"
                >
                  <option :value="null">-- Pilih Kegiatan --</option>
                  <option v-for="t in tujuanList" :key="t.id" :value="t.id">{{ t.tujuanText }}</option>
                </select>
                <label class="flex items-center gap-2 group cursor-pointer select-none">
                  <div class="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded-md transition-all group-hover:border-blue-500" :class="{'bg-indigo-600 border-indigo-600 shadow-md shadow-indigo-200': isNewKegiatan}">
                    <IconCheck v-if="isNewKegiatan" :size="14" stroke-width="4" class="text-white" />
                    <input type="checkbox" v-model="isNewKegiatan" class="absolute opacity-0 w-full h-full cursor-pointer" />
                  </div>
                  <span class="text-xs font-bold transition-colors" :class="isNewKegiatan ? 'text-indigo-700' : 'text-slate-500'">Buat Kegiatan Baru (Mandiri)</span>
                </label>
              </div>
            </div>

            <!-- Input Kegiatan Baru -->
            <div v-if="isNewKegiatan" class="md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label for="newKegiatanText" class="block text-sm font-bold text-indigo-700 ml-1">Nama Detail Kegiatan Baru</label>
              <textarea 
                id="newKegiatanText" 
                v-model="form.newTujuanText" 
                required 
                class="field-input min-h-[100px] border-indigo-200 bg-indigo-50/30 focus:bg-white" 
                placeholder="Masukkan deskripsi kegiatan baru sesuai spreadsheet..."
              ></textarea>
              <p class="text-[10px] text-indigo-400 ml-1 font-medium italic">* Kegiatan ini akan disimpan secara mandiri dan tidak akan muncul di Data Master Visi-Misi.</p>
            </div>

            <!-- Pilih Sasaran -->
            <div class="space-y-2">
              <label for="sasaranId" class="block text-sm font-bold text-slate-700 ml-1">Sasaran Strategis</label>
              <div class="space-y-3">
                <select 
                  id="sasaranId" 
                  v-model="form.sasaranId" 
                  class="field-input shadow-sm"
                  :disabled="isNewSasaran"
                  :required="!isNewSasaran"
                >
                  <option :value="null">-- Pilih Sasaran Strategis --</option>
                  <option v-for="s in filteredSasaranList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
                </select>
                <label class="flex items-center gap-2 group cursor-pointer select-none">
                  <div class="relative flex items-center justify-center w-5 h-5 border-2 border-slate-300 rounded-md transition-all group-hover:border-blue-500" :class="{'bg-blue-600 border-blue-600 shadow-md shadow-blue-200': isNewSasaran}">
                    <IconCheck v-if="isNewSasaran" :size="14" stroke-width="4" class="text-white" />
                    <input type="checkbox" v-model="isNewSasaran" class="absolute opacity-0 w-full h-full cursor-pointer" />
                  </div>
                  <span class="text-xs font-bold transition-colors" :class="isNewSasaran ? 'text-blue-700' : 'text-slate-500'">Buat Sasaran Strategis Baru</span>
                </label>
              </div>
            </div>

            <!-- Input Sasaran Baru -->
            <div v-if="isNewSasaran" class="md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label for="sasaranText" class="block text-sm font-bold text-slate-700 ml-1 text-blue-700">Nama Sasaran Strategis Baru</label>
              <textarea 
                id="sasaranText" 
                v-model="form.sasaranText" 
                required 
                class="field-input min-h-[100px] border-blue-200 bg-blue-50/30 focus:bg-white" 
                placeholder="Masukkan deskripsi sasaran strategis baru dengan lengkap..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Section 02: Detail Indikator -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-emerald-500/20">
              02
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Detail Indikator Kinerja</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label for="kode" class="block text-sm font-bold text-slate-700 ml-1">Kode IKU</label>
              <input 
                id="kode" 
                v-model="form.kode" 
                type="text" 
                required 
                class="field-input" 
                placeholder="Contoh: IKU-1" 
              />
            </div>
            <div class="space-y-2">
              <label for="namaIndikator" class="block text-sm font-bold text-slate-700 ml-1">Nama Indikator</label>
              <input 
                id="namaIndikator" 
                v-model="form.namaIndikator" 
                type="text" 
                required 
                class="field-input" 
                placeholder="Contoh: Persentase Capaian Kinerja..." 
              />
            </div>
            <div class="space-y-2">
              <label for="satuan" class="block text-sm font-bold text-slate-700 ml-1">Satuan</label>
              <input 
                id="satuan" 
                v-model="form.satuan" 
                type="text" 
                required 
                class="field-input" 
                placeholder="Contoh: %, Dokumen, Skor" 
              />
            </div>
          </div>
        </div>

        <div class="h-px bg-slate-100"></div>

        <!-- Section 03: Target Capaian -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-amber-500/20">
              03
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Target Tahunan (Renstra)</h2>
          </div>

          <div class="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-inner">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div v-for="year in years" :key="year" class="space-y-2 group">
                <label :for="`target-${year}`" class="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center group-focus-within:text-blue-600 transition-colors">{{ year }}</label>
                <div class="relative">
                  <input 
                    :id="`target-${year}`" 
                    v-model="form.targets[year]" 
                    type="text" 
                    class="field-input text-center font-bold text-blue-700 text-lg hover:border-blue-300 transition-all shadow-sm" 
                    placeholder="0" 
                  />
                  <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
          <button 
            type="button" 
            @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
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
            Simpan Data Baru
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Tambah Sasaran Strategis
 * UI Modern dengan pengalaman pengguna yang ditingkatkan.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { IconArrowLeft, IconPlus, IconCheck } from '@tabler/icons-vue';

const router = useRouter();
const route = useRoute();
const years = [2025, 2026, 2027, 2028, 2029];
const unitKerjaList = ref<any[]>([]);

// State Form
const isNewKegiatan = ref(false);
const isNewSasaran = ref(false);
const submitting = ref(false);
const tujuanList = ref<any[]>([]);
const sasaranList = ref<any[]>([]);

const form = ref({
  unitKerja: null as string | null,
  tujuanId: null as number | null,
  newTujuanText: '',
  sasaranId: null as number | null,
  sasaranText: '',
  kode: '',
  namaIndikator: '',
  satuan: '',
  targets: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

// Filter sasaran berdasarkan tujuan yang dipilih
const filteredSasaranList = computed(() => {
  if (!form.value.tujuanId) return sasaranList.value;
  const filtered = sasaranList.value.filter(s => s.tujuanId === form.value.tujuanId);
  // Jika tidak ada yang cocok dengan tujuan, tampilkan semua sebagai opsi (fleksibilitas)
  return filtered.length > 0 ? filtered : sasaranList.value;
});

// Load data on mount
onMounted(async () => {
  try {
    const [tujuanData, sasaranData, unitData] = await Promise.all([
      $fetch<any[]>('/api/tujuan'),
      $fetch<any[]>('/api/sasaran-strategis'),
      $fetch<any[]>('/api/unit-kerja')
    ]);
    tujuanList.value = tujuanData;
    sasaranList.value = sasaranData;
    unitKerjaList.value = unitData;
  } catch (error) {
    console.error('Gagal mengambil data referensi:', error);
  }
});

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    const result = await $fetch<any>('/api/sasaran-strategis/create', {
      method: 'POST',
      body: {
        ...form.value,
        isNewTujuan: isNewKegiatan.value,
        isNewSasaran: isNewSasaran.value,
        misiId: null 
      }
    });
    
    if (result.success) {
      router.push(`/${route.params.slug}/sasaran-strategis`);
    } else {
      alert('Gagal: ' + result.message);
    }
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
</style>

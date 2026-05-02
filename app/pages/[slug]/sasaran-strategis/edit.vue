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
      <div class="px-8 py-6 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white flex items-center justify-between">
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
      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-8">
        
        <!-- Section: Identitas Indikator -->
        <div class="space-y-6">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-600/20">
              01
            </div>
            <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Identitas Indikator</h2>
          </div>
          
          <div class="space-y-4">
            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <label for="sasaranText" class="block text-sm font-bold text-slate-700 sm:w-44 sm:shrink-0 sm:pt-3">Sasaran Strategis</label>
              <div class="sm:flex-1">
                <textarea
                  id="sasaranText"
                  v-model="form.sasaranText"
                  required
                  class="field-input min-h-24"
                  placeholder="Masukkan sasaran strategis..."
                ></textarea>
              </div>
            </div>

            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <label for="kode" class="block text-sm font-bold text-slate-700 sm:w-44 sm:shrink-0">Kode IKU</label>
              <div class="sm:flex-1">
                <input
                  id="kode"
                  v-model="form.kode"
                  type="text"
                  required
                  placeholder="Contoh: IKU-1"
                  class="field-input"
                />
              </div>
            </div>

            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <label for="namaIndikator" class="block text-sm font-bold text-slate-700 sm:w-44 sm:shrink-0">Nama Indikator Kinerja</label>
              <div class="sm:flex-1">
                <input
                  id="namaIndikator"
                  v-model="form.namaIndikator"
                  type="text"
                  required
                  placeholder="Masukkan nama indikator..."
                  class="field-input"
                />
              </div>
            </div>

            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <label for="satuan" class="block text-sm font-bold text-slate-700 sm:w-44 sm:shrink-0">Satuan</label>
              <div class="sm:flex-1">
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

          <div class="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-6">
            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
              <label class="block text-sm font-bold text-slate-700 sm:w-44 sm:shrink-0 sm:pt-2">Target per Tahun</label>
              <div class="sm:flex-1">
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
const sasaranId = Number(route.query.id);
const fetching = ref(true);
const submitting = ref(false);

const form = ref({
  id: sasaranId,
  sasaranText: '',
  kode: '',
  namaIndikator: '',
  satuan: '',
  targets: years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>)
});

// Load data on mount
onMounted(async () => {
  if (!sasaranId) {
    alert('ID Sasaran Strategis tidak ditemukan.');
    router.push(`/${route.params.slug}/sasaran-strategis`);
    return;
  }

  try {
    fetching.value = true;

    const detail = await $fetch<any>(`/api/sasaran-strategis/${sasaranId}`);
    if (!detail) throw new Error('Data sasaran strategis tidak ditemukan.');

    form.value.kode = detail.kode ?? '';
    form.value.sasaranText = detail.sasaranText ?? '';

    const indikator = detail.indikatorStrategis?.[0] ?? null;
    form.value.namaIndikator = indikator?.nama ?? '';
    form.value.satuan = indikator?.satuan ?? '';

    form.value.targets = years.reduce((acc, y) => ({ ...acc, [y]: '' }), {} as Record<number, string>);
    (indikator?.targets ?? []).forEach((t: { tahun: number; target: string | number | null }) => {
      if (years.includes(t.tahun)) {
        form.value.targets[t.tahun] = t.target?.toString?.() ?? '';
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
  if (!form.value.sasaranText.trim()) {
    alert('Sasaran Strategis wajib diisi.');
    return;
  }

  submitting.value = true;
  
  try {
    const result = await $fetch<any>(`/api/sasaran-strategis/${sasaranId}`, {
      method: 'PUT',
      body: {
        kode: form.value.kode || null,
        sasaranText: form.value.sasaranText,
      }
    });
    
    if (result) {
      router.push(`/${route.params.slug}/sasaran-strategis`);
    } else {
      alert('Gagal menyimpan perubahan.');
    }
  } catch (error) {
    console.error('Error updating data:', error);
    alert('Gagal menyimpan perubahan ke server.');
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus sasaran strategis ini?')) return;
  
  try {
    await $fetch(`/api/sasaran-strategis/${sasaranId}`, {
      method: 'DELETE',
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

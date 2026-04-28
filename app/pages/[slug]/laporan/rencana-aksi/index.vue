<template>
  <div class="space-y-6 max-w-4xl mx-auto pb-10">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h1 class="text-xl font-bold text-slate-800">Laporan Rencana Aksi</h1>
        <p class="text-sm text-slate-500 mt-1">Form pelaporan untuk mengevaluasi pelaksanaan rencana aksi.</p>
      </div>

      <!-- Empty State / List View -->
      <div v-if="!showForm" class="p-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold text-slate-800">Daftar Laporan</h2>
          <button @click="showForm = true" class="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 flex items-center gap-2">
            <IconPlus :size="18" />
            Tambah Laporan
          </button>
        </div>

        <div v-if="loading" class="text-center py-10">
          <div class="inline-block animate-pulse text-slate-500">Memuat data...</div>
        </div>
        <div v-else-if="!laporanList || laporanList.length === 0" class="min-h-[50vh] flex flex-col items-center justify-center bg-white py-10 px-4">
          <div class="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl w-full text-center border border-blue-100 relative overflow-hidden">
            <div class="flex flex-col items-center mb-6">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none" class="mb-4">
                <circle cx="48" cy="48" r="48" fill="#2663A3" fill-opacity="0.08"/>
                <g>
                  <polygon points="48,22 54,40 73,40 57,52 63,70 48,59 33,70 39,52 23,40 42,40" fill="#2663A3"/>
                  <polygon points="48,28 52,40 64,40 54,48 58,60 48,53 38,60 42,48 32,40 44,40" fill="#FBB23B"/>
                </g>
              </svg>
              <h1 class="text-3xl md:text-4xl font-extrabold mb-3 drop-shadow" style="color:#F2BD1D">Data Masih Kosong!</h1>
              <p class="text-lg md:text-xl text-gray-700 font-semibold mb-2">Belum ada laporan <span class="text-[#F2BD1D]">rencana aksi</span></p>
            </div>
            <p class="text-gray-500 text-base md:text-lg mb-8">Silakan klik tombol di bawah untuk membuat laporan pertama Anda.</p>
            <button @click="showForm = true" class="px-8 py-3 bg-[#2663A3] text-white rounded-xl text-base font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20 inline-flex items-center gap-2 relative z-10">
              <IconPlus :size="20" />
              Buat Laporan Baru
            </button>
            <div class="absolute -bottom-8 -right-8 opacity-10 pointer-events-none select-none">
              <svg width="180" height="180" fill="none" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="90" fill="#2663A3" />
              </svg>
            </div>
          </div>
        </div>
        <div v-else class="overflow-x-auto border border-slate-200 rounded-xl">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th class="p-4">Tanggal</th>
                <th class="p-4">Indikator</th>
                <th class="p-4">Rencana Aksi</th>
                <th class="p-4">Capaian</th>
                <th class="p-4">Analisa</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
              <tr v-for="laporan in laporanList" :key="laporan.id" class="hover:bg-slate-50">
                <td class="p-4 font-medium text-slate-900 whitespace-nowrap">{{ new Date(laporan.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</td>
                <td class="p-4 text-xs text-slate-600 max-w-[200px] truncate" :title="getIndikatorNameByRencanaAksi(laporan.rencanaAksiId)">{{ getIndikatorNameByRencanaAksi(laporan.rencanaAksiId) }}</td>
                <td class="p-4 font-semibold text-slate-800 max-w-[200px] truncate" :title="getRencanaAksiName(laporan.rencanaAksiId)">{{ getRencanaAksiName(laporan.rencanaAksiId) }}</td>
                <td class="p-4 font-bold text-amber-600">{{ laporan.capaian }}</td>
                <td class="p-4 max-w-xs truncate" :title="laporan.analisaCapaian">{{ laporan.analisaCapaian }}</td>
                <td class="p-4 text-center">
                  <button @click="handleDelete(laporan.id)" class="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50" title="Hapus">
                    <IconTrash :size="18" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Form View -->
      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-8">
        <!-- Pemetaan Rencana Aksi -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-amber-600 rounded-full"></span>
            Pemetaan Rencana Aksi
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 rounded-xl border border-slate-100">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Indikator Kinerja <span class="text-red-500">*</span></label>
              <select v-model="form.indikatorId" class="field-input" required>
                <option :value="null">-- Pilih Indikator Kinerja --</option>
                <option v-for="ind in indikatorList" :key="ind.id" :value="ind.id">
                  {{ ind.namaIndikator }}
                </option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Rencana Aksi <span class="text-red-500">*</span></label>
              <select v-model="form.rencanaAksiId" class="field-input" :disabled="!form.indikatorId" required>
                <option :value="null">-- Pilih Rencana Aksi --</option>
                <option v-for="ra in filteredRencanaAksiList" :key="ra.id" :value="ra.id">
                  {{ ra.rencanaAksi }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Data Capaian -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-amber-600 rounded-full"></span>
            Data Capaian
          </h2>
          <div class="space-y-2 max-w-md">
            <label class="block text-sm font-medium text-slate-700">Pencapaian (Angka) <span class="text-red-500">*</span></label>
            <input 
              v-model.number="form.capaian" 
              type="number" 
              step="0.01" 
              class="field-input" 
              placeholder="Contoh: 85" 
              required 
            />
            <p class="text-xs text-slate-500">Maksimal 60 digit karakter integer.</p>
          </div>
        </div>

        <hr class="border-slate-100" />

        <!-- Analisa & Evaluasi -->
        <div class="space-y-4">
          <h2 class="text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2">
            <span class="w-1.5 h-4 bg-amber-600 rounded-full"></span>
            Analisa & Evaluasi
          </h2>
          
          <div class="space-y-5">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Analisa Pencapaian <span class="text-red-500">*</span></label>
              <textarea 
                v-model="form.analisaCapaian" 
                rows="4" 
                class="field-input resize-y" 
                placeholder="Jelaskan secara komprehensif mengenai capaian rencana aksi ini..." 
                required 
                minlength="100"
              ></textarea>
              <div class="flex justify-between text-xs text-slate-500">
                <span>Minimal 100 karakter</span>
                <span>{{ form.analisaCapaian.length }} / Min. 100</span>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Analisa Permasalahan <span class="text-red-500">*</span></label>
              <textarea 
                v-model="form.analisaPermasalahan" 
                rows="4" 
                class="field-input resize-y" 
                placeholder="Uraikan kendala, hambatan, atau permasalahan yang dihadapi..." 
                required 
                minlength="100"
              ></textarea>
              <div class="flex justify-between text-xs text-slate-500">
                <span>Minimal 100 karakter</span>
                <span>{{ form.analisaPermasalahan.length }} / Min. 100</span>
              </div>
            </div>

            <div class="space-y-2 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
              <label class="flex items-center gap-2 text-sm font-medium text-amber-900 mb-2">
                <IconChecklist :size="18" />
                Keterangan Rencana Aksi Selanjutnya
                <span class="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">Opsional</span>
              </label>
              <textarea 
                v-model="form.keteranganRencanaAksi" 
                rows="3" 
                class="field-input resize-y bg-white" 
                placeholder="Tambahkan rencana tindak lanjut untuk periode berikutnya jika ada..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <button type="button" @click="showForm = false" class="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
            Batal
          </button>
          <button 
            type="submit" 
            :disabled="submitting || !isFormValid"
            class="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-semibold shadow-lg shadow-amber-600/20 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Simpan Laporan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useSWRV from 'swrv';
import { IconChecklist, IconPlus, IconFileDescription, IconTrash } from '@tabler/icons-vue';

const router = useRouter();
const fetcher = (url: string) => fetch(url).then(r => r.json());

const showForm = ref(false);

const { data: laporanList, isValidating: loading, mutate: mutateLaporan } = useSWRV('/api/laporan-rencana-aksi', fetcher);
const { data: indikatorList } = useSWRV('/api/indikator-kinerja', fetcher);
const { data: rencanaAksiList } = useSWRV('/api/rencana-aksi', fetcher);

const submitting = ref(false);

const form = ref({
  indikatorId: null as number | null,
  rencanaAksiId: null as number | null,
  capaian: null as number | null,
  analisaCapaian: '',
  analisaPermasalahan: '',
  keteranganRencanaAksi: ''
});

const filteredRencanaAksiList = computed(() => {
  if (!form.value.indikatorId || !rencanaAksiList.value) return [];
  return rencanaAksiList.value.filter((ra: any) => ra.indikatorId === form.value.indikatorId);
});

const isFormValid = computed(() => {
  return form.value.rencanaAksiId && 
         form.value.capaian !== null &&
         form.value.analisaCapaian.length >= 100 &&
         form.value.analisaPermasalahan.length >= 100;
});

async function handleSubmit() {
  if (!isFormValid.value) return;
  submitting.value = true;
  
  try {
    const payload = {
      rencanaAksiId: form.value.rencanaAksiId,
      capaian: form.value.capaian,
      analisaCapaian: form.value.analisaCapaian,
      analisaPermasalahan: form.value.analisaPermasalahan,
      keteranganRencanaAksi: form.value.keteranganRencanaAksi
    };

    const res = await $fetch('/api/laporan-rencana-aksi', {
      method: 'POST',
      body: payload
    });
    
    if (res) {
      alert('Laporan berhasil disimpan!');
      // Reset form
      form.value = {
        indikatorId: null,
        rencanaAksiId: null,
        capaian: null,
        analisaCapaian: '',
        analisaPermasalahan: '',
        keteranganRencanaAksi: ''
      };
      showForm.value = false;
      mutateLaporan();
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menyimpan laporan.');
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: number) {
  if (!confirm('Hapus laporan ini?')) return;
  try {
    await $fetch('/api/laporan-rencana-aksi', {
      method: 'DELETE',
      body: { id }
    });
    mutateLaporan();
  } catch (error) {
    console.error(error);
    alert('Gagal menghapus laporan.');
  }
}

function getRencanaAksiName(id: number) {
  if (!rencanaAksiList.value) return '-';
  const match = rencanaAksiList.value.find((r: any) => r.id === id);
  return match ? match.rencanaAksi : '-';
}

function getIndikatorNameByRencanaAksi(id: number) {
  if (!rencanaAksiList.value || !indikatorList.value) return '-';
  const rencana = rencanaAksiList.value.find((r: any) => r.id === id);
  if (!rencana) return '-';
  const indikator = indikatorList.value.find((i: any) => i.id === rencana.indikatorId);
  return indikator ? indikator.namaIndikator : '-';
}
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(214 211 209);
  border-radius: 0.5rem;
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background-color: white;
  transition: all 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: rgb(217 119 6);
  box-shadow: 0 0 0 3px rgb(253 230 138 / 0.5);
}

.field-input:disabled {
  background-color: rgb(241 245 249);
  color: rgb(148 163 184);
  cursor: not-allowed;
}
</style>

<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header Utama -->
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Rencana Aksi</h1>
        <p class="text-sm text-slate-500 mt-1">Rincian rencana aksi dan target capaian.</p>
      </div>

      <!-- Toolbar -->
      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Daftar Rencana Aksi</h2>
        <button
          type="button"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm transition-colors cursor-pointer"
        >
          <IconPlus :size="16" />
          Tambah Rencana Aksi
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center text-slate-500">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p>Memuat data rencana aksi...</p>
      </div>

      <!-- Tabel -->
      <div v-else class="p-5">
        <div class="mb-4 p-2 bg-yellow-100 text-yellow-800 text-xs rounded">DEBUG: Render Table with {{ tableRows.length }} rows</div>
        <Table :columns="columns" :data="tableRows" rowKey="id" :showPagination="false">
          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-1">
              <button
                type="button"
                class="action-btn action-btn-view"
                title="Detail"
                @click="openDetailModal(row)"
              >
                <IconEye :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                class="action-btn action-btn-edit"
                title="Edit"
                @click="openEditModal(row)"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                class="action-btn action-btn-delete"
                title="Hapus"
                @click="handleDelete(row)"
              >
                <IconTrash :size="16" :stroke="'2'" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>

    <!-- Modal: Tambah/Edit Rencana Aksi -->
    <div v-if="showFormModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-slate-900/45" @click="closeFormModal"></div>

      <div class="relative w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 class="text-base font-bold text-slate-800">{{ isEditing ? 'Edit Rencana Aksi' : 'Tambah Rencana Aksi' }}</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 text-xl cursor-pointer" @click="closeFormModal">&times;</button>
        </div>

        <form class="p-6 space-y-5" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Sasaran -->
            <div class="space-y-1">
              <label class="block text-sm font-semibold text-slate-700">Pilih Sasaran</label>
              <select v-model="form.sasaranId" class="field-input" required :disabled="isEditing">
                <option :value="null">-- Pilih Sasaran --</option>
                <option v-for="s in sasaranList" :key="s.id" :value="s.id">{{ s.sasaranText }}</option>
              </select>
            </div>

            <!-- Indikator -->
            <div class="space-y-1">
              <label class="block text-sm font-semibold text-slate-700">Pilih Indikator</label>
              <select v-model="form.indikatorId" class="field-input" required :disabled="isEditing || !form.sasaranId">
                <option :value="null">-- Pilih Indikator --</option>
                <option v-for="i in filteredIndikatorList" :key="i.id" :value="i.id">{{ i.namaIndikator }}</option>
              </select>
            </div>
          </div>

          <!-- Rencana Aksi -->
          <div class="space-y-1">
            <label class="block text-sm font-semibold text-slate-700">Rencana Aksi</label>
            <textarea
              v-model="form.rencanaAksi"
              class="field-input min-h-24"
              placeholder="Jelaskan rencana aksi yang akan dilakukan..."
              required
            ></textarea>
          </div>

          <!-- Target & TW -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-slate-700 uppercase tracking-wider">Target Capaian</label>
            <div class="grid grid-cols-5 gap-3">
              <div v-for="field in targetFields" :key="field.key" class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-400 uppercase text-center">{{ field.label }}</label>
                <input 
                  v-model.number="form[field.key]" 
                  type="number" 
                  step="0.01" 
                  class="field-input !p-2 text-center font-bold text-blue-700" 
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" class="px-5 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-50 cursor-pointer" @click="closeFormModal">
              Batal
            </button>
            <button 
              type="submit" 
              class="px-6 py-2 rounded-lg bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-700/20 hover:bg-blue-800 transition-all flex items-center gap-2 cursor-pointer"
              :disabled="submitting"
            >
              <span v-if="submitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isEditing ? 'Simpan Perubahan' : 'Simpan Data' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Detail View -->
    <div v-if="showDetailModal && activeRow" class="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div class="absolute inset-0 bg-slate-900/45" @click="closeDetailModal"></div>

      <div class="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 class="text-base font-bold text-slate-800">Detail Rencana Aksi</h3>
          <button type="button" class="text-slate-400 hover:text-slate-600 text-xl cursor-pointer" @click="closeDetailModal">&times;</button>
        </div>

        <div class="p-6 space-y-5">
          <div class="space-y-3">
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-widest">Sasaran</span>
              <p class="text-sm font-medium text-slate-700 leading-relaxed">{{ activeRow.sasaran }}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-widest">Indikator</span>
              <p class="text-sm font-bold text-slate-900 leading-relaxed">{{ activeRow.indikator }}</p>
            </div>
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-widest">Rencana Aksi</span>
              <div class="mt-1 p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600">
                {{ activeRow.rencanaAksi }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-5 gap-2 pt-2">
            <div v-for="field in targetFields" :key="field.key" class="detail-metric">
              <div class="detail-metric-label">{{ field.label }}</div>
              <div class="detail-metric-value">{{ activeRow[field.key] || 0 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref, onMounted } from 'vue'
import { IconEye, IconPencil, IconTrash, IconPlus } from '@tabler/icons-vue'
import Table from '../../../components/UI/Table.vue'
import useSWRV from 'swrv'

// Fetchers & Data
const fetcher = (url: string) => fetch(url).then(r => r.json());
const { data: rencanaData, mutate: refreshRencana, isValidating: loading } = useSWRV('/api/rencana-aksi', fetcher);
const { data: sasaranList } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: indikatorList } = useSWRV('/api/indikator-kinerja', fetcher);

const columns = [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaran', label: 'Sasaran' },
  { key: 'indikator', label: 'Indikator' },
  { key: 'rencanaAksi', label: 'Rencana Aksi' },
  { key: 'target', label: 'Target', className: 'text-center w-24' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-28' },
]

const tableRows = computed(() => {
  return (rencanaData.value || []).map((row: any, index: number) => ({
    ...row,
    no: index + 1
  }));
});

const targetFields = [
  { key: 'target', label: 'Total' },
] as const;

// Logic Status
const showFormModal = ref(false)
const showDetailModal = ref(false)
const isEditing = ref(false)
const submitting = ref(false)
const activeRow = ref<any>(null)

const form = ref<any>({
  id: null,
  sasaranId: null,
  indikatorId: null,
  rencanaAksi: '',
  target: 0,
  tw1: 0,
  tw2: 0,
  tw3: 0,
  tw4: 0,
})

// Cascading Select
const filteredIndikatorList = computed(() => {
  if (!form.value.sasaranId || !indikatorList.value) return [];
  return (indikatorList.value as any[]).filter(i => i.sasaranId === form.value.sasaranId);
});

// Modal Actions
function openCreateModal() {
  isEditing.value = false
  form.value = {
    id: null,
    sasaranId: null,
    indikatorId: null,
    rencanaAksi: '',
    target: 0,
    tw1: 0,
    tw2: 0,
    tw3: 0,
    tw4: 0,
  }
  showFormModal.value = true
}

function openEditModal(row: any) {
  isEditing.value = true
  form.value = { ...row }
  showFormModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
}

function openDetailModal(row: any) {
  activeRow.value = row
  showDetailModal.value = true
}

function closeDetailModal() {
  showDetailModal.value = false
}

// Form Handlers
async function handleSubmit() {
  submitting.value = true
  try {
    const method = isEditing.value ? 'PUT' : 'POST'
    const result = await $fetch<any>('/api/rencana-aksi', {
      method,
      body: form.value
    });

    if (result.success) {
      refreshRencana();
      closeFormModal();
    } else {
      alert('Error: ' + result.message);
    }
  } catch (e) {
    console.error(e);
    alert('Terjadi kesalahan saat menyimpan data.');
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: any) {
  if (!confirm(`Hapus rencana aksi \"${row.rencanaAksi}\"?`)) return;
  
  try {
    const result = await $fetch<any>('/api/rencana-aksi', {
      method: 'DELETE',
      body: { id: row.id }
    });

    if (result.success) {
      refreshRencana();
    } else {
      alert('Gagal menghapus: ' + result.message);
    }
  } catch (e) {
    console.error(e);
    alert('Terjadi kesalahan saat menghapus data.');
  }
}
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(214 211 209);
  border-radius: 0.6rem;
  padding: 0.55rem 0.85rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background: white;
  transition: all 0.15s ease;
}

.field-input:focus {
  outline: none;
  border-color: rgb(59 130 246);
  box-shadow: 0 0 0 3px rgb(191 219 254 / 0.5);
}

.field-input:disabled {
  background-color: rgb(248 250 252);
  color: rgb(148 163 184);
  cursor: not-allowed;
}

.detail-metric {
  border: 1px solid rgb(191 219 254);
  background: rgb(239 246 255 / 0.6);
  border-radius: 0.5rem;
  padding: 0.4rem;
  text-align: center;
}

.detail-metric-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: rgb(30 64 175);
  text-transform: uppercase;
}

.detail-metric-value {
  margin-top: 0.1rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(30 58 138);
}

.action-btn {
  height: 1.8rem;
  width: 1.8rem;
  border-radius: 0.5rem;
  border: 1px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
  cursor: pointer;
}

.action-btn-view {
  color: rgb(30 64 175);
  border-color: rgb(191 219 254);
  background-color: rgb(239 246 255);
}

.action-btn-view:hover {
  color: white;
  border-color: rgb(37 99 235);
  background-color: rgb(37 99 235);
}

.action-btn-edit {
  color: rgb(22 101 52);
  border-color: rgb(167 243 208);
  background-color: rgb(236 253 245);
}

.action-btn-edit:hover {
  color: white;
  border-color: rgb(22 163 74);
  background-color: rgb(22 163 74);
}

.action-btn-delete {
  color: rgb(220 38 38);
  border-color: rgb(254 202 202);
  background-color: rgb(254 242 242);
}

.action-btn-delete:hover {
  color: white;
  border-color: rgb(220 38 38);
  background-color: rgb(220 38 38);
}
</style>

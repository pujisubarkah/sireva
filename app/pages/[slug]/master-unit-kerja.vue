<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Master Unit Kerja</h1>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white">
        <div class="flex w-full justify-end">
          <button
            type="button"
            @click="showOrgChart = true"
            class="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm shadow"
          >
            <IconSitemap :size="16" :stroke="'2'" />
            Organization Chart
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-6 text-sm text-slate-500">Memuat data...</div>
      <div v-else-if="errorMessage" class="p-6 text-sm text-red-600">{{ errorMessage }}</div>
      <div v-else class="p-5">
        <Table
          :columns="columns"
          :data="tableRows"
          rowKey="id"
          :showSearch="true"
          :showPagination="true"
          :pageSize="10"
        >
          <template #cell-parent="{ row }">
            <span>{{ row.parent || '-' }}</span>
          </template>

          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-2">
              <button
                type="button"
                @click="openModal(row)"
                :aria-label="`Edit ${row.nama}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                @click="deleteUnitKerja(row.id)"
                :aria-label="`Hapus ${row.nama}`"
                title="Hapus"
                class="action-btn action-btn-delete"
              >
                <IconTrash :size="16" :stroke="'2'" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>

    <!-- Org Chart Modal -->
    <div v-if="showOrgChart" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden" style="height: 90vh; display: flex; flex-direction: column;">
        <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-slate-800">Organization Chart Unit Kerja</h2>
          <button @click="showOrgChart = false" class="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        <div class="flex-1 overflow-hidden">
          <ClientOnly>
            <UIUnitKerjaOrgChart />
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-slate-800">{{ isEdit ? 'Edit Unit Kerja' : 'Input Unit Kerja' }}</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <div class="p-5">
          <form @submit.prevent="saveUnitKerja" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nama Unit Kerja</label>
              <input v-model="formData.nama" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Parent ID (Opsional)</label>
              <input v-model="formData.parentId" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Level (Opsional)</label>
              <input v-model="formData.level" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            
            <div class="flex justify-end gap-2 mt-6">
              <button type="button" @click="closeModal" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref, reactive } from 'vue'
import { IconPencil, IconTrash, IconPlus, IconSitemap } from '@tabler/icons-vue'
import Table from '@/components/UI/Table.vue'

interface UnitKerjaApi {
  id: number
  nama: string | null
  level: number | null
  parentId: number | null
  createdAt: string | null
  updatedAt: string | null
}

interface UnitKerjaRow {
  no: number
  id: number
  nama: string
  parent: string
  aksi: string
}

const columns = [
  { key: 'no', label: 'No.', className: 'text-center w-16' },
  { key: 'nama', label: 'Unit Kerja' },
  { key: 'parent', label: 'Parent Unit' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
]

const showOrgChart = ref(false)

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const { data, error, pending, refresh } = useFetch('/api/unit-kerja', { lazy: true, default: () => [] })

const loading = computed(() => pending.value && !data.value)

const errorMessage = computed(() => {
  if (!error.value) return ''
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data unit kerja.'
})

const units = computed<UnitKerjaApi[]>(() => (Array.isArray(data.value) ? data.value : []))

const tableRows = computed<UnitKerjaRow[]>(() => {
  const byId = new Map<number, UnitKerjaApi>()
  for (const item of units.value) {
    byId.set(item.id, item)
  }

  let mappedRows = units.value.map((item) => ({
    no: 0,
    id: item.id,
    nama: item.nama || '-',
    parent: item.parentId ? byId.get(item.parentId)?.nama || '-' : '-',
    aksi: '',
  }))

  mappedRows.sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }))

  mappedRows = mappedRows.map((item, index) => ({
    ...item,
    no: index + 1
  }))

  return mappedRows
})

// Modal & Form State
const showModal = ref(false)
const isEdit = ref(false)
const isSaving = ref(false)
const formData = reactive({
  id: null as number | null,
  nama: '',
  level: null as number | null,
  parentId: null as number | null
})

function openModal(row?: UnitKerjaRow) {
  isEdit.value = !!row
  if (row) {
    formData.id = row.id
    const originalItem = units.value.find(u => u.id === row.id)
    if (originalItem) {
      formData.nama = originalItem.nama || ''
      formData.level = originalItem.level || null
      formData.parentId = originalItem.parentId || null
    } else {
      formData.nama = row.nama !== '-' ? row.nama : ''
      formData.level = null
      formData.parentId = null
    }
  } else {
    formData.id = null
    formData.nama = ''
    formData.level = null
    formData.parentId = null
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveUnitKerja() {
  if (isSaving.value) return
  isSaving.value = true
  try {
    const response = await fetch('/api/unit-kerja', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.statusMessage || 'Gagal menyimpan data')
    }
    
    closeModal()
    await refresh()
  } catch (err: any) {
    alert(err.message || 'Terjadi kesalahan saat menyimpan data')
  } finally {
    isSaving.value = false
  }
}

async function deleteUnitKerja(id: number) {
  if (!confirm('Apakah Anda yakin ingin menghapus unit kerja ini?')) return
  
  try {
    const response = await fetch('/api/unit-kerja', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.statusMessage || 'Gagal menghapus data')
    }
    
    await refresh()
  } catch (err: any) {
    alert(err.message || 'Terjadi kesalahan saat menghapus data')
  }
}
</script>

<style scoped>
.action-btn {
  height: 1.9rem;
  width: 1.9rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn-edit {
  color: #1d4ed8;
  background: #dbeafe;
  border-color: #bfdbfe;
}

.action-btn-edit:hover {
  color: #fff;
  background: #2563eb;
  border-color: #2563eb;
}

.action-btn-delete {
  color: #b91c1c;
  background: #fee2e2;
  border-color: #fecaca;
}

.action-btn-delete:hover {
  color: #fff;
  background: #dc2626;
  border-color: #dc2626;
}
</style>

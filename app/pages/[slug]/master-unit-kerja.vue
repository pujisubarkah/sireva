gi<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Master Unit Kerja</h1>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white">
        <div class="flex w-full justify-end">
          <button
            type="button"
            class="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm shadow"
          >
            <IconPlus :size="16" :stroke="'2'" />
            Input Unit Kerja
          </button>
        </div>
      </div>

      <div class="p-5">
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
                :aria-label="`Edit ${row.namaUnit}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                :aria-label="`Hapus ${row.namaUnit}`"
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
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-vue'
import Table from '@/components/UI/Table.vue'

interface UnitKerjaRow {
  id: number
  namaUnit: string
  parent: string | null
  aksi: string
}

const columns = [
  { key: 'id', label: 'ID', className: 'text-center w-16' },
  { key: 'namaUnit', label: 'Unit Kerja' },
  { key: 'parent', label: 'Parent Unit' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
]

const tableRows: UnitKerjaRow[] = [
  { id: 1, namaUnit: 'Kantor Pusat', parent: null, aksi: '' },
  { id: 2, namaUnit: 'Divisi SDM', parent: 'Kantor Pusat', aksi: '' },
  { id: 3, namaUnit: 'Divisi Keuangan', parent: 'Kantor Pusat', aksi: '' },
  { id: 4, namaUnit: 'Subdivisi Rekrutmen', parent: 'Divisi SDM', aksi: '' },
  { id: 5, namaUnit: 'Subdivisi Pelatihan', parent: 'Divisi SDM', aksi: '' },
]
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

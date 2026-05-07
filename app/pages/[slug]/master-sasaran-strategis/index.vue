<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Master Sasaran Strategis</h1>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white">
        <div class="flex w-full justify-end">
          <NuxtLink
            :to="`/${route.params.slug}/master-sasaran-strategis/add`"
            class="bg-[#2663A3] hover:bg-blue-700 text-white font-bold rounded-xl px-6 py-2.5 inline-flex items-center gap-2 text-sm shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <IconPlus :size="18" stroke-width="3" />
            Input Sasaran Strategis
          </NuxtLink>
        </div>
      </div>

      <div v-if="loading" class="p-6 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
        <div class="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        Memuat data...
      </div>
      <div v-else-if="errorMessage" class="p-6 text-sm text-red-600 text-center">{{ errorMessage }}</div>
      <div v-else class="p-5">
        <Table
          :columns="columns"
          :data="tableRows"
          rowKey="id"
          :showSearch="true"
          :showPagination="true"
          :pageSize="10"
        >
          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-2">
              <NuxtLink
                :to="`/${route.params.slug}/master-sasaran-strategis/view?id=${row.id}`"
                :aria-label="`Lihat ${row.kode}`"
                title="Lihat Detail"
                class="action-btn action-btn-view"
              >
                <IconEye :size="16" :stroke="'2'" />
              </NuxtLink>
              <NuxtLink
                :to="`/${route.params.slug}/master-sasaran-strategis/edit?id=${row.id}`"
                :aria-label="`Edit ${row.kode}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </NuxtLink>
               <button
                type="button"
                @click="handleDelete(row.id)"
                :aria-label="`Hapus ${row.kode}`"
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

import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconPencil, IconTrash, IconPlus, IconEye } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';

const router = useRouter();
const route = useRoute();

interface SasaranStrategisApi {
  id: number;
  kode: string | null;
  sasaranText: string;
  unitKerjaId: number | null;
  ownerUnitName?: string;
}

interface SasaranRow {
  id: number;
  kode: string;
  sasaran: string;
  unit_kerja: string;
  aksi: string;
}

const columns = [
  { key: 'id', label: 'ID', className: 'text-center w-16' },
  { key: 'kode', label: 'Kode', className: 'w-32' },
  { key: 'sasaran', label: 'Sasaran Strategis' },
  { key: 'unit_kerja', label: 'Unit Kerja', className: 'w-64' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const { data, error, isValidating, mutate } = useSWRV<SasaranStrategisApi[]>('/api/sasaran-strategis', fetcher);

const loading = computed(() => isValidating.value && !data.value);

const errorMessage = computed(() => {
  if (!error.value) return '';
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data sasaran strategis.';
});

const tableRows = computed<SasaranRow[]>(() => {
  if (!data.value) return [];
  
  // The API returns one row per indicator, so we need to group by ssId for the master list
  const source = Array.isArray(data.value) ? data.value : [];
  const uniqueMap = new Map<number, SasaranRow>();

  source.forEach((item: any) => {
    if (!uniqueMap.has(item.ssId)) {
      uniqueMap.set(item.ssId, {
        id: item.ssId,
        kode: item.kode || '-',
        sasaran: item.sasaranText || '-',
        unit_kerja: item.ownerUnitName || 'Global / Semua Unit',
        aksi: '',
      });
    }
  });
  
  return Array.from(uniqueMap.values());
});

const handleDelete = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
  
  try {
    await $fetch(`/api/sasaran-strategis/${id}`, {
      method: 'DELETE'
    });
    // Revalidate data
    mutate();
  } catch (error) {
    console.error('Error deleting:', error);
    alert('Gagal menghapus data.');
  }
};
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

.action-btn-view {
  color: #059669;
  background: #ecfdf5;
  border-color: #d1fae5;
}

.action-btn-view:hover {
  color: #fff;
  background: #10b981;
  border-color: #10b981;
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

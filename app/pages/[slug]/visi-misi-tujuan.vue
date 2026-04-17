<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Visi, Misi &amp; Tujuan</h1>
        <p class="text-sm text-slate-500 mt-1">Fondasi arah kebijakan dan landasan perencanaan strategis LAN RI.</p>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Daftar Visi, Misi, dan Tujuan</h2>
        <button
          type="button"
          class="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm shadow"
        >
          <IconPlus :size="16" :stroke="'2'" />
          Input Visi, Misi &amp; Tujuan
        </button>
      </div>

      <div v-if="loading" class="p-6 text-sm text-slate-500">Memuat data...</div>
      <div v-else-if="errorMessage" class="p-6 text-sm text-red-600">{{ errorMessage }}</div>
      <div v-else class="p-5">
        <Table :columns="columns" :data="tableRows" rowKey="id" :showPagination="false">
          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center">
              <button
                type="button"
                :aria-label="`Lihat ${row.visi}`"
                title="Lihat"
                class="action-btn-view"
              >
                <IconEye :size="16" :stroke="'2'" />
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
import useSWRV from 'swrv';
import { IconEye, IconPlus } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';

interface Visi {
  id: number;
  visiText: string;
}

interface Misi {
  id: number;
  visiId: number | null;
  misiText: string;
}

interface Tujuan {
  id: number;
  misiId: number | null;
  tujuanText: string;
}

interface TableRow {
  id: string;
  no: number;
  visi: string;
  misi: string;
  tujuan: string;
  aksi: string;
}

const columns = [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'visi', label: 'Visi' },
  { key: 'misi', label: 'Misi' },
  { key: 'tujuan', label: 'Tujuan' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-20' },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const { data: visiRes, isValidating: visiLoading, error: visiError } = useSWRV('/api/visi', fetcher);
const { data: misiRes, isValidating: misiLoading, error: misiError } = useSWRV('/api/misi', fetcher);
const { data: tujuanRes, isValidating: tujuanLoading, error: tujuanError } = useSWRV('/api/tujuan', fetcher);

const loading = computed(() => visiLoading.value || misiLoading.value || tujuanLoading.value);

const errorMessage = computed(() => {
  const err = visiError.value || misiError.value || tujuanError.value;
  if (!err) return '';
  return err instanceof Error ? err.message : 'Gagal memuat data visi, misi, dan tujuan.';
});

const tableRows = computed<TableRow[]>(() => {
  const visiData: Visi[] = Array.isArray(visiRes.value?.data) ? visiRes.value.data : [];
  const misiData: Misi[] = Array.isArray(misiRes.value) ? misiRes.value : [];
  const tujuanData: Tujuan[] = Array.isArray(tujuanRes.value) ? tujuanRes.value : [];

  const rows: Omit<TableRow, 'no'>[] = visiData.flatMap((visiItem) => {
    const misiByVisi = misiData.filter((m) => m.visiId === visiItem.id);

    if (!misiByVisi.length) {
      return [{
        id: `visi-${visiItem.id}`,
        visi: visiItem.visiText || '-',
        misi: '-',
        tujuan: '-',
        aksi: '',
      }];
    }

    return misiByVisi.flatMap((misiItem) => {
      const tujuanByMisi = tujuanData.filter((t) => t.misiId === misiItem.id);

      if (!tujuanByMisi.length) {
        return [{
          id: `misi-${misiItem.id}`,
          visi: visiItem.visiText || '-',
          misi: misiItem.misiText || '-',
          tujuan: '-',
          aksi: '',
        }];
      }

      return tujuanByMisi.map((tujuanItem) => ({
        id: `tujuan-${tujuanItem.id}`,
        visi: visiItem.visiText || '-',
        misi: misiItem.misiText || '-',
        tujuan: tujuanItem.tujuanText || '-',
        aksi: '',
      }));
    });
  });

  return rows.map((row, index) => ({
    ...row,
    no: index + 1,
  }));
});
</script>

<style scoped>
.action-btn-view {
  height: 1.9rem;
  width: 1.9rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(191 219 254);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgb(30 64 175);
  background-color: rgb(239 246 255);
  transition: all 0.15s ease;
}

.action-btn-view:hover {
  color: rgb(255 255 255);
  border-color: rgb(37 99 235);
  background-color: rgb(37 99 235);
}
</style>

<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Master Sasaran Kegiatan</h1>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white">
        <div class="flex w-full justify-end">
          <NuxtLink
            :to="`/${route.params.slug}/master-sasaran-kegiatan/add`"
            class="bg-[#2663A3] hover:bg-blue-700 text-white font-bold rounded-xl px-6 py-2.5 inline-flex items-center gap-2 text-sm shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <IconPlus :size="18" stroke-width="3" />
            Input Sasaran Kegiatan
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
                :to="`/${route.params.slug}/master-sasaran-kegiatan/view?id=${row.id}`"
                :aria-label="`View ${row.kode}`"
                title="View"
                class="action-btn action-btn-view"
              >
                <IconEye :size="16" />
              </NuxtLink>
              <NuxtLink
                :to="`/${route.params.slug}/master-sasaran-kegiatan/edit?id=${row.id}`"
                :aria-label="`Edit ${row.kode}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" />
              </NuxtLink>
              <button
                type="button"
                @click="handleDelete(row.id)"
                :aria-label="`Hapus ${row.kode}`"
                title="Hapus"
                class="action-btn action-btn-delete"
              >
                <IconTrash :size="16" />
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
import { useToast } from '#imports'

const router = useRouter();
const route = useRoute();
const toast = useToast();

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const { data, error, isValidating, mutate } = useSWRV<any>('/api/sasaran-kegiatan', fetcher);

const loading = computed(() => isValidating.value && !data.value);

const errorMessage = computed(() => {
  if (!error.value) return '';
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data sasaran kegiatan.';
});

const tableRows = computed(() => {
  if (!data.value) return [];
  const source = Array.isArray(data.value) ? data.value : (data.value?.data || []);
  // Deduplicate by id (leftJoin indikator can produce multiple rows per SK)
  const seen = new Set<number>();
  const unique = source.filter((item: any) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
  return unique.map((item: any, index: number) => ({
    id: item.id,
    nomor: index + 1,
    kode: item.kode || item.kodeSk || '-',
    sasaran: item.sasaranText || item.sasaran_kegiatan_text || item.namaSk || '-',
    aksi: '',
  }));
});

const columns = [
  { key: 'nomor', label: 'No.', className: 'text-center w-12' },
  { key: 'kode', label: 'Kode', className: 'w-32' },
  { key: 'sasaran', label: 'Sasaran Kegiatan' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-32' },
];

const handleDelete = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus data master sasaran kegiatan ini?')) return
  try {
    const res = await $fetch<any>(`/api/sasaran-kegiatan/${id}`, { method: 'DELETE' })
    if (res?.success === false) {
      toast.error(res.message || 'Gagal menghapus data master.')
      return
    }
    toast.success('Data master berhasil dihapus.')
    mutate()
  } catch (error: any) {
    const msg = error?.data?.message || error?.message || 'Gagal menghapus data master.'
    toast.error(msg)
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
.action-btn-view { color: #2663A3; background: #eff6ff; border-color: #dbeafe; }
.action-btn-view:hover { color: #fff; background: #2663A3; border-color: #2663A3; }
.action-btn-edit { color: #1d4ed8; background: #dbeafe; border-color: #bfdbfe; }
.action-btn-edit:hover { color: #fff; background: #2563eb; border-color: #2563eb; }
.action-btn-delete { color: #b91c1c; background: #fee2e2; border-color: #fecaca; }
.action-btn-delete:hover { color: #fff; background: #dc2626; border-color: #dc2626; }
</style>

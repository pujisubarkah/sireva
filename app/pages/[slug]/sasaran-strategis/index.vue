<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-10">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Sasaran Strategis</h1>
          <p class="text-sm text-slate-500 mt-1">Daftar sasaran strategis berdasarkan data master.</p>
        </div>
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
          class="w-full sm:w-auto px-5 py-2.5 bg-[#2663A3] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition-all"
        >
          <IconPlus :size="18" :stroke="'2'" />
          Tambah Sasaran Strategis
        </button>
      </div>

      <div class="px-6 py-4 bg-white border-b border-slate-200 flex flex-col md:flex-row items-center gap-4">
        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch class="w-4 h-4 text-slate-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kode atau sasaran strategis..."
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div class="inline-block animate-pulse text-slate-500 font-medium">Memuat data sasaran strategis...</div>
    </div>
    
    <div v-else-if="!filteredRows || filteredRows.length === 0" class="min-h-[40vh] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm py-16 px-4">
      <div class="flex flex-col items-center text-center">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" class="mb-4">
          <circle cx="48" cy="48" r="48" fill="#2663A3" fill-opacity="0.08"/>
          <g>
            <polygon points="48,22 54,40 73,40 57,52 63,70 48,59 33,70 39,52 23,40 42,40" fill="#2663A3"/>
            <polygon points="48,28 52,40 64,40 54,48 58,60 48,53 38,60 42,48 32,40 44,40" fill="#FBB23B"/>
          </g>
        </svg>
        <h2 class="text-2xl font-bold mb-2 text-slate-800">Data Tidak Ditemukan</h2>
        <p class="text-slate-500 max-w-md">Belum ada sasaran strategis yang terdaftar atau pencarian tidak cocok dengan data apapun.</p>
        <button
          @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
          class="mt-6 px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors inline-flex items-center gap-2"
        >
          <IconPlus :size="18" />
          Buat Data Baru
        </button>
      </div>
    </div>

    <div v-else-if="filteredRows.length > 0" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-16 text-center">No</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-28">Kode</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-55">Sasaran Strategis</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-55">Indikator Kinerja</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-28">Satuan</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-40">Target</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-36 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(row, index) in filteredRows"
              :key="`${row.ssId}-${row.indikatorId ?? index}`"
              :class="index % 2 === 0 ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/60 hover:bg-blue-100/60'"
              class="transition-colors"
            >
              <td class="p-4 text-center align-top">
                <span class="text-sm font-bold text-slate-400">{{ index + 1 }}</span>
              </td>
              <td class="p-4 align-top">
                <span class="text-xs font-black text-blue-600 uppercase tracking-tight">{{ row.kode || '-' }}</span>
              </td>
              <td class="p-4 align-top">
                <p class="text-sm font-semibold text-slate-700 leading-snug">{{ row.sasaranText }}</p>
              </td>
              <td class="p-4 align-top">
                <p class="text-sm text-slate-700 leading-snug">{{ row.indikatorNama || '-' }}</p>
              </td>
              <td class="p-4 align-top">
                <span class="text-sm text-slate-600">{{ row.indikatorSatuan || '-' }}</span>
              </td>
              <td class="p-4 align-top">
                <div class="flex flex-col gap-1">
                  <span
                    v-for="t in row.targets"
                    :key="t.tahun"
                    class="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {{ t.tahun }}: {{ t.target }}
                  </span>
                </div>
              </td>
              <td class="p-4 text-center align-top">
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="router.push(`/${$route.params.slug}/sasaran-strategis/view?id=${row.ssId}`)"
                    class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <IconEye :size="18" />
                  </button>
                  <button
                    @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${row.ssId}`)"
                    class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <IconPencil :size="18" />
                  </button>
                  <button
                    @click="handleDelete(row)"
                    class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <IconTrash :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconEye, IconPencil, IconPlus, IconTrash, IconSearch } from '@tabler/icons-vue';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const router = useRouter();
useRoute();

const searchQuery = ref('');

type TargetItem = { tahun: number; target: number | string | null };

type FlatRow = {
  ssId: number;
  kode: string | null;
  sasaranText: string;
  indikatorId: number | null;
  indikatorNama: string | null;
  indikatorSatuan: string | null;
  targets: TargetItem[];
};

const { data: sasaranRes, isValidating: loading, mutate: mutateSasaran } = useSWRV('/api/sasaran-strategis', fetcher);

const filteredRows = computed<FlatRow[]>(() => {
  const rows: FlatRow[] = ((sasaranRes.value ?? []) as FlatRow[]);
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) =>
    (row.kode ?? '').toLowerCase().includes(q) ||
    row.sasaranText.toLowerCase().includes(q) ||
    (row.indikatorNama ?? '').toLowerCase().includes(q)
  );
});

async function handleDelete(item: FlatRow) {
  if (!confirm(`Apakah Anda yakin ingin menghapus sasaran "${item.sasaranText}"? Data yang dihapus tidak dapat dikembalikan.`)) return;

  try {
    const result = await $fetch<any>(`/api/sasaran-strategis/${item.ssId}`, {
      method: 'DELETE',
    });

    if (result) {
      mutateSasaran();
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menghapus data.');
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Header Utama -->
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Sasaran Strategis</h1>
        <p class="text-sm text-slate-500 mt-1">Ringkasan indikator dan capaian per tahun.</p>
      </div>

      <!-- Toolbar dengan Tombol Tambah -->
      <div class="px-5 py-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3">
        <h2 class="text-sm font-semibold text-slate-700">Daftar Sasaran Strategis</h2>
        <div class="flex items-center gap-3">
          <FilterDropdown
            v-model="selectedYear"
            :options="yearOptions"
            :icon="IconCalendarEvent"
          />
          <button
            type="button"
            @click="router.push(`/${$route.params.slug}/sasaran-strategis/add`)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow text-sm transition-colors cursor-pointer"
          >
            <IconPlus :size="16" :stroke="'2'" />
            Tambah Sasaran Strategis
          </button>
        </div>
      </div>

      <!-- Konten Tabel -->
      <div v-if="loading" class="p-6 text-sm text-slate-500 text-center">
        <div class="inline-block animate-pulse">Memuat data...</div>
      </div>
      <div v-else-if="!tableRows.length" class="p-6 text-sm text-slate-500 text-center italic">Data belum tersedia.</div>

      <div v-else class="overflow-x-auto">
        <div style="min-width: 1200px;" class="p-5">
          <Table :columns="columns" :data="tableRows" :showPagination="false" rowKey="id">
            <!-- Template Custom untuk Target Renstra -->
            <template #cell-targetRenstra="{ row }">
              <div class="metric-card metric-card-blue">
                <div v-for="year in years" :key="`tr-${row.id}-${year}`" class="metric-row metric-row-blue">
                  <span class="metric-year metric-year-blue">{{ year }}</span>
                  <span class="metric-value metric-value-blue">{{ row.targetRenstra[year] }}</span>
                </div>
              </div>
            </template>


            <!-- Template Custom untuk Aksi -->
            <template #cell-aksi="{ row }">
              <div class="flex items-center justify-center gap-2">
                <button 
                  type="button"
                  @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${row.id}`)"
                  title="Edit" 
                  class="action-btn action-btn-edit"
                >
                  <IconPencil :size="16" :stroke="'2'" />
                </button>
                <button 
                  type="button" 
                  @click="router.push(`/${$route.params.slug}/sasaran-strategis/view?id=${row.id}`)"
                  :aria-label="`Lihat ${row.indikatorKinerja}`" 
                  title="Lihat" 
                  class="action-btn action-btn-view"
                >
                  <IconEye :size="16" :stroke="'2'" />
                </button>
                <button 
                  type="button" 
                  @click="handleDelete(row)"
                  :aria-label="`Hapus ${row.indikatorKinerja}`" 
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
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Halaman Index Sasaran Strategis
 * Menampilkan daftar sasaran strategis beserta indikator dan capaian multi-tahun.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import useSWRV from 'swrv';
import { IconEye, IconPencil, IconPlus, IconTrash, IconCalendarEvent } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';

const router = useRouter();
const route = useRoute();

// Konfigurasi tahun yang ditampilkan (tahun berjalan)
const selectedYear = ref(String(new Date().getFullYear()));
const yearOptions = ['2025', '2026', '2027', '2028', '2029'];

const years = computed(() => [Number(selectedYear.value)]);

type YearValue = Record<number, string>;

interface TableRow {
  id: number;
  no: number;
  sasaranStrategis: string;
  indikatorKinerja: string;
  targetRenstra: YearValue;

  aksi: string;
}

const columns = computed(() => [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaranStrategis', label: 'Sasaran Strategis' },
  { key: 'indikatorKinerja', label: 'Indikator Kinerja' },
  { key: 'targetRenstra', label: `Target Kinerja Renstra (${selectedYear.value})` },

  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
]);

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Mengambil data dari berbagai API
const { data: sasaranRes, isValidating: sasLoading } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: indikatorRes, isValidating: indikLoading, mutate: mutateIndikator } = useSWRV('/api/indikator-kinerja', fetcher);
const { data: targetRes, isValidating: targetLoading } = useSWRV('/api/target-indikator', fetcher);
const { data: tahunRes, isValidating: tahunLoading } = useSWRV('/api/tahun', fetcher);

// Status loading gabungan
const loading = computed(() => sasLoading.value || indikLoading.value || targetLoading.value || tahunLoading.value);

/**
 * Memetakan hasil API ke dalam struktur yang sesuai untuk tabel.
 */
const tableRows = computed<TableRow[]>(() => {
  if (loading.value) return [];
  if (!sasaranRes.value || !indikatorRes.value || !targetRes.value || !tahunRes.value) return [];

  type Sasaran = { id: number; sasaranText: string };
  type Indikator = { id: number; sasaranId: number; namaIndikator: string };
  type Target = { indikatorId: number; tahunId: number | null; target: string | number | null };
  type Tahun = { id: number; tahun: number };

  // Map sasaran berdasarkan ID
  const sasaranMap: Record<number, Sasaran> = (sasaranRes.value as Sasaran[]).reduce((acc: Record<number, Sasaran>, s: Sasaran) => {
    acc[s.id] = s;
    return acc;
  }, {});

  // Map tahun berdasarkan ID
  const tahunMap: Record<number, number> = (tahunRes.value as Tahun[]).reduce((acc: Record<number, number>, item: Tahun) => {
    acc[item.id] = item.tahun;
    return acc;
  }, {});

  // Map target berdasarkan kombinasi Indikator ID dan Tahun
  const targetMap: Record<string, string> = {};
  (targetRes.value as Target[]).forEach((target) => {
    const tahun = target.tahunId ? tahunMap[target.tahunId] : undefined;
    if (tahun) {
      targetMap[`${target.indikatorId}-${tahun}`] = target.target ? String(target.target) : '-';
    }
  });

  return (indikatorRes.value as Indikator[]).map((indikator, index) => {
    const sasaran = sasaranMap[indikator.sasaranId];
    if (!sasaran) return null;
    return {
      id: indikator.id,
      no: index + 1,
      sasaranStrategis: sasaran.sasaranText,
      indikatorKinerja: indikator.namaIndikator,
      targetRenstra: years.value.reduce((acc, y) => ({ ...acc, [y]: targetMap[`${indikator.id}-${y}`] || '-' }), {} as YearValue),

      aksi: '',
    };
  }).filter((row): row is TableRow => Boolean(row));
});

async function handleDelete(row: TableRow) {
  if (!confirm(`Hapus target sasaran strategis "${row.indikatorKinerja}"?`)) return;
  
  try {
    const result = await $fetch<any[]>('/api/indikator-kinerja', {
      method: 'DELETE',
      body: { id: row.id }
    });

    if (result) {
      mutateIndikator();
    }
  } catch (error) {
    console.error(error);
    alert('Terjadi kesalahan saat menghapus data.');
  }
}
</script>

<style scoped>
/* Styling Kartu Metrik (Target/Capaian) */
.metric-card {
  border-radius: 0.5rem;
  border: 1px solid;
  padding: 0.5rem;
}

.metric-card-blue {
  border-color: rgb(191 219 254);
  background-color: rgb(239 246 255 / 0.5);
}

.metric-card-emerald {
  border-color: rgb(167 243 208);
  background-color: rgb(236 253 245 / 0.5);
}

.metric-card-slate {
  border-color: rgb(203 213 225);
  background-color: rgb(248 250 252 / 0.5);
}

.metric-card-amber {
  border-color: rgb(253 230 138);
  background-color: rgb(255 251 235 / 0.5);
}

/* Styling Baris didalam Kartu Metrik */
.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.35rem 0;
  border-bottom: 1px solid;
}

.metric-row:last-child {
  border-bottom: none;
}

.metric-row-blue { border-bottom-color: rgb(191 219 254); }
.metric-row-emerald { border-bottom-color: rgb(167 243 208); }
.metric-row-slate { border-bottom-color: rgb(203 213 225); }
.metric-row-amber { border-bottom-color: rgb(253 230 138); }

/* Styling Detail Metrik */
.metric-year {
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-year-blue { color: rgb(30 64 175); }
.metric-year-emerald { color: rgb(6 95 70); }
.metric-year-slate { color: rgb(51 65 85); }
.metric-year-amber { color: rgb(146 64 14); }

.metric-value {
  font-size: 0.875rem;
  font-weight: 700;
}

.metric-value-blue { color: rgb(30 58 138); }
.metric-value-emerald { color: rgb(6 78 59); }
.metric-value-slate { color: rgb(15 23 42); }
.metric-value-amber { color: rgb(120 53 15); }

/* Styling Tombol Aksi */
.action-btn {
  height: 1.9rem;
  width: 1.9rem;
  border-radius: 0.5rem;
  border: 1px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  cursor: pointer;
}

.action-btn-edit {
  color: rgb(22 101 52);
  border-color: rgb(167 243 208);
  background-color: rgb(236 253 245);
}

.action-btn-edit:hover {
  color: rgb(255 255 255);
  border-color: rgb(22 163 74);
  background-color: rgb(22 163 74);
}

.action-btn-view {
  color: rgb(30 64 175);
  border-color: rgb(191 219 254);
  background-color: rgb(239 246 255);
}

.action-btn-view:hover {
  color: rgb(255 255 255);
  border-color: rgb(37 99 235);
  background-color: rgb(37 99 235);
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

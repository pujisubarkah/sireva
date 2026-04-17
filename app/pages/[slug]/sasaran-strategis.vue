<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Sasaran Strategis</h1>
        <p class="text-sm text-slate-500 mt-1">Ringkasan indikator dan capaian per tahun.</p>
      </div>

      <div v-if="loading" class="p-6 text-sm text-slate-500">Memuat data...</div>
      <div v-else-if="!tableRows.length" class="p-6 text-sm text-slate-500">Data belum tersedia.</div>

      <div v-else class="overflow-x-auto">
        <div style="min-width: 1200px;">
          <Table :columns="columns" :data="tableRows" :showPagination="false" rowKey="id">
            <template #cell-targetRenstra="{ row }">
              <div class="metric-card metric-card-blue">
                <div v-for="year in years" :key="`tr-${row.id}-${year}`" class="metric-row metric-row-blue">
                  <span class="metric-year metric-year-blue">{{ year }}</span>
                  <span class="metric-value metric-value-blue">{{ row.targetRenstra[year] }}</span>
                </div>
              </div>
            </template>

            <template #cell-targetPerjanjian="{ row }">
              <div class="metric-card metric-card-emerald">
                <div v-for="year in years" :key="`tp-${row.id}-${year}`" class="metric-row metric-row-emerald">
                  <span class="metric-year metric-year-emerald">{{ year }}</span>
                  <span class="metric-value metric-value-emerald">{{ row.targetPerjanjian[year] }}</span>
                </div>
              </div>
            </template>

            <template #cell-capaian="{ row }">
              <div class="metric-card metric-card-slate">
                <div v-for="year in years" :key="`cp-${row.id}-${year}`" class="metric-row metric-row-slate">
                  <span class="metric-year metric-year-slate">{{ year }}</span>
                  <span class="metric-value metric-value-slate">{{ row.capaian[year] }}</span>
                </div>
              </div>
            </template>

            <template #cell-persentase="{ row }">
              <div class="metric-card metric-card-amber">
                <div v-for="year in years" :key="`ps-${row.id}-${year}`" class="metric-row metric-row-amber">
                  <span class="metric-year metric-year-amber">{{ year }}</span>
                  <span class="metric-value metric-value-amber">{{ row.persentase[year] }}</span>
                </div>
              </div>
            </template>

            <template #cell-aksi="{ row }">
              <div class="flex items-center justify-center gap-2 pt-1">
                <button type="button" :aria-label="`Edit ${row.indikatorKinerja}`" title="Edit" class="action-btn action-btn-edit">
                  <IconPencil :size="16" :stroke="'2'" />
                </button>
                <button type="button" :aria-label="`Lihat ${row.indikatorKinerja}`" title="Lihat" class="action-btn action-btn-view">
                  <IconEye :size="16" :stroke="'2'" />
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
definePageMeta({ layout: 'dashboard' })

import { computed } from 'vue';
import useSWRV from 'swrv';
import { IconEye, IconPencil } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';

const years = [2025, 2026, 2027, 2028, 2029];

type YearValue = Record<number, string>;

interface TableRow {
  id: number;
  no: number;
  sasaranStrategis: string;
  indikatorKinerja: string;
  targetRenstra: YearValue;
  targetPerjanjian: YearValue;
  capaian: YearValue;
  persentase: YearValue;
  aksi: string;
}

const columns = [
  { key: 'no', label: 'No', className: 'text-center w-14' },
  { key: 'sasaranStrategis', label: 'Sasaran Strategis' },
  { key: 'indikatorKinerja', label: 'Indikator Kinerja' },
  { key: 'targetRenstra', label: 'Target Kinerja Renstra' },
  { key: 'targetPerjanjian', label: 'Target Kinerja Perjanjian' },
  { key: 'capaian', label: 'Capaian' },
  { key: 'persentase', label: 'Persentase' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
];

const fetcher = (url: string) => fetch(url).then(r => r.json());

const { data: sasaranRes, isValidating: sasLoading } = useSWRV('/api/sasaran-strategis', fetcher);
const { data: indikatorRes, isValidating: indikLoading } = useSWRV('/api/indikator-kinerja', fetcher);
const { data: targetRes, isValidating: targetLoading } = useSWRV('/api/target-indikator', fetcher);
const { data: tahunRes, isValidating: tahunLoading } = useSWRV('/api/tahun', fetcher);

const loading = computed(() => sasLoading.value || indikLoading.value || targetLoading.value || tahunLoading.value);

const tableRows = computed<TableRow[]>(() => {
  if (loading.value) return [];
  if (!sasaranRes.value || !indikatorRes.value || !targetRes.value || !tahunRes.value) return [];

  type Sasaran = { id: number; sasaranText: string };
  type Indikator = { id: number; sasaranId: number; namaIndikator: string };
  type Target = { indikatorId: number; tahunId: number | null; target: string | number | null };
  type Tahun = { id: number; tahun: number };

  const sasaranMap: Record<number, Sasaran> = (sasaranRes.value as Sasaran[]).reduce((acc: Record<number, Sasaran>, s: Sasaran) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const tahunMap: Record<number, number> = (tahunRes.value as Tahun[]).reduce((acc: Record<number, number>, item: Tahun) => {
    acc[item.id] = item.tahun;
    return acc;
  }, {});

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
      targetRenstra: years.reduce((acc, y) => ({ ...acc, [y]: targetMap[`${indikator.id}-${y}`] || '-' }), {} as YearValue),
      targetPerjanjian: years.reduce((acc, y) => ({ ...acc, [y]: '-' }), {} as YearValue),
      capaian: years.reduce((acc, y) => ({ ...acc, [y]: '-' }), {} as Record<number, string>),
      persentase: years.reduce((acc, y) => ({ ...acc, [y]: '-' }), {} as Record<number, string>),
      aksi: '',
    };
  }).filter((row): row is TableRow => Boolean(row));
});
</script>

<style scoped>
.metric-card {
  border-radius: 0.5rem;
  border: 1px solid;
  padding: 0.5rem;
}

.metric-card-blue {
  border-color: rgb(191 219 254);
  background-color: rgb(239 246 255);
}

.metric-card-emerald {
  border-color: rgb(167 243 208);
  background-color: rgb(236 253 245);
}

.metric-card-slate {
  border-color: rgb(203 213 225);
  background-color: rgb(248 250 252);
}

.metric-card-amber {
  border-color: rgb(253 230 138);
  background-color: rgb(255 251 235);
}

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

.metric-row-blue {
  border-bottom-color: rgb(191 219 254);
}

.metric-row-emerald {
  border-bottom-color: rgb(167 243 208);
}

.metric-row-slate {
  border-bottom-color: rgb(203 213 225);
}

.metric-row-amber {
  border-bottom-color: rgb(253 230 138);
}

.metric-year {
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-year-blue {
  color: rgb(30 64 175);
}

.metric-year-emerald {
  color: rgb(6 95 70);
}

.metric-year-slate {
  color: rgb(51 65 85);
}

.metric-year-amber {
  color: rgb(146 64 14);
}

.metric-value {
  font-size: 0.875rem;
  font-weight: 700;
}

.metric-value-blue {
  color: rgb(30 58 138);
}

.metric-value-emerald {
  color: rgb(6 78 59);
}

.metric-value-slate {
  color: rgb(15 23 42);
}

.metric-value-amber {
  color: rgb(120 53 15);
}

.action-btn {
  height: 1.9rem;
  width: 1.9rem;
  border-radius: 0.5rem;
  border: 1px solid;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
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
</style>

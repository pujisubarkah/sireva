<template>
  <div v-if="loading" class="w-full overflow-x-auto py-10 px-4 flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
    <div class="flex flex-col items-center space-y-4">
      <div class="h-20 w-full max-w-2xl bg-gray-300 rounded-2xl animate-pulse" />
      <div class="w-1 h-10 bg-gray-300" />
      <div class="w-96 h-64 bg-gray-200 rounded-xl animate-pulse" />
      <div class="w-1 h-10 bg-gray-300" />
      <div class="h-12 min-w-70 bg-gray-300 rounded-2xl animate-pulse" />
    </div>
  </div>
  <div v-else-if="!sasaranData.length || !indikatorData.length" class="w-full overflow-x-auto py-10 px-4 flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100">
    <div class="text-center text-gray-500 py-20">No performance data available</div>
  </div>
  <div v-else class="w-full overflow-x-auto py-10 px-4 space-y-12">
    <div v-for="(sasaran, index) in sasaranData" :key="sasaran.id" class="flex justify-center bg-slate-50/50 rounded-2xl border border-slate-100 py-10 px-4">
      <div class="flex flex-col items-center">
        <!-- Top Node -->
        <div class="bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20 px-8 py-4 w-full max-w-2xl text-center z-10 relative">
          <h2 class="text-xl md:text-2xl font-bold tracking-wide">{{ sasaran.sasaranText }}</h2>
        </div>
        <div class="w-1 h-10 bg-slate-300"></div>
        <div class="flex flex-col md:flex-row items-center md:items-stretch relative">
          <!-- Indikator Tabs -->
          <div v-if="(indikatorBySasaran[sasaran.id] ?? []).length > 1" class="w-full max-w-sm mb-4 flex bg-slate-100 rounded-xl p-1">
            <button
              v-for="(ind, idx) in indikatorBySasaran[sasaran.id]"
              :key="ind.id"
              @click="setActiveIndikatorIndex(sasaran.id, idx)"
              :class="[
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                idx === (activeIndikatorIndexes[sasaran.id] ?? 0)
                  ? 'bg-white shadow-sm text-slate-800'
                  : 'text-slate-500 hover:text-slate-700'
              ]"
            >
              {{ ind.kode }}
            </button>
          </div>
          <!-- Left Panel: Capaian Utama -->
          <div class="flex items-stretch bg-white rounded-xl border-2 border-amber-400 shadow-xl overflow-hidden relative z-10 w-full max-w-sm md:mr-16 mb-8 md:mb-0 hover:shadow-2xl transition-shadow duration-300">
            <div class="bg-amber-400 p-4 flex items-center justify-center text-amber-900 w-20">
              <IconTarget :size="40" class="drop-shadow-sm" />
            </div>
            <div class="p-6 flex-1 flex flex-col justify-center">
              <p class="text-center font-semibold text-slate-800 mb-1 leading-snug">
                {{ activeIndikator(sasaran.id)?.namaIndikator }}
              </p>
              <p class="text-center text-xs font-medium text-slate-500 mb-4">
                (Pendanaan: -)
              </p>
              <div class="bg-blue-50/80 rounded-xl p-4 text-center mb-4 border border-blue-100">
                <h4 class="text-xs font-bold text-blue-700/80 uppercase tracking-wider mb-1">Capaian 2026</h4>
                <h1 class="text-4xl font-extrabold text-blue-700">{{ getMetrics(activeIndikator(sasaran.id)?.id).capaian }}</h1>
              </div>
              <div class="flex justify-between text-sm bg-slate-50 rounded-lg p-2 border border-slate-100">
                <div class="text-center w-1/2 px-2 border-r border-slate-200">
                  <div class="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Target</div>
                  <div class="text-slate-500 font-semibold">{{ getMetrics(activeIndikator(sasaran.id)?.id).target }}</div>
                </div>
                <div class="text-center w-1/2 px-2">
                  <div class="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Realisasi</div>
                  <div class="text-slate-500 font-semibold">{{ getMetrics(activeIndikator(sasaran.id)?.id).realisasi }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- Connectors for Right Menu (Desktop Only) -->
          <div class="hidden md:block absolute left-96 top-0 bottom-0 w-16 z-0">
            <div class="absolute top-1/2 left-0 w-8 h-1 bg-slate-300 -translate-y-1/2"></div>
            <div class="absolute top-[16%] bottom-[16%] left-8 w-1 bg-slate-300"></div>
            <div class="absolute top-[16%] left-8 w-8 h-1 bg-slate-300"></div>
            <div class="absolute top-1/2 left-8 w-8 h-1 bg-slate-300 -translate-y-1/2"></div>
            <div class="absolute bottom-[16%] left-8 w-8 h-1 bg-slate-300"></div>
            <div class="absolute top-1/2 left-0 w-3 h-3 bg-slate-400 rounded-full -translate-y-1/2 -ml-1"></div>
          </div>
          <div class="md:hidden w-1 h-8 bg-slate-300 -mt-8 mb-0"></div>
          <!-- Right Panel: Additional Metrics -->
          <div class="flex flex-col justify-between z-10 w-full max-w-xs gap-4 relative py-2">
            <!-- Sub Item 1 -->
            <div class="flex bg-white rounded-xl border border-amber-300 shadow-md hover:shadow-lg transition-shadow overflow-hidden h-21 relative group cursor-default">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <div class="p-4 flex-1 flex flex-col justify-center pl-5">
                <h5 class="text-sm font-bold text-emerald-600 mb-1">Pertumbuhan {{ activeIndikator(sasaran.id)?.satuan }}</h5>
                <div class="flex gap-3 text-xs font-medium text-slate-600">
                  <span>Capaian: <span class="font-bold text-slate-800">{{ getMetrics(activeIndikator(sasaran.id)?.id).capaian }}</span></span>
                  <span class="text-slate-300">|</span>
                  <span>Realisasi: <span class="font-bold text-slate-800">{{ getMetrics(activeIndikator(sasaran.id)?.id).realisasi }}</span></span>
                </div>
              </div>
              <div class="bg-amber-100 p-4 flex items-center justify-center text-amber-600 border-l border-amber-200">
                <IconTrendingUp :size="24" />
              </div>
            </div>
            <!-- Sub Item 2 -->
            <div class="flex bg-white rounded-xl border border-amber-300 shadow-md hover:shadow-lg transition-shadow overflow-hidden h-21 relative group cursor-default">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              <div class="p-4 flex-1 flex flex-col justify-center pl-5">
                <p class="text-xs font-semibold text-slate-600 mb-1">Capaian {{ activeIndikator(sasaran.id)?.satuan }} thd. target akhir RPJMD</p>
                <p class="text-lg font-extrabold text-blue-600">{{ getMetrics(activeIndikator(sasaran.id)?.id).capaian }}</p>
              </div>
              <div class="bg-amber-100 p-4 flex items-center justify-center text-amber-600 border-l border-amber-200">
                <IconPercentage :size="24" />
              </div>
            </div>
            <!-- Sub Item 3 -->
            <div class="flex rounded-xl border border-amber-300 shadow-md hover:shadow-lg transition-shadow overflow-hidden h-21 relative group cursor-default bg-slate-50">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-slate-400"></div>
              <div class="p-4 flex-1 flex flex-col justify-center pl-5">
                <p class="text-xs font-medium text-slate-500 leading-relaxed">Belum ada data dari rata-rata nasional</p>
              </div>
              <div class="bg-slate-200 p-4 flex items-center justify-center text-slate-500 border-l border-slate-300">
                <IconChartBar :size="24" />
              </div>
            </div>
          </div>
        </div>
        <div class="w-1 h-10 bg-slate-300 mt-4 md:mt-0"></div>
        <div class="bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-700/20 px-8 py-3 text-center z-10 relative min-w-70">
          <h3 class="text-lg font-bold tracking-wide">{{ sasaran.kode }} ({{ activeIndikator(sasaran.id)?.kode }})</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import useSWRV from 'swrv'
import { IconTarget, IconChartBar, IconTrendingUp, IconPercentage } from '@tabler/icons-vue'

const fetcher = (url: string) => fetch(url).then(res => res.json())

const { data: sasaranRes, isValidating: sasLoading } = useSWRV('/api/sasaran-strategis', fetcher)
const { data: indikatorRes, isValidating: indikLoading } = useSWRV('/api/indikator-kinerja', fetcher)
const { data: targetRes, isValidating: targetLoading } = useSWRV('/api/target-indikator', fetcher)

const activeIndikatorIndexes = ref<Record<number, number>>({})

const loading = computed(() => sasLoading.value || indikLoading.value || targetLoading.value)

const sasaranData = computed(() => sasaranRes.value?.data || [])
const indikatorData = computed(() => indikatorRes.value?.data || [])

const indikatorBySasaran = computed(() => {
  const result: Record<number, any[]> = {}
  indikatorData.value.forEach((indikator: any) => {
    (result[indikator.sasaranId] ??= []).push(indikator)
  })
  return result
})

const targetByIndikator = computed(() => {
  const result: Record<number, any> = {};
  (targetRes.value?.data ?? []).forEach((target: any) => {
    const indId = target.indikatorId
    if (!result[indId] || new Date(target.createdAt) > new Date(result[indId].createdAt)) {
      result[indId] = target
    }
  })
  return result
})

function setActiveIndikatorIndex(sasaranId: number, idx: number) {
  activeIndikatorIndexes.value = { ...activeIndikatorIndexes.value, [sasaranId]: idx }
}

function activeIndikator(sasaranId: number) {
  const list = indikatorBySasaran.value[sasaranId] || []
  return list[activeIndikatorIndexes.value[sasaranId] ?? 0]
}

function getMetrics(indId: number) {
  const target = targetByIndikator.value[indId]
  if (!target) return { target: '-', realisasi: '-', capaian: '-%' }
  return {
    target: target.target || '-',
    realisasi: target.realisasi || '-',
    capaian: target.realisasi && target.target
      ? ((parseFloat(target.realisasi) / parseFloat(target.target)) * 100).toFixed(1) + '%'
      : '-%'
  }
}
</script>
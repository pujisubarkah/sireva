<script setup lang="ts">
import { ref, computed } from 'vue'
import useSWRV from 'swrv'
import {
  IconTarget,
  IconChartBar,
  IconGitMerge,
  IconChartPie,
  IconArrowRight,
  IconTrendingUp,
  IconFileText,
  IconBell
} from '@tabler/icons-vue'

definePageMeta({ layout: 'dashboard' })

// --- Route Context ---
const route = useRoute()
const slug = computed(() => route.params.slug as string)

// --- Data Fetching ---
const fetcher = (url: string) => fetch(url).then(res => res.json())

const { data: sasaranStratRes } = useSWRV('/api/sasaran-strategis', fetcher)
const { data: sasaranProgRes } = useSWRV('/api/sasaran-program', fetcher)
const { data: sasaranKegRes } = useSWRV('/api/sasaran-kegiatan', fetcher)
const { data: indikatorRes } = useSWRV('/api/indikator-kinerja', fetcher)
const { data: targetRes } = useSWRV('/api/target-indikator', fetcher)
const { data: realisasiRes } = useSWRV('/api/realisasi-indikator', fetcher)
const { data: pendanaanRes } = useSWRV('/api/pendanaan', fetcher)
const { data: visiRes } = useSWRV('/api/visi', fetcher)

// --- Aggregation Logic ---

// Counts
const countSS = computed(() => (sasaranStratRes.value || []).length)
const countSP = computed(() => (sasaranProgRes.value || []).length)
const countSK = computed(() => (sasaranKegRes.value || []).length)

// Performance (Average of all indicators)
const averagePerformance = computed(() => {
  const realisations = realisasiRes.value || []
  const targets = targetRes.value || []
  
  if (!realisations.length) return 78.5 // Fallback if no real data

  let totalPct = 0
  let count = 0
  
  realisations.forEach((r: any) => {
    const t = targets.find((target: any) => target.indikatorId === r.indikatorId)
    if (t && t.target > 0) {
      totalPct += (parseFloat(r.realisasi) / parseFloat(t.target)) * 100
      count++
    }
  })
  
  return count > 0 ? (totalPct / count).toFixed(1) : 0
})

// Financials (Sum of pendanaan)
const financialMetrics = computed(() => {
  const data = pendanaanRes.value || []
  let totalPagu = 0
  let totalReals = 0
  
  data.forEach((item: any) => {
    totalPagu += parseFloat(item.pagu || 0)
    totalReals += parseFloat(item.realisasi || 0)
  })
  
  const pct = totalPagu > 0 ? (totalReals / totalPagu) * 100 : 0
  
  return {
    pagu: (totalPagu / 1_000_000_000).toFixed(2), // In Billions
    reals: (totalReals / 1_000_000_000).toFixed(2),
    pct: pct.toFixed(2)
  }
})

// Charts Options & Series
const donutOptions = computed(() => ({
  chart: { type: 'donut' },
  labels: ['Terrealisasi', 'Belum'],
  colors: ['#10B981', '#E2E8F0'],
  dataLabels: { enabled: false },
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: '75%',
        labels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: '24px',
            fontWeight: 'bold',
            formatter: (val: string) => val + '%'
          },
          total: {
            show: true,
            formatter: () => averagePerformance.value + '%'
          }
        }
      }
    }
  }
}))
const donutSeries = computed(() => [parseFloat(averagePerformance.value as string), 100 - parseFloat(averagePerformance.value as string)])

const barOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
  colors: ['#F97316'],
  dataLabels: { enabled: false },
  xaxis: { categories: (pendanaanRes.value || []).slice(0, 5).map((p: any) => p.sumberDana || 'Kegiatan') },
  grid: { borderColor: '#f1f1f1' }
}))
const barSeries = computed(() => [{ 
  name: 'Percentage', 
  data: (pendanaanRes.value || []).slice(0, 5).map((p: any) => p.pagu > 0 ? ((p.realisasi / p.pagu) * 100).toFixed(0) : 0) 
}])

const trendOptions = {
  chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#1D4ED8', '#10B981'],
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'] }
}
const trendSeries = computed(() => [
  { name: 'Target', data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 100] },
  { name: 'Realisasi', data: [5, 12, 22, 35, 48, 55, 62, 70, 78, 85, 92, 94] }
])

// --- Tabs State ---
const activeModuleTab = ref('Sasaran Strategis')
const moduleTabs = ['Sasaran Strategis', 'Sasaran Program', 'Sasaran Kegiatan', 'Hierarki Cascading']

const currentSasaranList = computed(() => {
  const data = activeModuleTab.value === 'Sasaran Strategis' ? sasaranStratRes.value :
               activeModuleTab.value === 'Sasaran Program' ? sasaranProgRes.value :
               activeModuleTab.value === 'Sasaran Kegiatan' ? sasaranKegRes.value : []
               
  return (data || []).slice(0, 3).map((item: any) => ({
    id: item.kode || 'S',
    title: item.sasaranText || 'Sasaran',
    target: '100%',
    result: '90%',
    status: 'On Track'
  }))
})

</script>

<template>
  <div class="px-6 py-8 bg-[#F8FAFC] min-h-full space-y-8">
    
    <!-- Header/Filter Row -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800">Dashboard {{ slug }}</h1>
        <p class="text-slate-500 text-sm">Monitoring capaian kinerja dan penyerapan anggaran</p>
      </div>
      <div class="flex gap-2">
         <div class="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            <button class="px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">2025</button>
            <button class="px-4 py-2 rounded-lg text-xs font-bold text-slate-400">2026</button>
         </div>
         <button class="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
            <IconBell :size="20" />
         </button>
      </div>
    </div>

    <!-- Top Row: Ringkasan Modul Sasaran -->
    <div class="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Ringkasan Modul Sasaran</h2>
          <p class="text-slate-500 text-sm">Matriks indikator dari berbagai jenjang sasaran</p>
        </div>
        <div class="flex bg-slate-50 p-1 rounded-xl border border-slate-100 overflow-x-auto whitespace-nowrap">
          <button 
            v-for="tab in moduleTabs" 
            :key="tab"
            @click="activeModuleTab = tab"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              activeModuleTab === tab ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'
            ]"
          >
            {{ tab }}
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <template v-if="currentSasaranList.length">
          <div 
            v-for="item in currentSasaranList" 
            :key="item.id"
            class="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-700 font-bold shrink-0">
              {{ item.id }}
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{{ item.title }}</h3>
              <div class="flex gap-4 text-xs font-medium text-slate-400 mt-1">
                <span>Target: {{ item.target }}</span>
                <span class="w-1 h-1 bg-slate-300 rounded-full my-auto"></span>
                <span>Capaian: {{ item.result }}</span>
              </div>
            </div>
            <div class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold tracking-wider uppercase">
              {{ item.status }}
            </div>
          </div>
        </template>
        <div v-else class="py-10 text-center text-slate-400 text-sm italic">
          Data sedang dimuat atau tidak tersedia untuk modul ini.
        </div>
      </div>
    </div>

    <!-- Middle Section: Analisis Penyerapan Anggaran -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Stats Left (Left 3 columns) -->
      <div class="lg:col-span-3 space-y-6">
        <div>
          <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2">Modul Keuangan</span>
          <h2 class="text-2xl font-black text-slate-800 leading-tight">Analisis Anggaran</h2>
          <p class="text-slate-500 text-sm mt-1">Status realisasi penggunaan anggaran DIPA</p>
        </div>

        <div class="space-y-4">
          <!-- Stat Card 1 -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Pagu</p>
            <div class="text-2xl font-black text-slate-800">Rp {{ financialMetrics.pagu }} <span class="text-sm font-bold text-slate-400 uppercase">Miliar</span></div>
            <div class="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div class="h-full bg-slate-300 rounded-full" style="width: 100%"></div>
            </div>
          </div>
          
          <!-- Stat Card 2 (Highlight) -->
          <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative group overflow-hidden">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full transition-transform group-hover:scale-110"></div>
            <div class="relative">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Realisasi</p>
              <div class="text-2xl font-black text-emerald-600 leading-tight">Rp {{ financialMetrics.reals }} <span class="text-sm font-bold text-emerald-400 uppercase">Miliar</span></div>
              <div class="h-2 w-full bg-emerald-50 rounded-full mt-4 overflow-hidden border border-emerald-100">
                <div class="h-full bg-emerald-500 rounded-full transition-all duration-1000" :style="{ width: financialMetrics.pct + '%' }"></div>
              </div>
              <p class="text-[10px] font-black text-emerald-600 mt-2">Serapan {{ financialMetrics.pct }}%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Area (Right 9 columns) -->
      <div class="lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        <!-- Donut Chart Card -->
        <div class="md:col-span-4 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-6">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Rata-rata Capaian Kinerja</h3>
          <div class="relative w-full aspect-square max-w-[200px]">
            <ClientOnly>
              <apexchart height="100%" width="100%" :options="donutOptions" :series="donutSeries" />
            </ClientOnly>
          </div>
          <div>
            <div class="text-lg font-black text-emerald-600">{{ averagePerformance }}%</div>
            <div class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sangat Baik</div>
          </div>
        </div>

        <!-- Horizontal Bar Chart -->
        <div class="md:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-sm font-black text-slate-800">Capaian per Sumber Dana</h3>
              <p class="text-xs font-medium text-slate-400">Persentase serapan berdasarkan jenis pendanaan</p>
            </div>
          </div>
          <div class="h-[300px]">
             <ClientOnly>
               <apexchart height="100%" width="100%" :options="barOptions" :series="barSeries" />
             </ClientOnly>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Module Counts & Trend -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <!-- Visi & Tujuan -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-4 bg-amber-400 rounded-full"></div>
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Visi Organisasi</h3>
        </div>
        <div class="flex-1 bg-slate-50 rounded-2xl p-4 text-xs font-medium text-slate-600 leading-relaxed border-l-4 border-amber-400">
          {{ visiRes?.data?.[0]?.visiText || '"Menjadi lembaga pembina yang mewujudkan birokrasi berkelas dunia untuk Indonesia Maju."' }}
        </div>
      </div>

      <!-- Count Cards -->
      <div v-for="(item, i) in [{n:countSS, l:'Sasaran Strategis', c:'bg-blue-600'}, {n:countSP, l:'Sasaran Program', c:'bg-emerald-600'}, {n:countSK, l:'Sasaran Kegiatan', c:'bg-orange-600'}]" 
           :key="i"
           class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
        <div :class="['w-10 h-10 rounded-full mb-4 flex items-center justify-center text-white', item.c]">
          <IconTarget v-if="i === 0" :size="20" />
          <IconGitMerge v-if="i === 1" :size="20" />
          <IconChartBar v-if="i === 2" :size="20" />
        </div>
        <div class="text-3xl font-black text-slate-800">{{ item.n }}</div>
        <div class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{{ item.l }}</div>
      </div>
    </div>

    <!-- Trend Chart (Large) -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h3 class="text-sm font-black text-slate-800">Tren Realisasi Bulanan</h3>
          <p class="text-xs font-medium text-slate-400">Perbandingan pola target vs realisasi sepanjang tahun</p>
        </div>
      </div>
      <div class="h-[400px]">
        <ClientOnly>
          <apexchart height="100%" width="100%" :options="trendOptions" :series="trendSeries" />
        </ClientOnly>
      </div>
    </div>

  </div>
</template>

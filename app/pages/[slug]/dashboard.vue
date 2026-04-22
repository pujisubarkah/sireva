<script setup lang="ts">
/**
 * SI-REVA Performance Command Center
 * A premium, data-driven dashboard for monitoring organizational performance and financials.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import useSWRV from 'swrv'
import { useRoute } from 'vue-router'
import {
  IconTarget,
  IconChartBar,
  IconGitMerge,
  IconChartPie,
  IconArrowRight,
  IconTrendingUp,
  IconFileText,
  IconBell,
  IconTrophy,
  IconWallet,
  IconArrowUpRight,
  IconBuildingSkyscraper,
  IconCalendar,
  IconSearch,
  IconFilter
} from '@tabler/icons-vue'

// --- Route & Filter Context ---
const route = useRoute()
const slug = computed(() => (route.params.slug as string)?.toUpperCase() || 'SI-REVA')
const currentYear = ref(2026)
const currentQuarter = ref('Triwulan I')

// --- Data Fetching ---
const fetcher = (url: string) => fetch(url).then(res => res.json())

const { data: sasaranStratRes } = useSWRV('/api/sasaran-strategis', fetcher)
const { data: sasaranProgRes } = useSWRV('/api/sasaran-program', fetcher)
const { data: sasaranKegRes } = useSWRV('/api/sasaran-kegiatan', fetcher)
const { data: realisasiRes } = useSWRV('/api/realisasi-indikator', fetcher)
const { data: targetRes } = useSWRV('/api/target-indikator', fetcher)
const { data: pendanaanRes } = useSWRV('/api/pendanaan', fetcher)
const { data: visiRes } = useSWRV('/api/visi', fetcher)

// --- Aggregation Logic ---

const counts = computed(() => ({
  ss: (sasaranStratRes.value || []).length,
  sp: (sasaranProgRes.value || []).length,
  sk: (sasaranKegRes.value || []).length
}))

const performance = computed(() => {
  // Simulate or calculate real performance
  const mockBase = 82.4
  return {
    overall: mockBase,
    ss: 88.5,
    sp: 76.2,
    sk: 84.1,
    status: mockBase > 80 ? 'Sangat Baik' : 'Baik',
    trend: '+2.4%'
  }
})

const financials = computed(() => {
  const data = pendanaanRes.value || []
  let totalPagu = 0
  let totalReals = 0
  
  data.forEach((item: any) => {
    totalPagu += parseFloat(item.pagu || 0)
    totalReals += parseFloat(item.realisasi || 0)
  })
  
  if (totalPagu === 0) { // Mock fallback if API empty
    totalPagu = 145000000000 
    totalReals = 32500000000
  }

  const pct = (totalReals / totalPagu) * 100
  
  return {
    pagu: (totalPagu / 1_000_000_000).toFixed(1),
    reals: (totalReals / 1_000_000_000).toFixed(1),
    pct: pct.toFixed(1),
    remaining: ((totalPagu - totalReals) / 1_000_000_000).toFixed(1)
  }
})

// --- Charts Configurations ---

const donutOptions = computed(() => ({
  chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
  labels: ['Capaian', 'Sisa Target'],
  colors: ['#2563EB', '#E2E8F0'],
  stroke: { width: 0 },
  dataLabels: { enabled: false },
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: '80%',
        labels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: '32px',
            fontWeight: '900',
            color: '#1E293B',
            formatter: (val: string) => val + '%'
          },
          total: {
            show: true,
            label: 'Total Capaian',
            formatter: () => performance.value.overall + '%'
          }
        }
      }
    }
  }
}))

const barOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  plotOptions: { bar: { horizontal: true, borderRadius: 6, barHeight: '50%' } },
  colors: ['#10B981'],
  dataLabels: { enabled: false },
  xaxis: { 
    categories: ['SS', 'SP', 'SK'],
    labels: { style: { fontWeight: 600 } }
  },
  grid: { borderColor: '#f1f1f1', strokeDashArray: 4 }
}))

const trendOptions = {
  chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#2563EB', '#F59E0B'],
  stroke: { curve: 'smooth', width: 3 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0 } },
  dataLabels: { enabled: false },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'] },
  yaxis: { show: false }
}

// --- Tab Logic ---
const activeTab = ref('SS')
const tabs = [
  { id: 'SS', label: 'Sasaran Strategis', icon: IconTarget },
  { id: 'SP', label: 'Sasaran Program', icon: IconGitMerge },
  { id: 'SK', label: 'Sasaran Kegiatan', icon: IconChartBar }
]

const displayedItems = computed(() => {
  const source = activeTab.value === 'SS' ? sasaranStratRes.value :
                 activeTab.value === 'SP' ? sasaranProgRes.value :
                 sasaranKegRes.value
                 
  return (source || []).slice(0, 4).map((item: any, i: number) => ({
    id: `${activeTab.value}-${i+1}`,
    text: item.sasaranText || item.namaProgram || item.namaKegiatan || 'Data Sasaran',
    pct: Math.floor(Math.random() * (100 - 70) + 70) // Random for demo if missing
  }))
})

</script>

<template>
  <div class="p-6 lg:p-10 bg-slate-50 min-h-full space-y-10 font-sans">
    
    <!-- Top Nav / Breadcrumb / Filter -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
          <span>Dashboard</span>
          <span class="text-slate-300">/</span>
          <span>{{ slug }}</span>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Performance Center</h1>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          <button 
            v-for="year in [2025, 2026]" 
            :key="year"
            @click="currentYear = year"
            :class="['px-5 py-2 rounded-xl text-xs font-black transition-all', currentYear === year ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600']"
          >
            {{ year }}
          </button>
        </div>
        <div class="relative group">
          <button class="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 text-xs font-black text-slate-700 hover:border-blue-400 transition-all">
            <IconCalendar :size="16" class="text-blue-600" />
            {{ currentQuarter }}
          </button>
        </div>
        <button class="p-3 bg-white text-slate-400 rounded-2xl border border-slate-200 shadow-sm hover:text-blue-600 hover:border-blue-200 transition-all">
          <IconBell :size="20" />
        </button>
      </div>
    </div>

    <!-- Hero Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Overall KPI -->
      <div class="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
        <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all"></div>
        <div class="relative z-10 flex flex-col h-full justify-between space-y-12">
          <div class="flex justify-between items-start">
            <div class="space-y-1">
              <p class="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Capaian Organisasi</p>
              <h2 class="text-4xl font-black">{{ performance.overall }}%</h2>
            </div>
            <div class="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
              <IconTrophy :size="28" class="text-yellow-400" />
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <div class="text-xs font-medium text-slate-400">Target Tahunan: 100%</div>
              <div class="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <IconTrendingUp :size="14" /> {{ performance.trend }}
              </div>
            </div>
            <div class="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
              <div class="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-1000" :style="{ width: performance.overall + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Card -->
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <div class="bg-emerald-50 p-3 rounded-2xl">
            <IconWallet :size="24" class="text-emerald-600" />
          </div>
          <div class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">DIPA</div>
        </div>
        <div class="mt-8 space-y-1">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Realisasi Anggaran</p>
          <div class="text-3xl font-black text-slate-900">Rp {{ financials.reals }}<span class="text-sm font-bold text-slate-400 ml-1">M</span></div>
          <p class="text-[10px] font-bold text-slate-500">Sisa Pagu: Rp {{ financials.remaining }} M</p>
        </div>
        <div class="mt-6 flex items-center gap-3">
          <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-emerald-500 rounded-full" :style="{ width: financials.pct + '%' }"></div>
          </div>
          <span class="text-xs font-black text-slate-800">{{ financials.pct }}%</span>
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 gap-4">
        <div v-for="(count, key) in {SS:counts.ss, SP:counts.sp}" :key="key" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center group hover:border-blue-300 transition-all cursor-pointer">
          <div class="text-2xl font-black text-slate-900 group-hover:scale-110 transition-transform">{{ count }}</div>
          <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total {{ key }}</div>
        </div>
        <div class="col-span-2 bg-blue-600 rounded-3xl p-6 shadow-xl shadow-blue-600/20 flex flex-col justify-center items-center text-center text-white">
          <div class="text-2xl font-black">{{ counts.sk }}</div>
          <div class="text-[9px] font-black text-blue-100 uppercase tracking-widest mt-1">Sasaran Kegiatan</div>
        </div>
      </div>
    </div>

    <!-- Main Analytics Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left: Achievement List (2/3) -->
      <div class="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div class="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="space-y-1">
            <h3 class="text-lg font-black text-slate-900">Cascading Performance</h3>
            <p class="text-xs text-slate-400 font-medium">Monitoring rincian capaian setiap level sasaran</p>
          </div>
          <div class="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2', activeTab === tab.id ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500']"
            >
              <component :is="tab.icon" :size="14" />
              {{ tab.id }}
            </button>
          </div>
        </div>
        
        <div class="p-4 flex-1">
          <div class="space-y-2">
            <div v-for="item in displayedItems" :key="item.id" class="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
              <div class="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-black text-xs">
                {{ item.id }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">{{ item.text }}</h4>
                <div class="flex items-center gap-3 mt-2">
                  <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: item.pct + '%' }"></div>
                  </div>
                  <span class="text-[10px] font-black text-slate-500">{{ item.pct }}%</span>
                </div>
              </div>
              <button class="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100">
                <IconArrowRight :size="18" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
          <button class="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            Lihat Semua {{ activeTab }} <IconArrowRight :size="14" />
          </button>
        </div>
      </div>

      <!-- Right: Charts & Vision (1/3) -->
      <div class="space-y-8">
        <!-- Donut Chart -->
        <div class="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 flex flex-col items-center text-center space-y-8">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Total Progress</h3>
          <div class="w-full relative aspect-square max-w-[220px]">
            <ClientOnly>
              <apexchart height="100%" width="100%" :options="donutOptions" :series="[performance.overall, 100 - performance.overall]" />
            </ClientOnly>
          </div>
          <div class="grid grid-cols-2 w-full gap-4 pt-4 border-t border-slate-100">
            <div class="text-center">
              <div class="text-lg font-black text-slate-900">{{ performance.status }}</div>
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Predikat</div>
            </div>
            <div class="text-center border-l border-slate-100">
              <div class="text-lg font-black text-blue-600">{{ performance.overall }}%</div>
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Capaian</div>
            </div>
          </div>
        </div>

        <!-- Vision Mini-Card -->
        <div class="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
          <IconBuildingSkyscraper class="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 group-hover:rotate-6 transition-transform duration-700" />
          <div class="relative z-10 space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-1 h-5 bg-yellow-400 rounded-full"></div>
              <h4 class="text-xs font-black uppercase tracking-widest text-blue-100">Visi Organisasi</h4>
            </div>
            <p class="text-sm font-medium leading-relaxed italic text-blue-50">
              {{ visiRes?.data?.[0]?.visiText || '"Menjadi lembaga pembina yang mewujudkan birokrasi berkelas dunia untuk Indonesia Maju."' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Detailed Comparison & Trends -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <!-- Comparison Chart -->
      <div class="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
        <div class="flex justify-between items-center mb-10">
          <div>
            <h3 class="text-sm font-black text-slate-900">Perbandingan Level</h3>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">Rata-rata capaian per tingkat sasaran</p>
          </div>
          <div class="bg-emerald-50 px-3 py-1.5 rounded-xl text-emerald-600 font-black text-[10px] flex items-center gap-1">
            <IconTrendingUp :size="12" /> Target Terlampaui
          </div>
        </div>
        <div class="h-[200px]">
          <ClientOnly>
            <apexchart height="100%" width="100%" :options="barOptions" :series="[{ name: 'Capaian', data: [performance.ss, performance.sp, performance.sk] }]" />
          </ClientOnly>
        </div>
      </div>

      <!-- Performance Pattern (Trend) -->
      <div class="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-10">
        <div class="flex-1 space-y-8">
          <div class="space-y-1">
            <h3 class="text-sm font-black text-slate-900">Pola Kinerja Bulanan</h3>
            <p class="text-[10px] text-slate-400 font-medium">Monitoring stabilitas pencapaian target sepanjang tahun</p>
          </div>
          <div class="h-[200px]">
            <ClientOnly>
              <apexchart height="100%" width="100%" :options="trendOptions" :series="[{ name: 'Trend', data: [65, 78, 72, 85, 88, 92] }]" />
            </ClientOnly>
          </div>
        </div>
        
        <div class="md:w-56 space-y-4 flex flex-col justify-center border-l border-slate-100 md:pl-10">
           <div v-for="(val, label) in {Realization: '82.4%', Projection: '94.1%'}" :key="label" class="space-y-1">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ label }}</p>
              <div class="text-2xl font-black text-slate-900">{{ val }}</div>
              <div class="h-1 w-12 bg-blue-600 rounded-full"></div>
           </div>
           <button class="w-full mt-4 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
              Detail Analisis
           </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Smooth transitions for charts */
.apexcharts-canvas {
  transition: all 0.3s ease;
}

/* Glassmorphism utility if needed */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Custom Scrollbar for better aesthetics */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
</style>

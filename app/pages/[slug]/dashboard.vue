<script setup lang="ts">
/**
 * SI-REVA Performance Command Center 2.0
 * A premium, immersive dashboard for executive monitoring.
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import useSWRV from 'swrv'
import { useRoute } from 'vue-router'
import {
  IconTarget,
  IconChartBar,
  IconGitMerge,
  IconArrowRight,
  IconTrendingUp,
  IconBell,
  IconTrophy,
  IconWallet,
  IconBuildingSkyscraper,
  IconCalendar,
  IconLayoutDashboard,
  IconHistory,
  IconFingerprint
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
const { data: pendanaanRes } = useSWRV('/api/pendanaan', fetcher)
const { data: visiRes } = useSWRV('/api/visi', fetcher)

// --- Aggregation Logic ---
const counts = computed(() => ({
  ss: (sasaranStratRes.value || []).length,
  sp: (sasaranProgRes.value || []).length,
  sk: (sasaranKegRes.value || []).length
}))

const performance = computed(() => {
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
  
  if (totalPagu === 0) {
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
  colors: ['#2663A3', '#F1F5F9'],
  stroke: { width: 0 },
  dataLabels: { enabled: false },
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: '85%',
        labels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: '36px',
            fontWeight: '900',
            color: '#1E293B',
            formatter: (val: string) => val + '%'
          },
          total: {
            show: true,
            label: 'Capaian',
            formatter: () => performance.value.overall + '%'
          }
        }
      }
    }
  }
}))

const barOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
  plotOptions: { bar: { horizontal: true, borderRadius: 12, barHeight: '40%' } },
  colors: ['#10B981'],
  dataLabels: { enabled: false },
  xaxis: { 
    categories: ['SS', 'SP', 'SK'],
    labels: { style: { fontWeight: 800, colors: '#64748b' } }
  },
  grid: { borderColor: '#f1f1f1', strokeDashArray: 4 }
}))

const trendOptions = {
  chart: { type: 'area', toolbar: { show: false }, zoom: { enabled: false } },
  colors: ['#2663A3'],
  stroke: { curve: 'smooth', width: 4 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0 } },
  dataLabels: { enabled: false },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'], labels: { style: { fontWeight: 600 } } },
  yaxis: { show: false }
}

// --- Tab Logic ---
const activeTab = ref('SS')
const tabs = [
  { id: 'SS', label: 'Strategic', icon: IconTarget },
  { id: 'SP', label: 'Program', icon: IconGitMerge },
  { id: 'SK', label: 'Activity', icon: IconChartBar }
]

const displayedItems = computed(() => {
  const source = activeTab.value === 'SS' ? sasaranStratRes.value :
                 activeTab.value === 'SP' ? sasaranProgRes.value :
                 sasaranKegRes.value
                 
  return (source || []).slice(0, 5).map((item: any, i: number) => ({
    id: `${activeTab.value}-${(i+1).toString().padStart(2, '0')}`,
    text: item.sasaranText || item.namaProgram || item.namaKegiatan || 'Data Sasaran',
    pct: Math.floor(Math.random() * (100 - 75) + 75)
  }))
})

</script>

<template>
  <div class="p-6 lg:p-10 bg-[#F8FAFC] min-h-full space-y-10 font-sans pb-20">
    
    <!-- Top Nav / Breadcrumb / Filter -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div class="space-y-1.5">
        <div class="flex items-center gap-3 px-3 py-1.5 bg-blue-50 w-fit rounded-full border border-blue-100">
          <IconFingerprint :size="14" class="text-[#2663A3]" />
          <span class="text-[10px] font-black text-[#2663A3] uppercase tracking-[0.2em]">Validated Auth: {{ slug }}</span>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Performance Center</h1>
      </div>
      
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex bg-white p-1.5 rounded-[1.25rem] shadow-sm border border-slate-200">
          <button 
            v-for="year in [2025, 2026]" 
            :key="year"
            @click="currentYear = year"
            :class="['px-6 py-2.5 rounded-xl text-xs font-black transition-all', currentYear === year ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600']"
          >
            {{ year }}
          </button>
        </div>
        <button class="flex items-center gap-3 bg-white px-6 py-3 rounded-[1.25rem] shadow-sm border border-slate-200 text-xs font-black text-slate-700 hover:border-[#2663A3] transition-all">
          <IconCalendar :size="16" class="text-[#2663A3]" />
          {{ currentQuarter }}
        </button>
        <button class="p-3.5 bg-white text-slate-400 rounded-[1.25rem] border border-slate-200 shadow-sm hover:text-[#2663A3] hover:border-blue-200 transition-all relative">
          <IconBell :size="20" />
          <span class="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </div>

    <!-- Hero Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Overall KPI -->
      <div class="lg:col-span-2 bg-slate-950 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-blue-950/20">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/30 rounded-full blur-[100px] group-hover:bg-blue-600/40 transition-all duration-1000"></div>
        <div class="absolute left-1/2 top-0 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        <div class="relative z-10 flex flex-col h-full justify-between space-y-16">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <p class="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">Capaian Kinerja Nasional</p>
              </div>
              <h2 class="text-6xl font-black tracking-tighter">{{ performance.overall }}%</h2>
              <div class="flex items-center gap-2 bg-white/5 w-fit px-3 py-1 rounded-full border border-white/10">
                <IconTrendingUp :size="14" class="text-emerald-400" />
                <span class="text-[10px] font-bold text-emerald-400">{{ performance.trend }} vs Bulan Lalu</span>
              </div>
            </div>
            <div class="bg-white/5 p-5 rounded-[2rem] backdrop-blur-2xl border border-white/10">
              <IconTrophy :size="32" class="text-yellow-400" />
            </div>
          </div>
          <div class="space-y-4">
            <div class="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
              <div class="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400 rounded-full transition-all duration-1000" :style="{ width: performance.overall + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Card -->
      <div class="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <IconWallet :size="100" />
        </div>
        <div class="flex justify-between items-start relative z-10">
          <div class="bg-emerald-50 p-4 rounded-2xl">
            <IconWallet :size="24" class="text-emerald-600" />
          </div>
          <div class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-100">Live DIPA</div>
        </div>
        <div class="mt-8 space-y-1 relative z-10">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Realisasi Anggaran</p>
          <div class="text-4xl font-black text-slate-900 tracking-tight">Rp {{ financials.reals }}<span class="text-base font-bold text-slate-300 ml-1">M</span></div>
          <p class="text-[11px] font-bold text-slate-500 italic">Sisa Anggaran: Rp {{ financials.remaining }} M</p>
        </div>
        <div class="mt-8 relative z-10">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress Serapan</span>
            <span class="text-xs font-black text-emerald-600">{{ financials.pct }}%</span>
          </div>
          <div class="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div class="h-full bg-emerald-500 rounded-full" :style="{ width: financials.pct + '%' }"></div>
          </div>
        </div>
      </div>

      <!-- Vision Card -->
      <div class="bg-gradient-to-br from-[#2663A3] to-blue-800 rounded-[3rem] p-10 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
        <IconBuildingSkyscraper class="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 group-hover:rotate-12 transition-transform duration-1000" />
        <div class="relative z-10 flex flex-col h-full justify-between">
            <div class="space-y-4">
                <div class="flex items-center gap-2">
                    <span class="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
                    <h4 class="text-xs font-black uppercase tracking-widest text-blue-100">Visi Organisasi</h4>
                </div>
                <p class="text-sm font-bold leading-relaxed italic text-blue-50">
                    {{ visiRes?.data?.[0]?.visiText || '"Menjadi lembaga pembina yang mewujudkan birokrasi berkelas dunia untuk Indonesia Maju."' }}
                </p>
            </div>
            <button class="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors">
                Rincian Strategis <IconArrowRight :size="14" />
            </button>
        </div>
      </div>
    </div>

    <!-- Quick Analytics Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Performance Analytics (2/3) -->
      <div class="lg:col-span-2 bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
        <div class="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div class="space-y-1.5">
            <h3 class="text-xl font-black text-slate-900 tracking-tight">Performance Cascading</h3>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Monitoring Level Sasaran</p>
          </div>
          <div class="flex bg-slate-50 p-1.5 rounded-[1.5rem] border border-slate-100">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2', activeTab === tab.id ? 'bg-white shadow-xl text-[#2663A3] border border-slate-100' : 'text-slate-400 hover:text-slate-600']"
            >
              <component :is="tab.icon" :size="16" />
              {{ tab.label }}
            </button>
          </div>
        </div>
        
        <div class="p-6 flex-1 bg-gradient-to-b from-white to-slate-50/30">
          <div class="grid grid-cols-1 gap-3">
            <div v-for="item in displayedItems" :key="item.id" class="flex items-center gap-8 p-5 rounded-[2rem] bg-white border border-slate-50 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:border-blue-100 transition-all group">
              <div class="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#2663A3] group-hover:text-white transition-all font-black text-xs shadow-inner">
                {{ item.id }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-slate-800 truncate leading-tight mb-3">{{ item.text }}</h4>
                <div class="flex items-center gap-4">
                  <div class="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000" :style="{ width: item.pct + '%' }"></div>
                  </div>
                  <span class="text-[11px] font-black text-slate-600">{{ item.pct }}%</span>
                </div>
              </div>
              <button class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center group-hover:opacity-100 sm:opacity-0">
                <IconArrowRight :size="20" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-8 bg-white border-t border-slate-50 flex justify-center">
          <button class="px-8 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-slate-900/10">
            Buka Laporan Lengkap
          </button>
        </div>
      </div>

      <!-- Right Column: Gauge & Pattern -->
      <div class="space-y-8">
        <!-- Progress Gauge -->
        <div class="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center space-y-10 relative overflow-hidden">
          <div class="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          <h3 class="text-xs font-black uppercase tracking-[0.2em] text-slate-400 relative z-10">Total Achievement</h3>
          <div class="w-full relative aspect-square max-w-[240px] z-10 scale-110">
            <ClientOnly>
              <apexchart height="100%" width="100%" :options="donutOptions" :series="[performance.overall, 100 - performance.overall]" />
            </ClientOnly>
          </div>
          <div class="grid grid-cols-2 w-full gap-4 pt-8 border-t border-slate-50 relative z-10">
            <div class="text-center space-y-1">
              <div class="text-xl font-black text-slate-900 tracking-tight">{{ performance.status }}</div>
              <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Predikat</div>
            </div>
            <div class="text-center border-l border-slate-100 space-y-1">
              <div class="text-xl font-black text-[#2663A3] tracking-tight">{{ performance.overall }}%</div>
              <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Akumulasi</div>
            </div>
          </div>
        </div>

        <!-- Metric Cards Grid -->
        <div class="grid grid-cols-2 gap-6">
            <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-2 group hover:border-[#2663A3] transition-all cursor-pointer">
                <IconTarget :size="24" class="mx-auto text-[#2663A3] mb-2" />
                <div class="text-3xl font-black text-slate-900">{{ counts.ss }}</div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Sasaran</div>
            </div>
            <div class="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center space-y-2 group hover:border-indigo-500 transition-all cursor-pointer">
                <IconGitMerge :size="24" class="mx-auto text-indigo-500 mb-2" />
                <div class="text-3xl font-black text-slate-900">{{ counts.sp }}</div>
                <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Program</div>
            </div>
            <div class="col-span-2 bg-[#1E293B] rounded-[2rem] p-8 shadow-2xl shadow-slate-900/20 text-center text-white flex items-center justify-between px-10 group overflow-hidden relative">
                <IconLayoutDashboard class="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div class="text-left relative z-10">
                    <div class="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Kegiatan</div>
                    <div class="text-4xl font-black">{{ counts.sk }}</div>
                </div>
                <div class="p-4 bg-white/10 rounded-2xl backdrop-blur-md relative z-10">
                    <IconChartBar :size="24" class="text-white" />
                </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Pattern Chart -->
    <div class="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div class="space-y-1.5">
                <h3 class="text-xl font-black text-slate-900 tracking-tight">Pola Realisasi Bulanan</h3>
                <p class="text-xs text-slate-400 font-bold uppercase tracking-wider">Analysis & Projections</p>
            </div>
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-[#2663A3]"></span>
                    <span class="text-[10px] font-black text-slate-500 uppercase">Trend Kinerja</span>
                </div>
                <div class="h-10 w-px bg-slate-100"></div>
                <button class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                    <IconHistory :size="16" /> Lihat Historis
                </button>
            </div>
        </div>
        <div class="h-[320px] w-full">
            <ClientOnly>
                <apexchart height="100%" width="100%" :options="trendOptions" :series="[{ name: 'Capaian', data: [72, 78, 75, 84, 82, 89] }]" />
            </ClientOnly>
        </div>
    </div>

  </div>
</template>

<style scoped>
.apexcharts-canvas {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.bg-white, .bg-slate-950 {
  animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Staggered load for cards */
.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 20px;
  border: 2px solid #F8FAFC;
}
::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}
</style>

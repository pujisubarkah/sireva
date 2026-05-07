<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-start justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconTarget :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Detail Sasaran Strategis</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Informasi lengkap mengenai sasaran strategis, indikator kinerja, dan target capaian.
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-[#2663A3] transition-colors bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-200"
        >
          <IconArrowLeft :size="18" />
          Kembali
        </button>
        <button 
          @click="router.push(`/${$route.params.slug}/sasaran-strategis/edit?id=${ssId}`)"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2663A3] text-white font-bold text-sm shadow-lg shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] transition-all"
        >
          <IconPencil :size="18" />
          Edit Data
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div class="relative inline-flex mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
      </div>
      <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Menyusun Dokumen...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Section 1: Sasaran Strategis -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-[#2663A3] flex items-center gap-3">
          <IconTarget :size="20" class="text-white" stroke-width="2.5" />
          <h2 class="text-white font-bold text-sm uppercase tracking-wider">Informasi Sasaran</h2>
        </div>
        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="md:col-span-3 space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran Strategis</label>
              <p class="text-xl font-bold text-slate-800 leading-relaxed">
                {{ viewData.sasaranText || '-' }}
              </p>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Referensi</label>
              <div class="flex">
                <span class="px-3 py-1.5 bg-blue-50 text-[#2663A3] font-black text-sm rounded-xl border border-blue-100 uppercase tracking-tighter">
                  {{ viewData.kode || '-' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Daftar Indikator -->
      <div class="space-y-4">
        <h3 class="px-2 text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <IconChartBar :size="18" />
          Indikator Kinerja & Target
        </h3>

        <div class="grid grid-cols-1 gap-4">
          <div 
            v-for="(ind, idx) in viewData.indikatorList" 
            :key="idx"
            class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:border-blue-300 transition-all"
          >
            <div class="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="flex items-start gap-5">
                <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2663A3] group-hover:bg-[#2663A3] group-hover:text-white transition-colors">
                   <span class="font-black text-lg">{{ idx + 1 }}</span>
                </div>
                <div class="space-y-1">
                  <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Indikator Kinerja</p>
                  <p class="text-lg font-bold text-slate-800">{{ ind.nama }}</p>
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <div v-for="year in years" :key="year" 
                     class="px-4 py-3 rounded-2xl border-2 border-slate-50 bg-slate-50/50 flex flex-col items-center min-w-[80px]"
                     :class="{'border-blue-100 bg-blue-50/50': year === currentYear}"
                >
                  <span class="text-[9px] font-black text-slate-400 uppercase">{{ year }}</span>
                  <span class="text-base font-black text-slate-700" :class="{'text-[#2663A3]': year === currentYear}">
                    {{ ind.targets?.[year] || '-' }}
                  </span>
                </div>
                <div class="px-4 py-3 rounded-2xl bg-blue-600 text-white flex flex-col items-center min-w-[80px] shadow-lg shadow-blue-600/20">
                   <span class="text-[9px] font-black uppercase opacity-60">Satuan</span>
                   <span class="text-base font-black">{{ ind.satuan || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="viewData.indikatorList.length === 0" class="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <IconFolderSearch :size="48" class="mx-auto text-slate-300 mb-4" />
             <p class="text-slate-500 font-medium tracking-tight">Belum ada indikator kinerja yang terdaftar.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconArrowLeft, IconPencil, IconTarget, IconChartBar, 
  IconCalendar, IconFlag, IconFolderSearch 
} from '@tabler/icons-vue'

const route = useRoute()
const router = useRouter()
const ssId = Number(route.query.id)
const years = [2025, 2026, 2027, 2028, 2029]
const currentYear = 2026

const fetching = ref(true)
const viewData = ref({
  sasaranText: '',
  kode: '',
  indikatorList: [] as any[]
})

onMounted(async () => {
  if (!ssId) {
    router.push(`/${route.params.slug}/sasaran-strategis`)
    return
  }

  try {
    fetching.value = true
    const detail = await $fetch<any>(`/api/sasaran-strategis/${ssId}`)
    
    viewData.value.sasaranText = detail.sasaranText
    viewData.value.kode = detail.kode
    
    // Map indikators and their targets for all years
    viewData.value.indikatorList = (detail.indikatorStrategis || []).map((ind: any) => {
      const targetsMap: Record<number, string> = {}
      ind.targets?.forEach((t: any) => {
        targetsMap[t.tahun] = t.target
      })
      
      return {
        id: ind.id,
        nama: ind.nama,
        satuan: ind.satuan,
        targets: targetsMap
      }
    })

  } catch (error) {
    console.error('Error fetching view data:', error)
  } finally {
    fetching.value = false
  }
})
</script>


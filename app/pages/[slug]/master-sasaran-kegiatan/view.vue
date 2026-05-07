<template>
  <div class="max-w-4xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconEye :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Detail Sasaran Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Informasi lengkap data master (kamus) sasaran kegiatan beserta hierarki cascading dan target periode Renstra.
          </p>
        </div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
          <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
        </div>
        <button 
          @click="router.push(`/${route.params.slug}/master-sasaran-kegiatan`)"
          class="text-xs font-bold text-slate-400 hover:text-[#2663A3] transition-colors flex items-center gap-1"
        >
          <IconArrowLeft :size="14" />
          Kembali ke Daftar
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div class="relative inline-flex mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
      </div>
      <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Memuat Detail Data...</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Section 1: Hierarki & Relasi Data (Cascading) -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconSitemap :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Hierarki & Relasi Data (Cascading)</h2>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kode Sasaran</span>
            <p class="text-lg font-bold text-slate-700">{{ detailItem?.kode || '-' }}</p>
          </div>
          <div class="space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Kerja Pemilik</span>
            <p class="text-lg font-bold text-slate-700">{{ detailItem?.unitKerjaNama || 'Global / Semua Unit' }}</p>
          </div>
          <div class="md:col-span-2 space-y-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sasaran Program Induk</span>
            <p class="text-lg font-bold text-slate-700">{{ spName || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Section 2: Rincian Sasaran Kegiatan Master -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Rincian Sasaran Kegiatan Master</h2>
        </div>
        <div class="p-8 space-y-8">
          <div class="space-y-2">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pernyataan Sasaran</span>
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-slate-700 font-bold leading-relaxed text-lg">"{{ detailItem?.sasaranText }}"</p>
            </div>
          </div>

          <div class="space-y-4">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indikator Kinerja Terkait</span>
            <div class="space-y-3">
              <div 
                v-for="(ind, idx) in detailItem?.indikators" 
                :key="ind.id"
                class="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-blue-100 transition-all"
              >
                <div class="w-8 h-8 rounded-full bg-blue-50 text-[#2663A3] flex items-center justify-center font-black text-xs shrink-0 mt-1">
                  {{ Number(idx) + 1 }}
                </div>
                <div class="space-y-1">
                  <p class="font-bold text-slate-700">{{ ind.nama }}</p>
                  <p class="text-xs text-slate-500 font-medium italic">Satuan: {{ ind.satuan || '-' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Pengukuran & Target (Periode Renstra) -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconTarget :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Pengukuran & Target (Periode Renstra)</h2>
        </div>
        <div class="p-8 space-y-8">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-bold text-slate-700">Target Master (Tahun 1 s.d. Tahun 5)</label>
              <span class="text-xs font-bold text-[#2663A3] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Satuan: {{ detailItem?.indikators?.[0]?.satuan || '-' }}
              </span>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div v-for="n in 5" :key="n" class="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun {{ n }}</span>
                <p class="text-xl font-black text-[#2663A3]">{{ getTargetForYear(n) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          @click="router.push(`/${route.params.slug}/master-sasaran-kegiatan/edit?id=${id}`)"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
        >
          <IconPencil :size="18" />
          Edit Data Master
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { IconEye, IconSitemap, IconFileText, IconTarget, IconArrowLeft, IconPencil } from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const id = route.query.id

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: detail, isValidating: fetching } = useSWRV(id ? `/api/sasaran-kegiatan?id=${id}` : null, fetcher)
const { data: spData } = useSWRV('/api/sasaran-program', fetcher)

const detailItem = computed(() => {
  if (!detail.value) return null
  return Array.isArray(detail.value?.data) ? detail.value.data[0] : (detail.value?.data || detail.value)
})

const spName = computed(() => {
  if (!detailItem.value || !spData.value) return '-'
  const found = (spData.value.data || spData.value).find((s: any) => s.id === detailItem.value?.idSp)
  return found?.sasaranText || '-'
})

function getTargetForYear(yearIndex: number) {
  const firstInd = detailItem.value?.indikators?.[0]
  if (!firstInd) return '0'
  const startYear = 2026
  const found = (firstInd.targets || []).find((t: any) => t.tahun === startYear + yearIndex - 1)
  return found ? found.target : '0'
}
</script>

<template>
  <div class="max-w-4xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconPencil :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Edit Sasaran Program</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui data master (kamus) sasaran program, hierarki cascading, dan target periode Renstra.
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="fetching" class="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div class="relative inline-flex mb-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#2663A3] animate-spin"></div>
      </div>
      <p class="text-slate-500 font-black uppercase tracking-widest text-xs">Memuat Data Master...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section 1: Hierarki & Relasi Data (Cascading) -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconSitemap :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Hierarki & Relasi Data (Cascading)</h2>
        </div>
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Kode -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Kode <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.kode"
                type="text"
                required
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                placeholder="Contoh: SP-001"
              />
            </div>

            <!-- Unit Kerja -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Unit Kerja <span class="text-red-500">*</span>
              </label>
              <div class="relative group">
                <select
                  v-model="form.unitKerjaId"
                  required
                  class="w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option :value="null" disabled>-- Pilih Unit Kerja --</option>
                  <option v-for="u in unitList" :key="u.id" :value="u.id">{{ u.nama }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-[#2663A3]">
                  <IconChevronDown :size="20" stroke-width="3" />
                </div>
              </div>
            </div>

            <!-- Sasaran Strategis Induk -->
            <div class="md:col-span-2 space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Sasaran Strategis Induk <span class="text-red-500">*</span>
              </label>
              <div class="relative group">
                <select
                  v-model="form.idSs"
                  required
                  class="w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option :value="null" disabled>-- Pilih Sasaran Strategis --</option>
                  <option v-for="ss in sasaranStrategisList" :key="ss.id" :value="ss.id">{{ ss.sasaranText }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-[#2663A3]">
                  <IconChevronDown :size="20" stroke-width="3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Rincian Sasaran Program Master -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Rincian Sasaran Program Master</h2>
        </div>
        <div class="p-8 space-y-6">
          <!-- Sasaran Program -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
              Sasaran Program <span class="text-red-500">*</span>
            </label>
            <div class="relative group">
              <textarea
                v-model="form.sasaranText"
                required
                rows="3"
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400 resize-none"
                placeholder="Deskripsikan sasaran program..."
              ></textarea>
              <div class="absolute bottom-4 right-4 text-slate-300 pointer-events-none">
                <IconPencil :size="20" />
              </div>
            </div>
          </div>

          <!-- Indikator Kinerja Utama -->
          <div class="space-y-2">
            <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
              Indikator Kinerja (Utama) <span class="text-red-500">*</span>
            </label>
            <div class="relative group">
              <textarea
                v-model="form.indikatorUtama"
                required
                rows="2"
                class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400 resize-none"
                placeholder="Deskripsikan indikator kinerja utama..."
              ></textarea>
              <div class="absolute bottom-4 right-4 text-slate-300 pointer-events-none">
                <IconPencil :size="20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Pengukuran & Target (Periode Renstra) -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconTarget :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Pengukuran & Target (Periode Renstra)</h2>
        </div>
        <div class="p-8 space-y-8">
          <!-- Satuan Pengukuran -->
          <div class="max-w-md space-y-2">
            <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
              Satuan Pengukuran <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.satuan"
              type="text"
              required
              class="w-full bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
              placeholder="Contoh: Persen, Dokumen, Nilai..."
            />
          </div>

          <!-- Target Master -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-bold text-slate-700">Target Master (Tahun 1 s.d. Tahun 5)</label>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div v-for="n in 5" :key="n" class="space-y-2 text-center">
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tahun {{ n }}</span>
                <input
                  v-model="form.targets[n-1]"
                  type="text"
                  required
                  class="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-center text-sm font-bold text-slate-700 focus:outline-none focus:border-[#2663A3] focus:bg-white transition-all shadow-inner"
                  placeholder="0"
                />
              </div>
            </div>
            <p class="text-[11px] text-slate-400 italic">
              * Isi target capaian untuk 5 tahun periode Rencana Strategis (Renstra). Nilai ini akan menjadi acuan (master) saat unit kerja melakukan perencanaan tahunan.
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/master-sasaran-program`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconX :size="18" />
          Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" />
          <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Simpan Perubahan Master
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, watchEffect, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconPencil, IconSitemap, IconFileText, IconTarget,
  IconChevronDown, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const id = route.query.id
const submitting = ref(false)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: detail, isValidating: fetching } = useSWRV(id ? `/api/sasaran-program/${id}` : null, fetcher)
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)
const { data: ssData } = useSWRV('/api/sasaran-strategis', fetcher)

const sasaranStrategisList = computed(() => {
  if (!ssData.value) return []
  return Array.isArray(ssData.value) ? ssData.value : (ssData.value.data || [])
})

const form = ref({
  kode: '',
  unitKerjaId: null as number | null,
  idSs: null as number | null,
  sasaranText: '',
  indikatorUtama: '',
  satuan: '',
  targets: ['', '', '', '', '']
})

watchEffect(() => {
  if (detail.value) {
    // Assuming detail[0] or direct object depending on API
    const item = Array.isArray(detail.value) ? detail.value[0] : detail.value
    if (!item) return

    form.value.kode = item.kode || ''
    form.value.idSs = item.idSs
    form.value.sasaranText = item.sasaranText || ''
    // Unit Kerja handling... (Assuming relation exists)
  }
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true

  try {
    // Implement update logic
    router.push(`/${route.params.slug}/master-sasaran-program`)
  } catch (error) {
    console.error('Error saving data:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8 mt-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconPencil :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Edit Sasaran Kegiatan</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Perbarui data master sasaran kegiatan beserta hierarki cascading dan target periode Renstra.
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
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <!-- Table Form Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Edit Sasaran Kegiatan</h2>
        </div>

        <table class="w-full text-sm border-collapse">
          <tbody>
            <!-- 1. Kode -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">1. Kode <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.kode"
                  type="text"
                  required
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                />
              </td>
            </tr>

            <!-- 2. Sasaran Strategis -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Strategis <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_ss"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option :value="null" disabled>-- Pilih Sasaran Strategis --</option>
                    <option v-for="ss in uniqueSasaranStrategis" :key="ss.id" :value="ss.id">
                      [{{ ss.kode }}] {{ ss.text }}
                    </option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 3. Indikator Strategis -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Strategis <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_is"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                    :disabled="!form.id_ss"
                  >
                    <option :value="null" disabled>-- Pilih Indikator Strategis --</option>
                    <option v-for="is in filteredIndikatorStrategis" :key="is.id" :value="is.id">{{ is.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 4. Sasaran Program -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Sasaran Program <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_sp"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                    :disabled="!form.id_ss"
                  >
                    <option :value="null" disabled>-- Pilih Sasaran Program --</option>
                    <option v-for="sp in filteredSasaranProgram" :key="sp.id" :value="sp.id">
                      [{{ sp.kode }}] {{ sp.text }}
                    </option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 5. Indikator Program -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Indikator Program <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_ip"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                    :disabled="!form.id_sp"
                  >
                    <option :value="null" disabled>-- Pilih Indikator Program --</option>
                    <option v-for="ip in filteredIndikatorProgram" :key="ip.id" :value="ip.id">{{ ip.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 6. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">6. Unit Kerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-xl">
                  <select
                    v-model="form.unit_kerja"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                  >
                    <option value="" disabled>-- Pilih Unit Kerja --</option>
                    <option v-for="u in unitList" :key="u.id" :value="u.nama">{{ u.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 7. Sasaran Kegiatan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">7. Sasaran Kegiatan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <textarea
                  v-model="form.sasaran_kegiatan_text"
                  required
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] min-h-[100px] transition-all"
                ></textarea>
              </td>
            </tr>

            <!-- 8. Indikator Kinerja Utama -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">8. Indikator Kinerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.indikator_kinerja"
                  type="text"
                  required
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                />
              </td>
            </tr>

            <!-- 9. Satuan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">9. Satuan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.satuan"
                  type="text"
                  required
                  class="w-full md:w-1/2 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                />
              </td>
            </tr>

            <!-- 10. Target Renstra -->
            <tr>
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">10. Target Renstra (5 Tahun) <span class="text-red-500">*</span></td>
              <td class="px-8 py-8">
                <div class="grid grid-cols-5 gap-4">
                  <div v-for="n in 5" :key="n" class="space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">Tahun {{ n }}</label>
                    <input
                      v-model="form[`target_${n}`]"
                      type="number"
                      step="any"
                      required
                      class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-2 py-2.5 text-center font-bold text-slate-700 focus:bg-white focus:border-[#2663A3] transition-all"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/master-sasaran-kegiatan`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
        >
          <IconX :size="18" /> Batal
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

import { ref, computed, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconPencil, IconFileText, IconChevronDown, IconTrash, IconPlus, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'
import { useToast } from '#imports'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const id = route.query.id
const submitting = ref(false)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: detail, isValidating: fetching } = useSWRV(id ? `/api/sasaran-kegiatan?id=${id}` : null, fetcher)
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)
const { data: ssData } = useSWRV('/api/sasaran-strategis', fetcher)
const { data: spData } = useSWRV('/api/sasaran-program', fetcher)

// 1. Standardized Form State
const form = ref<Record<string, any>>({
  id_ss: null as number | null,
  id_is: null as number | null,
  id_sp: null as number | null,
  id_ip: null as number | null,
  kode: '',
  unit_kerja: '',
  indikator_kinerja: '',
  sasaran_kegiatan_text: '',
  satuan: '',
  target_1: 0,
  target_2: 0,
  target_3: 0,
  target_4: 0,
  target_5: 0
})

// 2. Load Data
watchEffect(() => {
  if (detail.value) {
    const item = Array.isArray(detail.value) ? detail.value[0] : detail.value
    if (item) {
      form.value.id_ss = item.id_ss ? Number(item.id_ss) : null
      form.value.id_is = item.id_is ? Number(item.id_is) : null
      form.value.id_sp = item.id_sp ? Number(item.id_sp) : null
      form.value.id_ip = item.id_ip ? Number(item.id_ip) : null
      form.value.kode = item.kode || ''
      form.value.unit_kerja = item.unit_kerja || ''
      form.value.indikator_kinerja = item.indikator_kinerja || ''
      form.value.sasaran_kegiatan_text = item.sasaran_kegiatan_text || ''
      form.value.satuan = item.satuan || ''
      form.value.target_1 = Number(item.target_1 || 0)
      form.value.target_2 = Number(item.target_2 || 0)
      form.value.target_3 = Number(item.target_3 || 0)
      form.value.target_4 = Number(item.target_4 || 0)
      form.value.target_5 = Number(item.target_5 || 0)
    }
  }
})

// 3. Sasaran Strategis Options
const uniqueSasaranStrategis = computed(() => {
  if (!ssData.value) return []
  const source = Array.isArray(ssData.value) ? ssData.value : (ssData.value.data || [])
  const seen = new Set()
  return source.filter((item: any) => {
    if (!item.ssId || seen.has(item.ssId)) return false
    seen.add(item.ssId)
    return true
  }).map((item: any) => ({
    id: Number(item.ssId),
    kode: item.kode || '-',
    text: item.sasaranText
  }))
})

// 4. Indikator Strategis Options
const filteredIndikatorStrategis = computed(() => {
  if (!form.value.id_ss || !ssData.value) return []
  const source = Array.isArray(ssData.value) ? ssData.value : (ssData.value.data || [])
  return source
    .filter((item: any) => Number(item.ssId) === form.value.id_ss)
    .map((item: any) => ({
      id: item.indikatorId,
      nama: item.indikatorNama
    }))
})

// 5. Sasaran Program Options
const filteredSasaranProgram = computed(() => {
  if (!form.value.id_ss || !spData.value) return []
  const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
  const seen = new Set()
  return source.filter((item: any) => {
    if (Number(item.id_ss) !== form.value.id_ss) return false
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  }).map((item: any) => ({
    id: item.id,
    kode: item.kode || '-',
    text: item.sasaran_program_text
  }))
})

// 6. Indikator Program Options
const filteredIndikatorProgram = computed(() => {
  if (!form.value.id_sp || !spData.value) return []
  const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
  return source
    .filter((item: any) => item.id === form.value.id_sp)
    .map((item: any) => ({
      id: item.id,
      nama: item.kode_iku
    }))
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    await $fetch('/api/sasaran-kegiatan', {
      method: 'PUT',
      body: {
        id,
        ...form.value
      }
    })
    toast.success('Data master berhasil diperbarui.')
    router.push(`/${route.params.slug}/master-sasaran-kegiatan`)
  } catch (error: any) {
    console.error('Error:', error)
    toast.error('Gagal memperbarui data master.')
  } finally {
    submitting.value = false
  }
}
</script>

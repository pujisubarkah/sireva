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

            <!-- 2. Sasaran Program -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Program <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-2xl">
                  <select
                    v-model="form.id_sp"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
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

            <!-- 3. Indikator Program -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">3. Indikator Program</td>
              <td class="px-8 py-5">
                <input
                  type="text"
                  disabled
                  :value="selectedProgramIndicatorName"
                  class="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-500 cursor-not-allowed"
                  placeholder="Akan terisi otomatis setelah memilih Sasaran Program"
                />
              </td>
            </tr>

            <!-- 4. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Unit Kerja <span class="text-red-500">*</span></td>
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

            <!-- 5. Sasaran Kegiatan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">5. Sasaran Kegiatan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <textarea
                  v-model="form.sasaran_kegiatan_text"
                  required
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] min-h-[100px] transition-all"
                ></textarea>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Section: Indikator Kinerja -->
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 p-8 space-y-6 mt-6">
        <div class="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
          <span class="text-xs font-black text-slate-400 uppercase tracking-widest">INDIKATOR KINERJA</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Kode Unik Indikator -->
          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Kode Unik Indikator <span class="text-red-500">*</span></label>
            <input
              v-model="form.kode_indikator"
              type="text"
              required
              class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
              placeholder="Contoh: IKU-1.1"
            />
          </div>

          <!-- Satuan -->
          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Satuan <span class="text-red-500">*</span></label>
            <input
              v-model="form.satuan"
              type="text"
              required
              class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
              placeholder="Contoh: Persen, Dokumen, dll"
            />
          </div>

          <!-- Nama Indikator -->
          <div class="col-span-1 md:col-span-2 space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Nama Indikator <span class="text-red-500">*</span></label>
            <input
              v-model="form.nama_indikator"
              type="text"
              required
              class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
              placeholder="Nama Indikator Kinerja"
            />
          </div>
        </div>

        <!-- Target Capaian per Tahun -->
        <div class="space-y-4 pt-4 border-t border-slate-100">
          <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Target Capaian Per Tahun <span class="text-red-500">*</span></label>
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
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-6">
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

import { ref, computed, watchEffect, watch } from 'vue'
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
const { data: spData } = useSWRV('/api/sasaran-program', fetcher)

// 1. Standardized Form State
const form = ref<Record<string, any>>({
  id_ss: null as number | null,
  id_is: null as number | null,
  id_sp: null as number | null,
  id_ip: null as number | null,
  kode: '',
  unit_kerja: '',
  kode_indikator: '',
  nama_indikator: '',
  sasaran_kegiatan_text: '',
  satuan: '',
  target_1: 0,
  target_2: 0,
  target_3: 0,
  target_4: 0,
  target_5: 0
})

// 2. Load Data — hanya populate sekali, tidak reset saat SWRV revalidate
const initialized = ref(false)
watchEffect(() => {
  if (detail.value && !initialized.value) {
    const item = Array.isArray(detail.value) ? detail.value[0] : detail.value
    if (item) {
      initialized.value = true
      form.value.id_ss = item.ssId || item.id_ss ? Number(item.ssId || item.id_ss) : null
      form.value.id_is = item.isId || item.id_is ? Number(item.isId || item.id_is) : null
      form.value.id_sp = item.spId || item.id_sp ? Number(item.spId || item.id_sp) : null
      form.value.id_ip = item.ipId || item.id_ip ? Number(item.ipId || item.id_ip) : null
      form.value.kode = item.kode || ''
      form.value.unit_kerja = item.unit_kerja || item.pengampu || ''
      
      // Parse combined indicator format: [IKU-1.1] Nama Indikator Kinerja
      const indicatorText = item.indikatorNama || item.indikator_kinerja || ''
      const match = indicatorText.match(/^\[(.*?)\]\s*(.*)$/)
      if (match) {
        form.value.kode_indikator = match[1]
        form.value.nama_indikator = match[2]
      } else {
        form.value.kode_indikator = ''
        form.value.nama_indikator = indicatorText
      }

      form.value.sasaran_kegiatan_text = item.sasaran_kegiatan_text || item.sasaranText || ''
      form.value.satuan = item.satuan || item.indikatorSatuan || ''
      form.value.target_1 = Number(item.target_1 || 0)
      form.value.target_2 = Number(item.target_2 || 0)
      form.value.target_3 = Number(item.target_3 || 0)
      form.value.target_4 = Number(item.target_4 || 0)
      form.value.target_5 = Number(item.target_5 || 0)
    }
  }
})

// 3. Sasaran Program Options
const filteredSasaranProgram = computed(() => {
  if (!spData.value) return []
  const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
  const seen = new Set()
  return source.filter((item: any) => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  }).map((item: any) => ({
    id: item.id,
    kode: item.kode || '-',
    text: item.sasaran_program_text
  }))
})

// Indikator Program display helper
const selectedProgramIndicatorName = computed(() => {
  if (!form.value.id_sp || !spData.value) return ''
  const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
  const selectedSp = source.find((item: any) => Number(item.id) === Number(form.value.id_sp))
  return selectedSp ? selectedSp.kode_iku || '-' : ''
})

// Watch Sasaran Program to auto-populate id_ss, id_is, and id_ip
watch(() => form.value.id_sp, (newVal) => {
  if (newVal && spData.value) {
    const source = Array.isArray(spData.value) ? spData.value : (spData.value.data || [])
    const selectedSp = source.find((item: any) => Number(item.id) === Number(newVal))
    if (selectedSp) {
      form.value.id_ss = selectedSp.id_ss ? Number(selectedSp.id_ss) : null
      form.value.id_is = selectedSp.id_is ? Number(selectedSp.id_is) : null
      form.value.id_ip = selectedSp.id ? Number(selectedSp.id) : null
    }
  } else {
    form.value.id_ss = null
    form.value.id_is = null
    form.value.id_ip = null
  }
})

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true

  try {
    const skId = Number(id)
    const combinedName = form.value.kode_indikator
      ? `[${form.value.kode_indikator}] ${form.value.nama_indikator}`
      : form.value.nama_indikator

    // 1. Update Sasaran Kegiatan (nama & pengampu/unit)
    const skRes = await $fetch<any>(`/api/sasaran-kegiatan/${skId}`, {
      method: 'PUT',
      body: {
        nama_sk: form.value.sasaran_kegiatan_text,
        pengampu: form.value.unit_kerja || null,
      }
    })
    if (skRes?.success === false) {
      toast.error(skRes.message || 'Gagal memperbarui sasaran kegiatan.')
      return
    }

    // 2. Update Indikator Kinerja jika ada
    const indikatorId = Number(detail.value?.indikatorId || (Array.isArray(detail.value) ? detail.value[0]?.indikatorId : null))
    if (indikatorId) {
      const ikuRes = await $fetch<any>(`/api/indikator-kinerja/${indikatorId}`, {
        method: 'PUT',
        body: {
          nama_iku: combinedName,
          satuan: form.value.satuan,
          targets: {
            '2025': form.value.target_1,
            '2026': form.value.target_2,
            '2027': form.value.target_3,
            '2028': form.value.target_4,
            '2029': form.value.target_5
          }
        }
      })
      if (ikuRes?.success === false) {
        toast.error(ikuRes.message || 'Gagal memperbarui indikator kinerja.')
        return
      }
    }

    toast.success('Data master berhasil diperbarui.')
    router.push(`/${route.params.slug}/master-sasaran-kegiatan`)
  } catch (error: any) {
    console.error('Error:', error)
    const msg = error?.data?.message || error?.message || 'Gagal memperbarui data master.'
    toast.error(msg)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between px-2">
      <div class="flex items-start gap-4">
        <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
          <IconDatabase :size="28" stroke-width="2.5" />
        </div>
        <div>
          <h1 class="text-2xl font-black text-slate-900 tracking-tight">Master Data: Tambah Sasaran Strategis</h1>
          <p class="text-slate-500 font-medium text-sm mt-0.5">
            Formulir kustomisasi master data sasaran strategis (Tabel Form Style).
          </p>
        </div>
      </div>
      <div class="px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
        <span class="text-[10px] font-black uppercase tracking-widest text-[#2663A3]">Administrator</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
        <!-- Table Form Header -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
          <IconFileText :size="20" class="text-slate-500" stroke-width="2.5" />
          <h2 class="text-slate-700 font-bold text-sm uppercase tracking-wider">Formulir Data Sasaran Strategis</h2>
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
                  maxlength="10"
                  class="w-full md:w-1/3 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Max 10 digit"
                />
              </td>
            </tr>            <!-- 2. Unit Kerja -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Unit Kerja <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <div class="relative max-w-xl">
                  <select
                    v-model="form.unitKerjaId"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  >
                    <option :value="null" disabled>-- Pilih Unit Kerja --</option>
                    <option v-for="u in unitList" :key="u.id" :value="u.id">{{ u.nama }}</option>
                  </select>
                  <IconChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" :size="18" />
                </div>
              </td>
            </tr>

            <!-- 4. Sasaran Strategis -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">2. Sasaran Strategis <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.sasaranText"
                  type="text"
                  required
                  maxlength="50"
                  class="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Sasaran Strategis"
                />
              </td>
            </tr>

            <!-- 5. Indikator Kinerja & Target -->
            <tr v-for="(ind, idx) in form.indikatorList" :key="idx" class="border-b border-slate-100 group">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700 align-top pt-8">
                3.{{ idx + 1 }} Indikator Kinerja <span class="text-red-500">*</span>
              </td>
              <td class="px-8 py-8 space-y-6">
                <div class="flex gap-2">
                  <input
                    v-model="ind.nama"
                    type="text"
                    required
                    maxlength="50"
                    class="flex-1 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] transition-all"
                    placeholder="Nama Indikator Kinerja"
                  />
                  <button v-if="idx > 0" @click="removeIndikator(idx)" type="button" class="p-2.5 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                    <IconTrash :size="18" />
                  </button>
                </div>

                <div class="space-y-4 pt-4 border-t border-slate-50">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Capaian (5 Periode)</label>
                  <div class="grid grid-cols-5 gap-4">
                    <div v-for="n in 5" :key="n" class="space-y-2">
                      <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center block">Tahun {{ n }}</label>
                      <input
                        v-model="ind.targets[n-1]"
                        type="text"
                        required
                        maxlength="10"
                        class="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-2 py-2.5 text-center font-bold text-slate-700 focus:bg-white focus:border-[#2663A3] transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Tombol Tambah Indikator -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50"></td>
              <td class="px-8 py-5">
                <button @click="addIndikator" type="button" class="text-xs font-bold text-[#2663A3] hover:underline flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-lg">
                  <IconPlus :size="14" stroke-width="3" /> Tambah Indikator Kinerja Lainnya
                </button>
              </td>
            </tr>

            <!-- 6. Satuan -->
            <tr class="border-b border-slate-100">
              <td class="w-1/4 px-8 py-5 bg-slate-50/50 font-bold text-slate-700">4. Satuan <span class="text-red-500">*</span></td>
              <td class="px-8 py-5">
                <input
                  v-model="form.satuan"
                  type="text"
                  required
                  maxlength="20"
                  class="w-full md:w-1/2 bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Contoh: Persen, Dokumen, dll"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          @click="router.push(`/${route.params.slug}/master-sasaran-strategis`)"
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
          Simpan Data Master
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconDatabase, IconFileText, IconTrash, IconPlus, IconX, IconDeviceFloppy, IconChevronDown
} from '@tabler/icons-vue'
import useSWRV from 'swrv'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)

const form = ref({
  kode: '',
  unitKerjaId: null as number | null,
  sasaranText: '',
  satuan: '',
  indikatorList: [
    { nama: '', targets: ['', '', '', '', ''] }
  ]
})

function addIndikator() {
  form.value.indikatorList.push({ nama: '', targets: ['', '', '', '', ''] })
}

function removeIndikator(index: number) {
  form.value.indikatorList.splice(index, 1)
}

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true
  try {
    // 1. Create Sasaran Strategis
    const ssResult = await $fetch<any[]>('/api/sasaran-strategis', {
      method: 'POST',
      body: {
        kode: form.value.kode,
        sasaranText: form.value.sasaranText,
        unitKerjaId: form.value.unitKerjaId,
      }
    })
    
    const ssId = ssResult[0]?.id
    if (!ssId) throw new Error('Gagal mendapatkan ID Sasaran Strategis')

    // 2. Create Indicators and Targets
    for (const ind of form.value.indikatorList) {
      if (!ind.nama) continue

      const indResult = await $fetch<any[]>('/api/indikator-strategis', {
        method: 'POST',
        body: {
          sasaranStrategisId: ssId,
          nama: ind.nama,
          satuan: form.value.satuan
        }
      })

      const indId = indResult[0]?.id
      if (indId) {
        // Create 5 years of targets
        const startYear = 2025 // Adjusted to match DB constraint (2025-2029)
        for (let i = 0; i < 5; i++) {
          await $fetch('/api/target-indikator-strategis', {
            method: 'POST',
            body: {
              indikatorId: indId,
              tahun: startYear + i,
              target: ind.targets[i] || '0'
            }
          })
        }
      }
    }

    router.push(`/${route.params.slug}/master-sasaran-strategis`)
  } catch (error: any) {
    console.error('Error:', error)
    const msg = error.data?.statusMessage || error.message || 'Terjadi kesalahan sistem'
    alert(`Gagal menyimpan data master: ${msg}`)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Table-like form refinement */
table tr:last-child {
  border-bottom: none;
}
</style>

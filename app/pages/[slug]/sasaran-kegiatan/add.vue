<template>
  <div class="max-w-3xl mx-auto pb-10 space-y-4">
    <button
      @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
      class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#2663A3]"
    >
      <IconArrowLeft :size="16" />
      Kembali
    </button>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h1 class="text-xl font-bold text-slate-800">Tambah Sasaran Kegiatan</h1>
        <p class="text-sm text-slate-500 mt-1">Form untuk menambah sasaran kegiatan, indikator, dan target.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Sasaran Kegiatan -->
        <div class="space-y-4">
          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <label for="kode" class="block text-sm font-semibold text-slate-700 sm:w-44 sm:shrink-0">Kode</label>
            <div class="sm:flex-1">
              <input
                id="kode"
                v-model="form.kode"
                type="text"
                class="field-input"
                placeholder="Contoh: SK-01.01"
              />
            </div>
          </div>

          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <label for="idSp" class="block text-sm font-semibold text-slate-700 sm:w-44 sm:shrink-0">Sasaran Program <span class="text-red-500">*</span></label>
            <div class="sm:flex-1">
              <select id="idSp" v-model="form.idSp" required class="field-input">
                <option :value="null" disabled>-- Pilih Sasaran Program --</option>
                <option v-for="s in uniqueSasaranProgramList" :key="s.id" :value="s.id">
                  {{ s.kode ? `${s.kode} - ${s.sasaranText}` : s.sasaranText }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
            <label for="sasaranText" class="block text-sm font-semibold text-slate-700 sm:w-44 sm:shrink-0 sm:pt-3">Sasaran Kegiatan <span class="text-red-500">*</span></label>
            <div class="sm:flex-1">
              <textarea
                id="sasaranText"
                v-model="form.sasaranText"
                required
                class="field-input min-h-28"
                placeholder="Masukkan sasaran kegiatan..."
              ></textarea>
            </div>
          </div>

          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <label for="unitKerjaId" class="block text-sm font-semibold text-slate-700 sm:w-44 sm:shrink-0">Unit Kerja <span class="text-red-500">*</span></label>
            <div class="sm:flex-1">
              <select id="unitKerjaId" v-model="form.unitKerjaId" required class="field-input">
                <option :value="null" disabled>-- Pilih Unit Kerja --</option>
                <option v-for="u in (units as any[] ?? [])" :key="u.id" :value="u.id">
                  {{ u.nama }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Indikator Kegiatan -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-700 uppercase tracking-wide">Indikator Kegiatan</h2>
            <button
              type="button"
              @click="addIndikator"
              class="inline-flex items-center gap-1.5 text-sm text-[#2663A3] font-semibold hover:underline"
            >
              <IconPlus :size="15" />
              Tambah Indikator
            </button>
          </div>

          <div
            v-for="(ind, idx) in form.indikatorList"
            :key="idx"
            class="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/50"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wide">Indikator {{ idx + 1 }}</span>
              <button
                v-if="form.indikatorList.length > 1"
                type="button"
                @click="removeIndikator(idx)"
                class="text-xs text-red-400 hover:text-red-600 font-semibold"
              >
                Hapus
              </button>
            </div>

            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <label class="block text-xs font-semibold text-slate-600 sm:w-44 sm:shrink-0">Nama Indikator</label>
              <div class="sm:flex-1">
                <input
                  v-model="ind.nama"
                  type="text"
                  class="field-input text-sm"
                  placeholder="Masukkan nama indikator..."
                />
              </div>
            </div>
            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
              <label class="block text-xs font-semibold text-slate-600 sm:w-44 sm:shrink-0">Satuan</label>
              <div class="sm:flex-1">
                <input
                  v-model="ind.satuan"
                  type="text"
                  class="field-input text-sm"
                  placeholder="Contoh: %, poin, dokumen..."
                />
              </div>
            </div>

            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
              <label class="block text-xs font-semibold text-slate-600 sm:w-44 sm:shrink-0 sm:pt-2">Target per Tahun</label>
              <div class="sm:flex-1">
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div v-for="t in ind.targets" :key="t.tahun" class="space-y-1">
                    <span class="block text-xs text-slate-500 text-center">{{ t.tahun }}</span>
                    <input
                      v-model="t.target"
                      type="number"
                      step="any"
                      class="field-input text-sm text-center px-2"
                      placeholder="-"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
            class="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2.5 rounded-lg bg-[#2663A3] text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50"
          >
            {{ submitting ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useSWRV from 'swrv'
import { IconArrowLeft, IconPlus } from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const targetYears = [2025, 2026, 2027, 2028, 2029]

const fetcher = (url: string) => fetch(url).then(r => r.json())

const { data: units } = useSWRV('/api/unit-kerja', fetcher)
const { data: sasaranProgramRaw } = useSWRV('/api/sasaran-program?limit=1000', fetcher)

type SasaranProgramOption = {
  id: number
  kode: string | null
  sasaranText: string
}

const uniqueSasaranProgramList = computed<SasaranProgramOption[]>(() => {
  const source = sasaranProgramRaw.value && !Array.isArray(sasaranProgramRaw.value) && sasaranProgramRaw.value.data 
    ? sasaranProgramRaw.value.data 
    : (sasaranProgramRaw.value ?? [])
  
  const map = new Map<number, SasaranProgramOption>()
  for (const row of source as any[]) {
    if (row.id != null && !map.has(row.id)) {
      map.set(row.id, {
        id: row.id,
        kode: row.kode ?? null,
        sasaranText: row.sasaranText,
      })
    }
  }
  return Array.from(map.values())
})

function makeIndikator() {
  return {
    nama: '',
    satuan: '',
    targets: targetYears.map(tahun => ({ tahun, target: '' as string | number })),
  }
}

const form = ref({
  kode: '',
  idSp: null as number | null,
  sasaranText: '',
  unitKerjaId: null as number | null,
  indikatorList: [makeIndikator()],
})

function addIndikator() {
  form.value.indikatorList.push(makeIndikator())
}

function removeIndikator(idx: number) {
  form.value.indikatorList.splice(idx, 1)
}

const handleSubmit = async () => {
  if (!form.value.sasaranText.trim() || !form.value.idSp || !form.value.unitKerjaId) return

  submitting.value = true
  try {
    const sk = await $fetch<{ id: number }[]>('/api/sasaran-kegiatan', {
      method: 'POST',
      body: {
        idSp: form.value.idSp,
        kode: form.value.kode || null,
        sasaranText: form.value.sasaranText,
        unitKerjaId: form.value.unitKerjaId,
        indikatorList: form.value.indikatorList,
      },
    })

    const skId = sk[0]?.id
    if (!skId) throw new Error('Gagal mendapatkan ID sasaran kegiatan')

    router.push(`/${route.params.slug}/sasaran-kegiatan`)
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Gagal menyimpan data utama ke server. Silakan coba lagi.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.field-input {
  width: 100%;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgb(30 41 59);
  background-color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.field-input:focus {
  outline: none;
  border-color: #2663A3;
  box-shadow: 0 0 0 4px rgba(38, 99, 163, 0.1);
}

.field-input::placeholder {
  color: rgb(203 213 225);
}

select.field-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.5rem;
}
</style>

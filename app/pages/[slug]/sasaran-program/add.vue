<template>
  <div class="max-w-3xl mx-auto pb-10 space-y-4">
    <button
      @click="router.push(`/${$route.params.slug}/sasaran-program`)"
      class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#2663A3]"
    >
      <IconArrowLeft :size="16" />
      Kembali
    </button>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h1 class="text-xl font-bold text-slate-800">Tambah Sasaran Program</h1>
        <p class="text-sm text-slate-500 mt-1">Form untuk menambah sasaran program, unit kerja, indikator, dan target.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Sasaran Program -->
        <div class="space-y-4">
          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <label for="kode" class="block text-sm font-semibold text-slate-700 sm:w-44 sm:shrink-0">Kode</label>
            <div class="sm:flex-1">
              <input
                id="kode"
                v-model="form.kode"
                type="text"
                class="field-input"
                placeholder="Contoh: SP-01.01"
              />
            </div>
          </div>

          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <label for="idSs" class="block text-sm font-semibold text-slate-700 sm:w-44 sm:shrink-0">Sasaran Strategis <span class="text-red-500">*</span></label>
            <div class="sm:flex-1">
              <select id="idSs" v-model="form.idSs" required class="field-input">
                <option :value="null" disabled>-- Pilih Sasaran Strategis --</option>
                <option v-for="s in uniqueSasaranStrategisList" :key="s.id" :value="s.id">{{ s.kode ? `${s.kode} - ${s.sasaranText}` : s.sasaranText }}</option>
              </select>
            </div>
          </div>

          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
            <label for="sasaranText" class="block text-sm font-semibold text-slate-700 sm:w-44 sm:shrink-0 sm:pt-3">Sasaran Program <span class="text-red-500">*</span></label>
            <div class="sm:flex-1">
              <textarea
                id="sasaranText"
                v-model="form.sasaranText"
                required
                class="field-input min-h-28"
                placeholder="Masukkan sasaran program..."
              ></textarea>
            </div>
          </div>

          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
            <label class="block text-sm font-semibold text-slate-700 sm:w-44 sm:shrink-0 sm:pt-1">Unit Kerja</label>
            <div class="sm:flex-1 space-y-2">
              <div class="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/40">
                <label
                  v-for="u in (units as any[] ?? [])"
                  :key="u.id"
                  class="flex items-start gap-2 py-1.5 text-sm text-slate-700 cursor-pointer"
                >
                  <input v-model="form.unitKerjaIds" type="checkbox" :value="u.id" class="mt-0.5" />
                  <span>{{ u.nama }}</span>
                </label>
              </div>
              <p class="text-xs text-slate-500">Boleh pilih lebih dari satu unit kerja.</p>
            </div>
          </div>
        </div>

        <!-- Indikator Program -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-700 uppercase tracking-wide">Indikator Program</h2>
            <button
              type="button"
              @click="addIndikator"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <IconPlus :size="14" />
              Tambah Indikator
            </button>
          </div>

          <div
            v-for="(indikator, iIdx) in form.indikatorList"
            :key="iIdx"
            class="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/50"
          >
            <div class="flex items-start gap-3">
              <div class="flex-1 space-y-4">
                <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
                  <label class="block text-xs font-semibold text-slate-600 sm:w-44 sm:shrink-0">Nama Indikator {{ iIdx + 1 }}</label>
                  <div class="sm:flex-1">
                    <input
                      v-model="indikator.nama"
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
                      v-model="indikator.satuan"
                      type="text"
                      class="field-input text-sm"
                      placeholder="Contoh: %, poin, dokumen..."
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                @click="removeIndikator(iIdx)"
                class="mt-1 p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              >
                <IconTrash :size="16" />
              </button>
            </div>

            <div class="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
              <label class="block text-xs font-semibold text-slate-600 sm:w-44 sm:shrink-0 sm:pt-2">Target per Tahun</label>
              <div class="sm:flex-1">
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div v-for="t in indikator.targets" :key="t.tahun" class="space-y-1">
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

          <div v-if="form.indikatorList.length === 0" class="text-center py-6 border border-dashed border-slate-300 rounded-xl text-sm text-slate-400">
            Belum ada indikator. Klik "Tambah Indikator" untuk menambah.
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="router.push(`/${$route.params.slug}/sasaran-program`)"
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
import { IconArrowLeft, IconPlus, IconTrash } from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const targetYears = [2025, 2026, 2027, 2028, 2029]

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: units } = useSWRV('/api/unit-kerja', fetcher)
const { data: sasaranStrategisRaw } = useSWRV('/api/sasaran-strategis', fetcher)

type SasaranStrategisOption = {
  id: number
  kode: string | null
  sasaranText: string
}

const uniqueSasaranStrategisList = computed<SasaranStrategisOption[]>(() => {
  const rows = (sasaranStrategisRaw.value ?? []) as any[]
  const map = new Map<number, SasaranStrategisOption>()
  for (const row of rows) {
    if (row.ssId != null && !map.has(row.ssId)) {
      map.set(row.ssId, {
        id: row.ssId,
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
    targets: targetYears.map(tahun => ({ tahun, target: '' })),
  }
}

const form = ref({
  kode: '',
  idSs: null as number | null,
  sasaranText: '',
  unitKerjaIds: [] as number[],
  indikatorList: [makeIndikator()] as ReturnType<typeof makeIndikator>[],
})

function addIndikator() {
  form.value.indikatorList.push(makeIndikator())
}

function removeIndikator(index: number) {
  form.value.indikatorList.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.sasaranText.trim() || !form.value.idSs) return

  submitting.value = true
  try {
    const sp = await $fetch<{ id: number }[]>('/api/sasaran-program', {
      method: 'POST',
      body: {
        idSs: form.value.idSs,
        kode: form.value.kode || null,
        sasaranText: form.value.sasaranText,
        unitKerjaIds: form.value.unitKerjaIds,
      },
    })

    const spId = sp[0]?.id
    if (!spId) throw new Error('Gagal mendapatkan ID sasaran program')

    for (const indikator of form.value.indikatorList) {
      if (!indikator.nama.trim()) continue

      const ind = await $fetch<{ id: number }[]>('/api/indikator-program', {
        method: 'POST',
        body: {
          sasaranProgramId: spId,
          nama: indikator.nama,
          satuan: indikator.satuan || null,
        },
      })

      const indId = ind[0]?.id
      if (!indId) continue

      for (const t of indikator.targets) {
        if (t.target === '' || t.target === null) continue
        await $fetch('/api/target-indikator-program', {
          method: 'POST',
          body: {
            indikatorId: indId,
            tahun: t.tahun,
            target: t.target,
          },
        })
      }
    }

    router.push(`/${route.params.slug}/sasaran-program`)
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Gagal menyimpan data ke server. Silakan coba lagi.')
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
</style>

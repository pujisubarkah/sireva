<template>
  <div class="max-w-4xl mx-auto pb-10">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold">Edit Sasaran Kegiatan</h1>
      <button
        @click="router.push(`/${$route.params.slug}/sasaran-kegiatan`)"
        class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#2663A3]"
      >
        <IconArrowLeft :size="16" />
        Kembali
      </button>
    </div>

    <div v-if="fetching" class="py-8 text-center text-slate-500">Memuat data...</div>

    <div v-else class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h2 class="text-lg font-bold text-slate-800">Ubah Data Sasaran Kegiatan</h2>
        <p class="text-sm text-slate-500 mt-1">Perbarui sasaran kegiatan, unit kerja, indikator, dan target tahunan.</p>
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

        <div class="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 mt-4">
          <button
            type="button"
            @click="handleDelete"
            class="px-5 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50"
          >
            Hapus Kegiatan
          </button>
          <div class="flex gap-3">
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
              {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useSWRV from 'swrv'
import { IconArrowLeft, IconPlus } from '@tabler/icons-vue'

type UnitKerja = { id: number; nama: string }
type SasaranProgramOption = { id: number; kode: string | null; sasaranText: string }
type TargetItem = { tahun: number; target: string | number | null }
type IndikatorItem = { nama: string; satuan: string; targets: TargetItem[] }

const route = useRoute()
const router = useRouter()
const sasaranId = Number(route.query.id)
const targetYears = [2025, 2026, 2027, 2028, 2029]

const fetching = ref(true)
const submitting = ref(false)
const units = ref<UnitKerja[]>([])

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: sasaranProgramRaw } = useSWRV('/api/sasaran-program?limit=1000', fetcher)

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

function makeIndikator(): IndikatorItem {
  return {
    nama: '',
    satuan: '',
    targets: targetYears.map(tahun => ({ tahun, target: '' as string | number | null })),
  }
}

const form = ref({
  kode: '',
  idSp: null as number | null,
  sasaranText: '',
  unitKerjaId: null as number | null,
  indikatorList: [makeIndikator()] as IndikatorItem[],
})

function addIndikator() {
  form.value.indikatorList.push(makeIndikator())
}

function removeIndikator(idx: number) {
  form.value.indikatorList.splice(idx, 1)
}

onMounted(async () => {
  if (!sasaranId) {
    alert('ID Sasaran Kegiatan tidak ditemukan.')
    router.push(`/${route.params.slug}/sasaran-kegiatan`)
    return
  }

  try {
    fetching.value = true

    const [unitRows, detailRows] = await Promise.all([
      $fetch<UnitKerja[]>('/api/unit-kerja'),
      $fetch<any[]>(`/api/sasaran-kegiatan/${sasaranId}`),
    ])

    units.value = unitRows ?? []

    const first = (detailRows ?? [])[0]
    if (!first) throw new Error('Data sasaran kegiatan tidak ditemukan.')

    const indikatorMap = new Map<number, IndikatorItem>()
    for (const row of (detailRows ?? [])) {
      if (!row.indikatorId) continue
      if (!indikatorMap.has(row.indikatorId)) {
        const normalizedTargets = targetYears.map((tahun) => {
          const found = (row.targets ?? []).find((t: any) => Number(t.tahun) === tahun)
          return { tahun, target: found?.target?.toString?.() ?? '' }
        })
        indikatorMap.set(row.indikatorId, {
          nama: row.indikatorNama ?? '',
          satuan: row.indikatorSatuan ?? '',
          targets: normalizedTargets,
        })
      }
    }

    const indikatorList = Array.from(indikatorMap.values())

    form.value = {
      kode: first.kode ?? '',
      idSp: first.idSp ?? null,
      sasaranText: first.sasaranText ?? '',
      unitKerjaId: first.unitKerjaId ?? null,
      indikatorList: indikatorList.length > 0 ? indikatorList : [makeIndikator()],
    }
  } catch (error) {
    console.error('Gagal mengambil data:', error)
    alert('Terjadi kesalahan saat memuat data.')
  } finally {
    fetching.value = false
  }
})

const handleSubmit = async () => {
  if (!form.value.sasaranText.trim() || !form.value.idSp || !form.value.unitKerjaId) {
    alert('Harap lengkapi isian Sasaran Program, Sasaran Kegiatan, dan Unit Kerja.')
    return
  }

  submitting.value = true
  try {
    const result = await $fetch<any>(`/api/sasaran-kegiatan/${sasaranId}`, {
      method: 'PUT',
      body: {
        idSp: form.value.idSp,
        kode: form.value.kode || null,
        sasaranText: form.value.sasaranText,
        unitKerjaId: form.value.unitKerjaId,
        indikatorList: form.value.indikatorList, // Backend API expects an array
      },
    })

    if (result) {
      router.push(`/${route.params.slug}/sasaran-kegiatan`)
    } else {
      alert('Gagal menyimpan perubahan.')
    }
  } catch (error) {
    console.error('Error updating data:', error)
    alert('Gagal menyimpan perubahan ke server.')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus sasaran kegiatan ini? Indikator dan target terkait juga akan terhapus jika diatur pada skema database.')) return

  try {
    await $fetch(`/api/sasaran-kegiatan/${sasaranId}`, {
      method: 'DELETE',
    })
    router.push(`/${route.params.slug}/sasaran-kegiatan`)
  } catch (error) {
    console.error(error)
    alert('Gagal menghapus data.')
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

<template>
  <div class="max-w-4xl mx-auto pb-10 space-y-6 mt-4">
    <!-- Breadcrumb & Header -->
    <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
      <button @click="router.push(`/${$route.params.slug}/sasaran-program`)" class="hover:text-[#2663A3] transition-colors flex items-center gap-1">
        <IconArrowLeft :size="14" />
        Sasaran Program
      </button>
      <span>/</span>
      <span class="text-slate-600 tracking-normal capitalize font-black">Edit Sasaran</span>
    </div>

    <div class="flex items-center gap-3 mb-2">
      <div class="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
        <IconPencil :size="24" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Edit Sasaran Program</h1>
        <p class="text-sm text-slate-500 mt-1">Sesuaikan rincian sasaran program, unit kerja, dan target indikator.</p>
      </div>
    </div>

    <div v-if="fetching" class="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-sm">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
      <p class="text-slate-500 font-bold tracking-widest text-xs uppercase">Menyiapkan Data...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section 01: Metadata -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
          <IconTarget :size="20" class="text-blue-600" />
          <h2 class="text-sm font-bold text-blue-700 uppercase tracking-wider">01. Informasi Sasaran</h2>
        </div>

        <div class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="kode" class="block text-sm font-semibold text-slate-700">Kode Sasaran</label>
              <input id="kode" v-model="form.kode" type="text" class="field-input" placeholder="Contoh: SP-01.01" />
            </div>
            <div class="space-y-2">
              <label for="idSs" class="block text-sm font-semibold text-slate-700">Sasaran Strategis <span class="text-red-500">*</span></label>
              <select id="idSs" v-model="form.idSs" required class="field-input">
                <option :value="null" disabled>-- Pilih Sasaran Strategis --</option>
                <option v-for="s in uniqueSasaranStrategisList" :key="s.id" :value="s.id">
                  {{ s.kode ? `${s.kode} - ${s.sasaranText}` : s.sasaranText }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label for="sasaranText" class="block text-sm font-semibold text-slate-700">Deskripsi Sasaran Program <span class="text-red-500">*</span></label>
            <textarea id="sasaranText" v-model="form.sasaranText" required class="field-input min-h-24" placeholder="Masukkan sasaran program..."></textarea>
          </div>

          <!-- Unit Kerja -->
          <div class="space-y-3">
            <label class="block text-sm font-semibold text-slate-700">Unit Kerja Pelaksana</label>
            <div class="max-h-56 overflow-y-auto border border-slate-200 rounded-2xl p-4 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
              <label
                v-for="u in units"
                :key="u.id"
                class="flex items-center gap-3 py-1.5 text-sm text-slate-700 cursor-pointer hover:bg-white rounded-lg px-2 transition-colors group"
              >
                <input v-model="form.unitKerjaIds" type="checkbox" :value="u.id" class="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span class="group-hover:text-blue-700 font-medium transition-colors">{{ u.nama }}</span>
              </label>
            </div>
            <p class="text-[11px] text-slate-400 italic">* Pilih satu atau lebih unit kerja yang bertanggung jawab.</p>
          </div>
        </div>
      </div>

      <!-- Section 02: Indikator & Target -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <IconListDetails :size="20" class="text-indigo-600" />
            <h2 class="text-sm font-bold text-indigo-700 uppercase tracking-wider">02. Indikator & Target</h2>
          </div>
          <button
            type="button"
            @click="addIndikator"
            class="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[11px] font-black uppercase tracking-widest border border-indigo-200 hover:bg-indigo-100 transition-all flex items-center gap-2"
          >
            <IconPlus :size="14" stroke-width="3" />
            Tambah Indikator
          </button>
        </div>

        <div class="p-8 space-y-8">
          <div
            v-for="(indikator, iIdx) in form.indikatorList"
            :key="iIdx"
            class="relative p-6 rounded-2xl border border-slate-100 bg-slate-50/30 space-y-6 hover:border-indigo-200 transition-all group"
          >
            <button
              type="button"
              @click="removeIndikator(iIdx)"
              class="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              title="Hapus Indikator"
            >
              <IconTrash :size="18" />
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Nama Indikator {{ iIdx + 1 }}</label>
                <input v-model="indikator.nama" type="text" class="field-input text-sm font-bold" placeholder="Masukkan nama indikator..." />
              </div>
              <div class="space-y-2">
                <label class="block text-xs font-black text-slate-400 uppercase tracking-widest">Satuan</label>
                <input v-model="indikator.satuan" type="text" class="field-input text-sm" placeholder="Contoh: %, poin, dokumen..." />
              </div>
            </div>

            <div class="space-y-3">
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Tahunan</label>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div v-for="t in indikator.targets" :key="t.tahun" class="space-y-1.5 p-3 bg-white rounded-xl border border-slate-100 text-center shadow-sm">
                  <span class="block text-[10px] font-black text-slate-400 uppercase">{{ t.tahun }}</span>
                  <input v-model="t.target" type="number" step="any" class="w-full text-center text-sm font-black text-blue-600 focus:outline-none" placeholder="-" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="form.indikatorList.length === 0" class="text-center py-12 border border-dashed border-slate-200 rounded-3xl text-slate-400">
            <IconClipboardList :size="48" class="mx-auto mb-4 opacity-20" />
            <p class="text-sm font-bold">Belum ada indikator yang ditetapkan.</p>
            <p class="text-xs mt-1">Klik tombol di kanan atas untuk menambah indikator.</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-between pt-4 px-2">
        <button
          type="button"
          @click="handleDelete"
          class="px-6 py-3 rounded-2xl bg-red-50 text-red-600 text-sm font-black hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
        >
          <IconTrash :size="18" />
          Hapus Sasaran
        </button>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="router.push(`/${$route.params.slug}/sasaran-program`)"
            class="px-8 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 text-sm font-black hover:bg-slate-50 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-10 py-3 rounded-2xl bg-[#2663A3] text-white text-sm font-black shadow-xl shadow-blue-700/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <IconDeviceFloppy :size="18" />
            {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * Komponen Sasaran Program Edit Standardized
 */

definePageMeta({ layout: 'dashboard' })

import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useSWRV from 'swrv'
import { 
  IconArrowLeft, IconPencil, IconTarget, IconListDetails, 
  IconPlus, IconTrash, IconDeviceFloppy, IconClipboardList 
} from '@tabler/icons-vue'

type UnitKerja = { id: number; nama: string }
type SasaranStrategisOption = { id: number; kode: string | null; sasaranText: string }
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
const { data: sasaranStrategisRaw } = useSWRV('/api/sasaran-strategis', fetcher)

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

const form = ref({
  kode: '',
  idSs: null as number | null,
  sasaranText: '',
  unitKerjaIds: [] as number[],
  indikatorList: [] as IndikatorItem[],
})

function makeIndikator() {
  return {
    nama: '',
    satuan: '',
    targets: targetYears.map(tahun => ({ tahun, target: '' })),
  }
}

function addIndikator() {
  form.value.indikatorList.push(makeIndikator())
}

function removeIndikator(index: number) {
  form.value.indikatorList.splice(index, 1)
}

onMounted(async () => {
  if (!sasaranId) {
    router.push(`/${route.params.slug}/sasaran-program`)
    return
  }

  try {
    fetching.value = true
    const [unitRows, detailRows] = await Promise.all([
      $fetch<UnitKerja[]>('/api/unit-kerja'),
      $fetch<any[]>(`/api/sasaran-program/${sasaranId}`),
    ])

    units.value = unitRows ?? []
    const first = (detailRows ?? [])[0]
    if (!first) throw new Error('Data tidak ditemukan.')

    const indikatorMap = new Map<number, IndikatorItem>()
    for (const row of detailRows) {
      if (!row.indikatorId) continue
      if (!indikatorMap.has(row.indikatorId)) {
        const normalizedTargets = targetYears.map((tahun) => {
          const found = (row.targets ?? []).find((t: any) => Number(t.tahun) === tahun)
          return { tahun, target: found?.target || '' }
        })

        indikatorMap.set(row.indikatorId, {
          nama: row.indikatorNama ?? '',
          satuan: row.indikatorSatuan ?? '',
          targets: normalizedTargets,
        })
      }
    }

    const indikatorList = Array.from(indikatorMap.values())
    const selectedIds = units.value
      .filter(u => (first.unitKerjaNames ?? []).includes(u.nama))
      .map(u => u.id)

    form.value = {
      kode: first.kode ?? '',
      idSs: first.idSs ?? null,
      sasaranText: first.sasaranText ?? '',
      unitKerjaIds: selectedIds,
      indikatorList: indikatorList.length ? indikatorList : [makeIndikator()],
    }
  } catch (error) {
    console.error('Fetch error:', error)
  } finally {
    fetching.value = false
  }
})

const handleSubmit = async () => {
  if (!form.value.sasaranText.trim()) return
  submitting.value = true
  try {
    await $fetch(`/api/sasaran-program/${sasaranId}`, {
      method: 'PUT',
      body: {
        idSs: form.value.idSs,
        kode: form.value.kode || null,
        sasaranText: form.value.sasaranText,
        unitKerjaIds: form.value.unitKerjaIds,
        indikatorList: form.value.indikatorList,
      }
    })
    router.push(`/${route.params.slug}/sasaran-program`)
  } catch (error) {
    alert('Gagal menyimpan perubahan.')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  if (!confirm('Hapus sasaran program ini?')) return
  try {
    await $fetch(`/api/sasaran-program/${sasaranId}`, { method: 'DELETE' })
    router.push(`/${route.params.slug}/sasaran-program`)
  } catch (error) {
    alert('Gagal menghapus data.')
  }
}
</script>

<style scoped>
@reference "@/assets/css/main.css";

.field-input {
  @apply w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 bg-white transition-all duration-200 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-[#2663A3]/10 hover:border-slate-300;
}
</style>

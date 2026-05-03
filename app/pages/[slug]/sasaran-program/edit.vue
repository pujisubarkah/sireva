<template>
  <div class="max-w-4xl mx-auto pb-10">
    <h1 class="text-xl font-bold mb-4">Edit Sasaran Program</h1>

    <div v-if="fetching" class="py-8">Memuat data...</div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-5">
      <div>
        <label for="kode" class="block text-sm font-semibold mb-1">Kode</label>
        <input id="kode" v-model="form.kode" type="text" class="field-input" />
      </div>

      <div>
        <label for="idSs" class="block text-sm font-semibold mb-1">Sasaran Strategis</label>
        <select id="idSs" v-model="form.idSs" required class="field-input">
          <option :value="null" disabled>-- Pilih Sasaran Strategis --</option>
          <option v-for="s in uniqueSasaranStrategisList" :key="s.id" :value="s.id">{{ s.kode ? `${s.kode} - ${s.sasaranText}` : s.sasaranText }}</option>
        </select>
      </div>

      <div>
        <label for="sasaranText" class="block text-sm font-semibold mb-1">Sasaran Program</label>
        <textarea id="sasaranText" v-model="form.sasaranText" required class="field-input min-h-24"></textarea>
      </div>

      <div>
        <label class="block text-sm font-semibold mb-1">Unit Kerja</label>
        <div class="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3">
          <label v-for="u in units" :key="u.id" class="flex items-center gap-2 py-1 text-sm">
            <input v-model="form.unitKerjaIds" type="checkbox" :value="u.id" />
            <span>{{ u.nama }}</span>
          </label>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-semibold">Indikator Program</label>
          <button type="button" @click="addIndikator" class="px-3 py-1 border rounded text-sm">Tambah Indikator</button>
        </div>

        <div v-for="(indikator, iIdx) in form.indikatorList" :key="iIdx" class="border rounded p-3 mb-3 space-y-3">
          <div>
            <label class="block text-sm font-semibold mb-1">Nama Indikator {{ iIdx + 1 }}</label>
            <input v-model="indikator.nama" type="text" class="field-input" />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Satuan</label>
            <input v-model="indikator.satuan" type="text" class="field-input" />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2">Target per Tahun</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              <div v-for="t in indikator.targets" :key="t.tahun">
                <label class="block text-xs mb-1">{{ t.tahun }}</label>
                <input v-model="t.target" type="number" step="any" class="field-input" />
              </div>
            </div>
          </div>

          <button type="button" @click="removeIndikator(iIdx)" class="px-3 py-1 border rounded text-sm text-red-600">Hapus Indikator</button>
        </div>

        <div v-if="form.indikatorList.length === 0" class="text-sm text-slate-500">Belum ada indikator.</div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button type="button" @click="handleDelete" class="px-4 py-2 border rounded text-red-600">Hapus</button>
        <button type="button" @click="router.push(`/${$route.params.slug}/sasaran-program`)" class="px-4 py-2 border rounded">Batal</button>
        <button type="submit" :disabled="submitting" class="px-4 py-2 bg-[#2663A3] text-white rounded">
          {{ submitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useSWRV from 'swrv'

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
    alert('ID Sasaran Program tidak ditemukan.')
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
    if (!first) throw new Error('Data sasaran program tidak ditemukan.')

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
    console.error('Gagal mengambil data:', error)
    alert('Terjadi kesalahan saat memuat data.')
  } finally {
    fetching.value = false
  }
})

const handleSubmit = async () => {
  if (!form.value.sasaranText.trim()) {
    alert('Sasaran Program wajib diisi.')
    return
  }

  submitting.value = true
  try {
    const result = await $fetch<any>(`/api/sasaran-program/${sasaranId}`, {
      method: 'PUT',
      body: {
        idSs: form.value.idSs,
        kode: form.value.kode || null,
        sasaranText: form.value.sasaranText,
        unitKerjaIds: form.value.unitKerjaIds,
        indikatorList: form.value.indikatorList,
      },
    })

    if (result) {
      router.push(`/${route.params.slug}/sasaran-program`)
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
  if (!confirm('Apakah Anda yakin ingin menghapus sasaran program ini?')) return

  try {
    await $fetch(`/api/sasaran-program/${sasaranId}`, {
      method: 'DELETE',
    })
    router.push(`/${route.params.slug}/sasaran-program`)
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
  border-color: rgb(37 99 235);
  box-shadow: 0 0 0 4px rgb(191 219 254 / 0.4);
}

.field-input::placeholder {
  color: rgb(203 213 225);
}
</style>

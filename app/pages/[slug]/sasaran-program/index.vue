<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-10">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Sasaran Program</h1>
          <p class="text-sm text-slate-500 mt-1">Daftar sasaran program berdasarkan data master.</p>
        </div>
        <button
          v-if="!isUserOnly"
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-program/add`)"
          class="w-full sm:w-auto px-5 py-2.5 bg-[#2663A3] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition-all"
        >
          <IconPlus :size="18" :stroke="'2'" />
          Tambah Sasaran Program
        </button>
      </div>

      <div class="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-4">
        <div class="relative w-full md:w-80">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconSearch class="w-4 h-4 text-slate-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kode atau sasaran program..."
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div class="inline-block animate-pulse text-slate-500 font-medium">Memuat data sasaran program...</div>
    </div>

    <div v-else-if="filteredRows.length === 0" class="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <IconSearch :size="40" class="text-slate-300" />
      </div>
      <h3 class="text-lg font-bold text-slate-800">Tidak ada sasaran program ditemukan</h3>
      <p class="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Coba sesuaikan kata kunci pencarian Anda.</p>
    </div>

    <div v-else class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-16 text-center">No</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-28">Kode</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-55">Sasaran Program</th>
              <th v-if="!isUserOnly" class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-55">Nama Unit Kerja</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-55">Indikator Program</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-28">Satuan</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-40">Target</th>
              <th v-if="isUserOnly" class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-40">Realisasi</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-36 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(row, index) in filteredRows"
              :key="`${row.id}-${row.indikatorId ?? index}`"
              :class="index % 2 === 0 ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/60 hover:bg-blue-100/60'"
              class="transition-colors"
            >
              <td class="p-4 text-center align-top">
                <span class="text-sm font-bold text-slate-400">{{ index + 1 }}</span>
              </td>
              <td class="p-4 align-top">
                <span class="text-xs font-black text-blue-600 uppercase tracking-tight">{{ row.kode || '-' }}</span>
              </td>
              <td class="p-4 align-top">
                <p class="text-sm font-semibold text-slate-700 leading-snug">{{ row.sasaranText }}</p>
              </td>
              <td v-if="!isUserOnly" class="p-4 align-top">
                <ul v-if="row.unitKerjaNames && row.unitKerjaNames.length" class="space-y-0.5">
                  <li
                    v-for="(name, i) in row.unitKerjaNames"
                    :key="i"
                    class="flex items-start gap-1.5 text-sm font-medium text-slate-700"
                  >
                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                    {{ name }}
                  </li>
                </ul>
                <span v-else class="text-sm text-slate-400">-</span>
              </td>
              <td class="p-4 align-top">
                <p class="text-sm text-slate-700 leading-snug">{{ row.indikatorNama || '-' }}</p>
              </td>
              <td class="p-4 align-top">
                <span class="text-sm text-slate-600">{{ row.indikatorSatuan || '-' }}</span>
              </td>
              <td class="p-4 align-top">
                <div class="flex flex-col gap-1">
                  <span
                    v-for="t in row.targets"
                    :key="t.tahun"
                    class="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {{ t.tahun }}: {{ t.target }}
                  </span>
                </div>
              </td>
              <td v-if="isUserOnly" class="p-4 align-top">
                <div v-if="row.realisasi && row.realisasi.length" class="flex flex-col gap-1">
                  <span
                    v-for="r in row.realisasi"
                    :key="r.tahun"
                    class="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {{ r.tahun }}: {{ r.realisasi }}
                  </span>
                </div>
                <span v-else class="text-sm text-slate-400">-</span>
              </td>
              <td class="p-4 text-center align-top">
                <div class="flex items-center justify-center gap-1">
                  <button
                    @click="router.push(`/${$route.params.slug}/sasaran-program/view?id=${row.id}`)"
                    class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <IconEye :size="18" />
                  </button>
                  <button
                    @click="router.push(`/${$route.params.slug}/sasaran-program/edit?id=${row.id}`)"
                    class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <IconPencil :size="18" />
                  </button>
                  <button
                    @click="handleDelete(row)"
                    class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <IconTrash :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import useSWRV from 'swrv'
import { IconEye, IconPencil, IconPlus, IconSearch, IconTrash } from '@tabler/icons-vue'
import { useAuthUser } from '~/composables/useAuthUser'

type SasaranProgram = {
  id: number
  idSs: number | null
  kode: string | null
  sasaranText: string
  unitKerjaNames: string[]
  indikatorId: number | null
  indikatorKode: string | null
  indikatorNama: string | null
  indikatorSatuan: string | null
  targets: { tahun: number; target: string | number | null }[]
  realisasi?: { tahun: number; realisasi: string | number | null }[]
}

const router = useRouter()
const searchQuery = ref('')
const fetcher = (url: string) => fetch(url).then((r) => r.json())

const { authUser, role } = useAuthUser()
const { data: unitList } = useSWRV<any[]>('/api/unit-kerja', fetcher)

const userUnitKerjaId = computed<number | null>(() => {
  const unitName = String(authUser.value?.unit_kerja || '').trim().toLowerCase()
  if (!unitName) return null

  const found = (unitList.value ?? []).find((u: any) => String(u?.nama || '').trim().toLowerCase() === unitName)
  return found?.id != null ? Number(found.id) : null
})

const isSuperAdmin = computed(() => {
  const roleName = String(role.value || '').toLowerCase()
  const roleId = Number(authUser.value?.role_id)
  return roleName === 'super_admin' || roleId === 1
})

const isUserOnly = computed(() => {
  const roleName = String(role.value || '').toLowerCase()
  const roleId = Number(authUser.value?.role_id)
  return roleName === 'user' || roleId === 3
})

const apiUrl = computed<string | null>(() => {
  if (isSuperAdmin.value) return '/api/sasaran-program'

  const unitId = userUnitKerjaId.value
  if (!unitId) return null
  return `/api/sasaran-program/unit-kerja/${unitId}`
})

const { data, isValidating: loading, mutate } = useSWRV(
  () => apiUrl.value,
  fetcher,
)

const filteredRows = computed<SasaranProgram[]>(() => {
  const rows = ((data.value ?? []) as SasaranProgram[]).slice().sort((a, b) => a.id - b.id)
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return rows

  return rows.filter((item) => {
    return (item.kode ?? '').toLowerCase().includes(q)
      || (item.sasaranText ?? '').toLowerCase().includes(q)
      || (item.indikatorKode ?? '').toLowerCase().includes(q)
      || (item.indikatorNama ?? '').toLowerCase().includes(q)
      || (item.unitKerjaNames ?? []).some(n => n.toLowerCase().includes(q))
  })
})

async function handleDelete(item: SasaranProgram) {
  if (!confirm(`Apakah Anda yakin ingin menghapus sasaran program "${item.sasaranText}"?`)) return

  try {
    const result = await $fetch<any[]>('/api/sasaran-program', {
      method: 'DELETE',
      body: { id: item.id },
    })

    if (result) {
      mutate()
    }
  } catch (error) {
    console.error(error)
    alert('Terjadi kesalahan saat menghapus data.')
  }
}
</script>

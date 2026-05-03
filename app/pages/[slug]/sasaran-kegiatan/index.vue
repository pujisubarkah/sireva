<template>
  <div class="space-y-6 max-w-6xl mx-auto pb-10">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-slate-800">Sasaran Kegiatan</h1>
          <p class="text-sm text-slate-500 mt-1">Daftar sasaran kegiatan berdasarkan data master.</p>
        </div>
        <button
          v-if="!isUserOnly"
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/add`)"
          class="w-full sm:w-auto px-5 py-2.5 bg-[#2663A3] text-white rounded-xl text-sm font-semibold hover:bg-blue-800 shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition-all"
        >
          <IconPlus :size="18" :stroke="'2'" />
          Tambah Sasaran Kegiatan
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
            placeholder="Cari kode atau sasaran kegiatan..."
            class="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div class="inline-block animate-pulse text-slate-500 font-medium">Memuat data sasaran kegiatan...</div>
    </div>

    <div v-else-if="filteredRows.length === 0" class="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm">
      <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <IconSearch :size="40" class="text-slate-300" />
      </div>
      <h3 class="text-lg font-bold text-slate-800">Tidak ada sasaran kegiatan ditemukan</h3>
      <p class="text-slate-500 mt-2 max-w-sm mx-auto text-sm">Coba sesuaikan kata kunci pencarian Anda.</p>
    </div>

    <div v-else class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-16 text-center">No</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-28">Kode</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-55">Sasaran Kegiatan</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-40">Unit Kerja</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-55">Indikator Kegiatan</th>
               <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-24">Satuan</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 min-w-40">Target</th>
              <th class="p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 w-36 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <template v-for="(row, index) in filteredRows" :key="row.id">
              <!-- Jika tidak ada indikator, tampil satu baris -->
              <tr v-if="!row.indikators || row.indikators.length === 0"
                :class="index % 2 === 0 ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/60 hover:bg-blue-100/60'"
                class="transition-colors"
              >
                <td class="p-4 text-center align-top">
                  <span class="text-sm font-bold text-slate-400">{{ ((meta.page - 1) * meta.limit) + index + 1 }}</span>
                </td>
                <td class="p-4 align-top">
                  <span class="text-xs font-black text-blue-600 uppercase tracking-tight">{{ row.kode || '-' }}</span>
                </td>
                <td class="p-4 align-top">
                  <p class="text-sm font-semibold text-slate-700 leading-snug">{{ row.sasaranText }}</p>
                </td>
                <td class="p-4 align-top">
                  <span class="text-sm font-medium text-slate-700">{{ row.unitKerjaNama || '-' }}</span>
                </td>
                <td class="p-4 align-top text-slate-400 text-sm" colspan="3">-</td>
                <td class="p-4 text-center align-top">
                  <div class="flex items-center justify-center gap-1">
                    <button @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/view?id=${row.id}`)" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><IconEye :size="18" /></button>
                    <button @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${row.id}`)" class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><IconPencil :size="18" /></button>
                    <button @click="handleDelete(row)" class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><IconTrash :size="18" /></button>
                  </div>
                </td>
              </tr>

              <!-- Jika ada indikator, buat satu baris per indikator dengan rowspan pada sel sasaran -->
              <template v-else>
                <tr v-for="(ind, iIdx) in row.indikators" :key="`${row.id}-${ind.id}`"
                  :class="index % 2 === 0 ? 'bg-white hover:bg-slate-50/70' : 'bg-blue-50/60 hover:bg-blue-100/60'"
                  class="transition-colors"
                >
                  <!-- Kolom sasaran hanya muncul di baris pertama indikator (rowspan) -->
                  <template v-if="iIdx === 0">
                    <td class="p-4 text-center align-top border-r border-slate-100" :rowspan="row.indikators.length">
                      <span class="text-sm font-bold text-slate-400">{{ ((meta.page - 1) * meta.limit) + index + 1 }}</span>
                    </td>
                    <td class="p-4 align-top border-r border-slate-100" :rowspan="row.indikators.length">
                      <span class="text-xs font-black text-blue-600 uppercase tracking-tight">{{ row.kode || '-' }}</span>
                    </td>
                    <td class="p-4 align-top border-r border-slate-100" :rowspan="row.indikators.length">
                      <p class="text-sm font-semibold text-slate-700 leading-snug">{{ row.sasaranText }}</p>
                    </td>
                    <td class="p-4 align-top border-r border-slate-100" :rowspan="row.indikators.length">
                      <span class="text-sm font-medium text-slate-700">{{ row.unitKerjaNama || '-' }}</span>
                    </td>
                  </template>

                  <!-- Kolom indikator, satuan, target per baris -->
                  <td class="p-4 align-top">
                    <p class="text-sm text-slate-700 leading-snug">{{ ind.nama || '-' }}</p>
                  </td>
                  <td class="p-4 align-top">
                    <span class="text-sm text-slate-600">{{ ind.satuan || '-' }}</span>
                  </td>
                  <td class="p-4 align-top">
                    <div class="flex flex-col gap-1">
                      <span
                        v-for="t in (ind.targets || [])"
                        :key="t.tahun"
                        class="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 w-max"
                      >
                        {{ t.tahun }}: {{ t.target }}
                      </span>
                    </div>
                  </td>

                  <!-- Tombol aksi hanya di baris pertama (rowspan) -->
                  <template v-if="iIdx === 0">
                    <td class="p-4 text-center align-top border-l border-slate-100" :rowspan="row.indikators.length">
                      <div class="flex items-center justify-center gap-1">
                        <button @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/view?id=${row.id}`)" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><IconEye :size="18" /></button>
                        <button @click="router.push(`/${$route.params.slug}/sasaran-kegiatan/edit?id=${row.id}`)" class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><IconPencil :size="18" /></button>
                        <button @click="handleDelete(row)" class="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><IconTrash :size="18" /></button>
                      </div>
                    </td>
                  </template>
                </tr>
              </template>
            </template>
          </tbody>
        </table>
      </div>

      <div v-if="meta && meta.totalPages > 1" class="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span class="text-sm text-slate-500">
          Menampilkan halaman <span class="font-bold text-slate-700">{{ meta.page }}</span> dari <span class="font-bold text-slate-700">{{ meta.totalPages }}</span> (Total {{ meta.total }} data)
        </span>
        <div class="flex gap-2">
          <button 
            @click="page--" 
            :disabled="page === 1"
            class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Sebelumnya
          </button>
          <button 
            @click="page++" 
            :disabled="page >= meta.totalPages"
            class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Selanjutnya
          </button>
        </div>
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

type IndikatorItem = {
  id: number
  nama: string | null
  satuan: string | null
  targets: { tahun: number; target: string | number | null }[]
}

type SasaranKegiatan = {
  id: number
  idSp: number | null
  kode: string | null
  sasaranText: string
  unitKerjaId: number | null
  unitKerjaNama: string | null
  indikators: IndikatorItem[]
}

type UnitScopedSasaranKegiatanRow = {
  id: number
  idSp: number | null
  kode: string | null
  sasaranText: string
  unitKerjaId: number | null
  unitKerjaNama: string | null
  indikatorId: number | null
  indikatorNama: string | null
  indikatorSatuan: string | null
  targets: { tahun: number; target: string | number | null }[]
}

const router = useRouter()
const searchQuery = ref('')
const page = ref(1)

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
  if (isSuperAdmin.value) return `/api/sasaran-kegiatan?page=${page.value}&limit=20`

  const unitId = userUnitKerjaId.value
  if (!unitId) return null
  return `/api/sasaran-kegiatan/unit-kerja/${unitId}`
})

const { data, isValidating: loading, mutate } = useSWRV(() => apiUrl.value, fetcher)

const meta = computed(() => {
  if (!isSuperAdmin.value) {
    return { total: 0, page: 1, limit: 20, totalPages: 1 }
  }

  return (data.value && !Array.isArray(data.value) && data.value.meta) 
    ? data.value.meta 
    : { total: 0, page: 1, limit: 20, totalPages: 1 }
})

const filteredRows = computed<SasaranKegiatan[]>(() => {
  let rows: SasaranKegiatan[] = []

  if (isSuperAdmin.value) {
    const source = data.value && !Array.isArray(data.value) && data.value.data ? data.value.data : (data.value ?? [])
    rows = (source as SasaranKegiatan[]).slice().sort((a, b) => a.id - b.id)
  } else {
    const unitRows = (Array.isArray(data.value) ? data.value : []) as UnitScopedSasaranKegiatanRow[]
    const grouped = new Map<number, SasaranKegiatan>()

    for (const row of unitRows) {
      if (!grouped.has(row.id)) {
        grouped.set(row.id, {
          id: row.id,
          idSp: row.idSp,
          kode: row.kode,
          sasaranText: row.sasaranText,
          unitKerjaId: row.unitKerjaId,
          unitKerjaNama: row.unitKerjaNama,
          indikators: [],
        })
      }

      const current = grouped.get(row.id)!
      if (row.indikatorId != null) {
        current.indikators.push({
          id: row.indikatorId,
          nama: row.indikatorNama,
          satuan: row.indikatorSatuan,
          targets: Array.isArray(row.targets) ? row.targets : [],
        })
      }
    }

    rows = Array.from(grouped.values()).sort((a, b) => a.id - b.id)
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return rows

  return rows.filter((item) => {
    return (item.kode ?? '').toLowerCase().includes(q)
      || (item.sasaranText ?? '').toLowerCase().includes(q)
      || (item.unitKerjaNama ?? '').toLowerCase().includes(q)
      || (item.indikators ?? []).some(i => (i.nama ?? '').toLowerCase().includes(q))
  })
})

async function handleDelete(item: SasaranKegiatan) {
  if (!confirm(`Apakah Anda yakin ingin menghapus sasaran kegiatan "${item.sasaranText}"?`)) return

  try {
    const result = await $fetch<any[]>('/api/sasaran-kegiatan', {
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

<template>
  <div class="max-w-4xl mx-auto pb-20 space-y-8">
    <!-- Header Section -->
    <div class="flex items-start gap-4 px-2">
      <div class="p-3 bg-blue-100 rounded-2xl text-[#2663A3]">
        <IconLayoutGrid :size="28" stroke-width="2.5" />
      </div>
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight">Form Perencanaan Sasaran Strategis</h1>
        <p class="text-slate-500 font-medium text-sm mt-0.5">
          Tentukan sasaran strategis dan tambahkan satu atau lebih indikator kinerja beserta target capaiannya.
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Section 1: Pemetaan Sasaran Strategis -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-[#2663A3] flex items-center gap-3">
          <IconTarget :size="20" class="text-white" stroke-width="2.5" />
          <h2 class="text-white font-bold text-sm uppercase tracking-wider">Pemetaan Sasaran Strategis</h2>
        </div>
        <div class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Unit Kerja (Hanya Super Admin) -->
            <div v-if="isSuperAdmin" class="space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Unit Kerja <span class="text-red-500">*</span>
              </label>
              <div class="relative group">
                <select
                  v-model="form.unitKerjaId"
                  required
                  class="w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option :value="null" disabled>-- Pilih Unit Kerja --</option>
                  <option v-for="u in unitList" :key="u.id" :value="u.id">{{ u.nama }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-[#2663A3]">
                  <IconChevronDown :size="20" stroke-width="3" />
                </div>
              </div>
            </div>

            <!-- Tujuan -->
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Tujuan <span class="text-red-500">*</span>
              </label>
              <div class="relative group">
                <select
                  v-model="form.tujuanId"
                  required
                  class="w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option :value="null" disabled>-- Pilih Tujuan --</option>
                  <option v-for="t in tujuanList" :key="t.id" :value="t.id">{{ t.tujuanText }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-[#2663A3]">
                  <IconChevronDown :size="20" stroke-width="3" />
                </div>
              </div>
            </div>

            <!-- Sasaran Strategis -->
            <div class="col-span-1 md:col-span-2 space-y-2">
              <label class="text-sm font-bold text-slate-700 flex items-center gap-1">
                Sasaran Strategis <span class="text-red-500">*</span>
              </label>
              <div class="relative group">
                <select
                  v-model="form.sasaranText"
                  required
                  class="w-full appearance-none bg-white border-2 border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="" disabled>-- Pilih Sasaran Strategis --</option>
                  <option v-for="opt in sasaranOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-[#2663A3]">
                  <IconChevronDown :size="20" stroke-width="3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Indikator Kinerja & Target -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <IconChartBar :size="20" class="text-[#2663A3]" stroke-width="2.5" />
            <h2 class="text-slate-800 font-black text-sm uppercase tracking-wider">Indikator Kinerja & Target</h2>
          </div>
          <span class="px-3 py-1 rounded-full bg-blue-50 text-[#2663A3] text-[10px] font-black uppercase tracking-widest border border-blue-100">
            Total: {{ form.indikatorList.length }} Indikator
          </span>
        </div>

        <div class="p-8 space-y-6">
          <div
            v-for="(indikator, idx) in form.indikatorList"
            :key="idx"
            class="relative p-6 border-2 border-blue-100 rounded-3xl bg-blue-50/10 space-y-6"
          >
            <!-- Badge Number -->
            <div class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#2663A3] text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-700/20">
              {{ idx + 1 }}
            </div>

            <!-- Remove Button -->
            <button
              v-if="form.indikatorList.length > 1"
              type="button"
              @click="removeIndikator(idx)"
              class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-red-100 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
            >
              <IconTrash :size="16" />
            </button>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Indikator Kinerja <span class="text-red-500">*</span></label>
                <div class="relative group">
                  <select
                    v-model="indikator.nama"
                    required
                    class="w-full appearance-none bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
                  >
                    <option value="" disabled>-- Pilih Indikator Kinerja --</option>
                    <option v-for="opt in indikatorOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-[#2663A3]">
                    <IconChevronDown :size="18" stroke-width="3" />
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Capaian <span class="text-red-500">*</span></label>
                <div class="flex items-center gap-3">
                  <div class="relative flex-1 group">
                    <input
                      v-model="indikator.target"
                      type="text"
                      required
                      placeholder="Nilai target (misal: 100, Baik)"
                      class="w-full bg-white border-2 border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div class="px-4 py-3.5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center gap-2 text-emerald-600">
                    <IconCalendar :size="18" stroke-width="2.5" />
                    <span class="text-sm font-black">{{ currentYear }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Indicator Button -->
          <button
            type="button"
            @click="addIndikator"
            class="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-[#2663A3] hover:border-[#2663A3] hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold text-sm group"
          >
            <IconPlus :size="20" class="group-hover:scale-110 transition-transform" />
            Tambah Indikator Kinerja (Opsional)
          </button>

          <!-- Info Box -->
          <div class="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-4">
            <div class="p-2 bg-white rounded-xl text-[#2663A3] shadow-sm shrink-0">
              <IconInfoCircle :size="18" stroke-width="2.5" />
            </div>
            <p class="text-[13px] text-blue-700 font-medium leading-relaxed">
              Anda dapat menambahkan lebih dari satu indikator kinerja untuk Sasaran Strategis yang dipilih. Setiap target akan otomatis tercatat pada database tahun berjalan ({{ currentYear }}).
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-end gap-4">
        <button
          type="button"
          @click="router.push(`/${$route.params.slug}/sasaran-strategis`)"
          class="px-8 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
        >
          <IconX :size="18" stroke-width="3" />
          Batal
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="px-8 py-3.5 rounded-2xl bg-[#2663A3] text-white font-black text-sm shadow-xl shadow-blue-700/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <IconDeviceFloppy v-if="!submitting" :size="18" stroke-width="3" />
          <span v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Simpan Sasaran Strategis
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
  IconLayoutGrid, IconTarget, IconChartBar, 
  IconPlus, IconTrash, IconChevronDown, 
  IconCalendar, IconInfoCircle, IconX, IconDeviceFloppy 
} from '@tabler/icons-vue'
import useSWRV from 'swrv'
import { useAuthUser } from '~/composables/useAuthUser'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const currentYear = ref(2026)

const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: unitList } = useSWRV('/api/unit-kerja', fetcher)
const { data: tujuanList } = useSWRV('/api/tujuan', fetcher)
const { authUser, role } = useAuthUser()

// Role & Unit Logic
const normalizedRole = computed(() => String(role.value || '').toLowerCase().replace(/\s+/g, '_'))
const isSuperAdmin = computed(() => normalizedRole.value === 'super_admin')
const loggedUnitKerjaName = computed(() => String(authUser.value?.unit_kerja || '').trim())

const userUnitKerjaId = computed(() => {
  if (!unitList.value) return null
  const found = unitList.value.find((u: any) => u.nama === loggedUnitKerjaName.value)
  return found?.id || null
})

// Dummy options based on design
const sasaranOptions = [
  'Meningkatnya tata kelola organisasi yang efektif dan efisien',
  'Terwujudnya pelayanan publik yang prima',
  'Meningkatnya kualitas sumber daya manusia'
]

const indikatorOptions = [
  'Indeks Reformasi Birokrasi',
  'Nilai Akuntabilitas Kinerja',
  'Indeks Kepuasan Masyarakat',
  'Persentase pegawai yang memenuhi standar kompetensi'
]

const form = ref({
  sasaranText: '',
  unitKerjaId: null as number | null,
  tujuanId: null as number | null,
  indikatorList: [
    { nama: '', target: '' }
  ]
})

// Initialize Unit for Non-SuperAdmin
watchEffect(() => {
  if (!isSuperAdmin.value && userUnitKerjaId.value && !form.value.unitKerjaId) {
    form.value.unitKerjaId = userUnitKerjaId.value
  }
})

function addIndikator() {
  form.value.indikatorList.push({ nama: '', target: '' })
}

function removeIndikator(index: number) {
  form.value.indikatorList.splice(index, 1)
}

const handleSubmit = async () => {
  if (!form.value.sasaranText) return

  submitting.value = true

  try {
    // 1. Simpan sasaran strategis
    const ss = await $fetch<{ id: number }[]>('/api/sasaran-strategis', {
      method: 'POST',
      body: {
        sasaranText: form.value.sasaranText,
        unitKerjaId: form.value.unitKerjaId,
        tujuanId: form.value.tujuanId,
        kode: 'SS-' + Math.floor(Math.random() * 100) // Default random code
      },
    })

    const ssId = ss[0]?.id
    if (!ssId) throw new Error('Gagal mendapatkan ID sasaran strategis')

    // 2. Simpan tiap indikator + targets
    for (const indikator of form.value.indikatorList) {
      if (!indikator.nama) continue

      const ind = await $fetch<{ id: number }[]>('/api/indikator-strategis', {
        method: 'POST',
        body: {
          sasaranStrategisId: ssId,
          nama: indikator.nama,
          satuan: 'Poin' // Default satuan
        },
      })

      const indId = ind[0]?.id
      if (!indId) continue

      // Simpan target untuk tahun berjalan
      await $fetch('/api/target-indikator-strategis', {
        method: 'POST',
        body: {
          indikatorId: indId,
          tahun: currentYear.value,
          target: indikator.target,
        },
      })
    }

    router.push(`/${route.params.slug}/sasaran-strategis`)
  } catch (error) {
    console.error('Error saving data:', error)
    alert('Gagal menyimpan data ke server. Silakan coba lagi.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Focus transitions and effects */
select:focus + div {
  transform: rotate(180deg);
}
</style>


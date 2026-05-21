<template>
  <div class="space-y-0 pb-20">

    <!-- ===================== TOP BAR ===================== -->
    <div class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-1.5 flex-wrap min-w-0">
          <button
            @click="drillTo('ss', null)"
            class="flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors shrink-0"
          >
            <IconHierarchy2 :size="16" />
            <span>Cascading Kinerja</span>
          </button>

          <template v-if="selectedSS">
            <IconChevronRight :size="14" class="text-slate-300 shrink-0" />
            <button
              @click="drillTo('sp', null)"
              :class="[
                'text-sm font-bold transition-colors truncate max-w-xs',
                selectedSP ? 'text-blue-700 hover:text-blue-900' : 'text-slate-700 cursor-default'
              ]"
            >
              {{ selectedSS.sasaranText }}
            </button>
          </template>

          <template v-if="selectedSP">
            <IconChevronRight :size="14" class="text-slate-300 shrink-0" />
            <span class="text-sm font-bold text-slate-700 truncate max-w-xs">
              {{ selectedSP.sasaranText }}
            </span>
          </template>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-2 shrink-0">
          <FilterDropdown v-model="selectedYear" :options="['2025', '2026', '2027', '2028', '2029']" :icon="IconCalendar" />
          <button
            @click="printCascading"
            :disabled="printLoading"
            class="px-4 py-2 bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-700/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
          >
            <span v-if="printLoading" class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <IconDownload v-else :size="14" />
            {{ printLoading ? 'Menyiapkan...' : 'Cetak / PDF' }}
          </button>
        </div>
      </div>

      <!-- Level Indicator Pills -->
      <div class="px-6 pb-3 flex items-center gap-2">
        <span :class="['px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all', !selectedSS ? 'bg-blue-700 text-white shadow-md shadow-blue-700/30' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer']" @click="drillTo('ss', null)">
          Sasaran Strategis
        </span>
        <IconChevronRight :size="12" class="text-slate-300" />
        <span :class="['px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all', (selectedSS && !selectedSP) ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-100 text-slate-400']">
          Sasaran Program
        </span>
        <IconChevronRight :size="12" class="text-slate-300" />
        <span :class="['px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all', selectedSP ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-100 text-slate-400']">
          Sasaran Kegiatan
        </span>
      </div>
    </div>

    <!-- ===================== CONTENT AREA ===================== -->
    <div class="px-4 sm:px-6 pt-6">

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin"></div>
        <p class="text-slate-400 font-bold text-xs uppercase tracking-widest">Menyusun Hirarki Kinerja...</p>
      </div>

      <template v-else>

        <!-- ===== LEVEL 1: SASARAN STRATEGIS ===== -->
        <Transition name="slide-up" mode="out-in">
          <div v-if="!selectedSS" key="level-ss">
            <div class="mb-6">
              <h2 class="text-lg font-black text-slate-800">Sasaran Strategis</h2>
              <p class="text-sm text-slate-500 mt-1">Klik pada salah satu sasaran strategis untuk melihat cascading program di bawahnya.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div
                v-for="ss in uniqueStrategis"
                :key="ss.id"
                @click="drillTo('sp', ss)"
                class="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <!-- Top accent bar -->
                <div class="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500"></div>

                <div class="p-6">
                  <!-- Badge -->
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      Sasaran Strategis
                    </span>
                    <div class="w-9 h-9 rounded-xl bg-blue-700 group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg shadow-blue-700/30">
                      <IconStar :size="18" class="text-yellow-300" />
                    </div>
                  </div>

                  <!-- Title -->
                  <p class="font-bold text-slate-800 leading-snug text-base mb-5 min-h-[3rem] group-hover:text-blue-700 transition-colors line-clamp-3">
                    {{ ss.sasaranText }}
                  </p>

                  <!-- Stats -->
                  <div class="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div class="text-center">
                      <p class="text-2xl font-black text-blue-700">{{ getChildrenProgram(ss.id).length }}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Program</p>
                    </div>
                    <div class="h-8 w-px bg-slate-200"></div>
                    <div class="text-center">
                      <p class="text-2xl font-black text-indigo-600">{{ getTotalKegiatan(ss.id) }}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Kegiatan</p>
                    </div>
                    <div class="ml-auto flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      Lihat Detail <IconChevronRight :size="14" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-if="uniqueStrategis.length === 0" class="col-span-3 py-20 text-center text-slate-400">
                <IconHierarchy2 :size="40" class="mx-auto mb-3 text-slate-300" />
                <p class="font-bold">Belum ada data sasaran strategis</p>
              </div>
            </div>
          </div>
        </Transition>

        <!-- ===== LEVEL 2: SASARAN PROGRAM ===== -->
        <Transition name="slide-up" mode="out-in">
          <div v-if="selectedSS && !selectedSP" key="level-sp">
            <!-- Parent SS Summary Card -->
            <div class="mb-6 bg-blue-700 text-white rounded-2xl p-5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <IconStar :size="20" class="text-yellow-300" />
              </div>
              <div class="min-w-0">
                <p class="text-blue-200 text-[11px] font-black uppercase tracking-widest mb-1">Sasaran Strategis</p>
                <h2 class="font-black text-base leading-snug">{{ selectedSS.sasaranText }}</h2>
              </div>
            </div>

            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-black text-slate-800">Sasaran Program ({{ programDrilled.length }})</h3>
                <p class="text-xs text-slate-500 mt-0.5">Klik program untuk melihat Sasaran Kegiatan di bawahnya.</p>
              </div>
              <button @click="drillTo('ss', null)" class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                <IconChevronLeft :size="14" /> Kembali
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <div
                v-for="sp in programDrilled"
                :key="sp.id"
                @click="drillTo('sk', sp)"
                class="group bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div class="h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                      Sasaran Program
                    </span>
                    <div class="w-8 h-8 rounded-xl bg-indigo-600 group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg shadow-indigo-600/30">
                      <IconBuilding :size="15" class="text-white" />
                    </div>
                  </div>

                  <p class="font-bold text-slate-800 leading-snug text-sm mb-5 min-h-[3rem] group-hover:text-indigo-700 transition-colors line-clamp-3">
                    {{ sp.sasaranText }}
                  </p>

                  <div class="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <div class="text-center">
                      <p class="text-xl font-black text-indigo-600">{{ getChildrenKegiatan(sp.id).length }}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Kegiatan</p>
                    </div>
                    <div class="h-8 w-px bg-slate-200"></div>
                    <div class="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 truncate flex-1">
                      <IconUsers :size="11" class="shrink-0" />
                      {{ sp.unitKerja || 'Semua Unit' }}
                    </div>
                    <div class="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform shrink-0">
                      <IconChevronRight :size="14" />
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="programDrilled.length === 0" class="col-span-3 py-16 text-center text-slate-400">
                <IconBuildingBank :size="36" class="mx-auto mb-3 text-slate-300" />
                <p class="font-bold">Belum ada Sasaran Program untuk Sasaran Strategis ini</p>
              </div>
            </div>
          </div>
        </Transition>

        <!-- ===== LEVEL 3: SASARAN KEGIATAN ===== -->
        <Transition name="slide-up" mode="out-in">
          <div v-if="selectedSP" key="level-sk">
            <!-- SP Summary Card -->
            <div class="mb-6 bg-indigo-600 text-white rounded-2xl p-5 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <IconBuilding :size="20" class="text-white" />
              </div>
              <div class="min-w-0">
                <p class="text-indigo-200 text-[11px] font-black uppercase tracking-widest mb-1">Sasaran Program</p>
                <h2 class="font-black text-base leading-snug">{{ selectedSP.sasaranText }}</h2>
                <div class="flex items-center gap-1.5 mt-2 text-indigo-200 text-xs font-bold">
                  <IconUsers :size="12" />
                  {{ selectedSP.unitKerja || 'Semua Unit' }}
                </div>
              </div>
            </div>

            <div class="mb-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-black text-slate-800">Sasaran Kegiatan & Indikator ({{ kegiatanDrilled.length }})</h3>
                <p class="text-xs text-slate-500 mt-0.5">Klik kartu untuk melihat detail lengkap Sasaran Kegiatan.</p>
              </div>
              <button @click="drillTo('sp', selectedSS)" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                <IconChevronLeft :size="14" /> Kembali ke Program
              </button>
            </div>

            <!-- SK Cards Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div
                v-for="sk in kegiatanDrilled"
                :key="sk.id"
                @click="router.push(`/${route.params.slug}/sasaran-kegiatan/view?id=${sk.id}`)"
                class="group bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
              >
                <div class="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                <!-- SK Header -->
                <div class="p-5 border-b border-slate-100">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform shadow-md shadow-emerald-600/30">
                      <IconTarget :size="15" class="text-white" />
                    </div>
                    <div class="min-w-0">
                      <span class="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Sasaran Kegiatan</span>
                      <p class="font-bold text-slate-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors mt-0.5">
                        {{ sk.sasaranText }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Indicators Table -->
                <div class="flex-1 divide-y divide-slate-100">
                  <div
                    v-for="ind in sk.indicators"
                    :key="ind.id"
                    class="flex items-center px-5 py-3 gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                    <p class="text-xs font-medium text-slate-600 flex-1 leading-snug">{{ ind.nama }}</p>
                    <div class="shrink-0 text-right">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Target {{ selectedYear }}</p>
                      <p class="text-sm font-black text-emerald-600">{{ ind.target ?? '-' }}</p>
                    </div>
                  </div>

                  <div v-if="sk.indicators.length === 0" class="px-5 py-4 text-xs text-slate-400 italic text-center">
                    Belum ada Indikator Kinerja
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div class="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <IconBuilding :size="12" class="text-slate-400" />
                    <span class="truncate max-w-[200px]">{{ sk.unitKerja }}</span>
                  </div>
                  <span class="text-[10px] font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Detail <IconChevronRight :size="12" />
                  </span>
                </div>
              </div>

              <div v-if="kegiatanDrilled.length === 0" class="col-span-2 py-16 text-center text-slate-400">
                <IconTargetArrow :size="36" class="mx-auto mb-3 text-slate-300" />
                <p class="font-bold">Belum ada Sasaran Kegiatan untuk Program ini</p>
              </div>
            </div>
          </div>
        </Transition>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Cascading Kinerja — Interactive Drill-Down Edition
 * Hirarki One-to-Many navigasi per level:
 * Sasaran Strategis → Sasaran Program → Sasaran Kegiatan + Indikator
 */

definePageMeta({ layout: 'dashboard' })

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  IconHierarchy2,
  IconCalendar,
  IconDownload,
  IconStar,
  IconBuilding,
  IconUsers,
  IconChevronRight,
  IconChevronLeft,
  IconTarget
} from '@tabler/icons-vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import useSWRV from 'swrv'

// ──────────────────── State ────────────────────
const selectedYear = ref('2025')
const selectedSS = ref<any>(null)
const selectedSP = ref<any>(null)
const router = useRouter()
const route = useRoute()

// ──────────────────── Data Fetching ────────────────────
const fetcher = (url: string) => fetch(url).then(r => r.json())
const { data: strategisList } = useSWRV('/api/sasaran-strategis', fetcher)
const { data: programList }   = useSWRV('/api/sasaran-program', fetcher)
const { data: kegiatanList }  = useSWRV('/api/sasaran-kegiatan', fetcher)

const loading = computed(() => !strategisList.value || !programList.value || !kegiatanList.value)

// ──────────────────── Drill-Down Navigation ────────────────────
function drillTo(level: 'ss' | 'sp' | 'sk', item: any) {
  if (level === 'ss') {
    selectedSS.value = null
    selectedSP.value = null
  } else if (level === 'sp') {
    selectedSS.value = item
    selectedSP.value = null
  } else if (level === 'sk') {
    selectedSP.value = item
  }
}

// ──────────────────── Computed Lists ────────────────────
const uniqueStrategis = computed(() => {
  if (!strategisList.value) return []
  const raw = Array.isArray(strategisList.value)
    ? strategisList.value
    : (strategisList.value.data || [])
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  return raw.reduce((acc: any[], item: any) => {
    const id = item.ssId || item.id
    if (id && !seen.has(id)) {
      seen.add(id)
      acc.push({ id, sasaranText: item.sasaranText || item.namaSs, unitKerja: item.unit_kerja || '' })
    }
    return acc
  }, [])
})

const uniqueProgram = computed(() => {
  if (!programList.value) return []
  const raw = Array.isArray(programList.value)
    ? programList.value
    : (programList.value.data || [])
  if (!Array.isArray(raw)) return []
  const seen = new Set()
  return raw.reduce((acc: any[], item: any) => {
    if (item.id && !seen.has(item.id)) {
      seen.add(item.id)
      acc.push({
        id: item.id,
        ssId: item.ssId,
        sasaranText: item.sasaran_program_text || item.namaSp,
        unitKerja: item.unit_kerja || item.unitKerjaNama || ''
      })
    }
    return acc
  }, [])
})

const uniqueKegiatan = computed(() => {
  if (!kegiatanList.value) return []
  const raw = Array.isArray(kegiatanList.value)
    ? kegiatanList.value
    : (kegiatanList.value.data || [])
  if (!Array.isArray(raw)) return []
  const map = new Map()
  raw.forEach((item: any) => {
    const id = item.id
    if (!id) return
    if (!map.has(id)) {
      map.set(id, {
        id,
        spId: item.spId,
        sasaranText: item.sasaran_kegiatan_text || item.sasaranText || item.namaSk,
        unitKerja: item.unit_kerja || item.unitKerjaNama || '-',
        indicators: []
      })
    }
    if (item.indikatorId) {
      const yearIdx = ['2025','2026','2027','2028','2029'].indexOf(selectedYear.value)
      const targetKey = `target_${yearIdx + 1}`
      const entry = map.get(id)
      if (!entry.indicators.find((i: any) => i.id === item.indikatorId)) {
        entry.indicators.push({
          id: item.indikatorId,
          nama: item.indikator_kinerja || item.indikatorNama,
          target: item[targetKey] ?? null
        })
      }
    }
  })
  return Array.from(map.values())
})

// ──────────────────── Filtered for drill-down ────────────────────
const programDrilled  = computed(() => uniqueProgram.value.filter(p => p.ssId === selectedSS.value?.id))
const kegiatanDrilled = computed(() => uniqueKegiatan.value.filter(k => k.spId === selectedSP.value?.id))

// ──────────────────── Helpers ────────────────────
const getChildrenProgram  = (ssId: number)  => uniqueProgram.value.filter(p => p.ssId === ssId)
const getChildrenKegiatan = (spId: number)  => uniqueKegiatan.value.filter(k => k.spId === spId)
const getTotalKegiatan    = (ssId: number) => {
  const pIds = getChildrenProgram(ssId).map((p: any) => p.id)
  return uniqueKegiatan.value.filter(k => pIds.includes(k.spId)).length
}
// ──────────────────── Print / Export PDF ────────────────────
const printLoading = ref(false)

const printCascading = async () => {
  if (printLoading.value) return
  printLoading.value = true
  try {
    const year = selectedYear.value
    const yearIdx = ['2025','2026','2027','2028','2029'].indexOf(year)

    // ── Build SS sections HTML ──
    const ssRows = uniqueStrategis.value.map((ss: any) => {
      const programs = getChildrenProgram(ss.id)

      const spBlocks = programs.map((sp: any) => {
        const kegiatans = getChildrenKegiatan(sp.id)

        const skBlocks = kegiatans.map((sk: any) => {
          const indHTML = sk.indicators.length
            ? sk.indicators.map((ind: any) => `
              <div class="ind-item">
                <div class="ind-name">${ind.nama ?? '-'}</div>
                <div class="ind-target">Target ${year}: <b>${ind.target ?? '-'}</b></div>
              </div>`).join('')
            : '<div class="ind-empty">Belum ada indikator</div>'

          return `
            <div class="sk-card">
              <div class="lv-badge sk">SK</div>
              <div class="card-title">${sk.sasaranText ?? '-'}</div>
              <div class="ind-list">${indHTML}</div>
              <div class="card-meta">&#128313; Pengampu: ${sk.unitKerja ?? '-'}</div>
            </div>`
        }).join('')

        return `
          <div class="sp-node">
            <div class="sp-card">
              <div class="lv-badge sp">SP</div>
              <div class="card-title">${sp.sasaranText ?? '-'}</div>
              <div class="card-meta">&#128313; Pengampu: ${sp.unitKerja ?? '-'}</div>
            </div>
            <div class="sk-row">${skBlocks || '<div class="empty-note">Belum ada Sasaran Kegiatan</div>'}</div>
          </div>`
      }).join('')

      return `
        <div class="ss-section">
          <div class="ss-card">
            <div class="lv-badge ss">SS</div>
            <div class="card-title">${ss.sasaranText ?? '-'}</div>
            <div class="card-meta">&#128313; Pengampu: ${ss.unitKerja || 'Kepala Lembaga'}</div>
          </div>
          <div class="sp-row">${spBlocks || '<div class="empty-note">Belum ada Sasaran Program</div>'}</div>
        </div>`
    }).join('')

    const printDate = new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })

    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Peta Cascading Kinerja — ${year}</title>
  <style>
    @page { size: A3 landscape; margin: 12mm 10mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; }
    body { background: #fff; color: #111; font-size: 7.5pt; }

    .print-header { text-align: center; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 3px solid #1d4ed8; }
    .print-header h1 { font-size: 14pt; font-weight: 900; color: #1e3a8a; text-transform: uppercase; letter-spacing: 2px; }
    .print-header p  { font-size: 8pt; color: #64748b; margin-top: 3px; }

    /* ── Level Badges ── */
    .lv-badge { display: inline-block; font-size: 6pt; font-weight: 900; padding: 1px 5px; border-radius: 3px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .lv-badge.ss { background: #fef9c3; color: #854d0e; border: 1px solid #fde68a; }
    .lv-badge.sp { background: #ede9fe; color: #4c1d95; border: 1px solid #c4b5fd; }
    .lv-badge.sk { background: #dcfce7; color: #14532d; border: 1px solid #86efac; }

    .card-title { font-weight: 700; line-height: 1.4; margin-bottom: 5px; }
    .card-meta  { font-size: 6.5pt; color: #555; margin-top: 4px; }

    /* ── SS ── */
    .ss-section { margin-bottom: 24px; page-break-inside: avoid; }
    .ss-card {
      background: #1e3a8a; color: #fff;
      border-left: 5px solid #fbbf24;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 10px;
    }
    .ss-card .card-meta { color: #bfdbfe; }

    /* ── SP Row ── */
    .sp-row { display: flex; flex-wrap: wrap; gap: 10px; padding-left: 18px; border-left: 3px solid #818cf8; }
    .sp-node { flex: 1 1 220px; }

    .sp-card {
      background: #eef2ff;
      border: 1.5px solid #6366f1;
      border-radius: 5px;
      padding: 8px 10px;
      margin-bottom: 8px;
    }

    /* ── SK Row ── */
    .sk-row { display: flex; flex-wrap: wrap; gap: 6px; padding-left: 14px; border-left: 2px solid #34d399; }
    .sk-card {
      flex: 1 1 160px;
      max-width: 210px;
      background: #f0fdf4;
      border: 1px solid #6ee7b7;
      border-radius: 4px;
      padding: 6px 8px;
    }

    /* ── Indicators ── */
    .ind-list { margin: 5px 0 3px; }
    .ind-item {
      background: #fff;
      border: 1px solid #a7f3d0;
      border-radius: 3px;
      padding: 3px 5px;
      margin-bottom: 2px;
    }
    .ind-name   { font-weight: 600; font-size: 6.5pt; color: #374151; line-height: 1.3; }
    .ind-target { font-size: 6pt; color: #059669; font-weight: 700; margin-top: 1px; }
    .ind-empty  { font-size: 6pt; color: #9ca3af; font-style: italic; padding: 3px 0; }
    .empty-note { font-size: 6.5pt; color: #9ca3af; font-style: italic; padding: 6px; }

    .print-btn-wrap { text-align: center; margin-top: 20px; }
    .print-btn { padding: 10px 28px; background: #1e3a8a; color: #fff; border: none; border-radius: 8px; font-weight: 700; font-size: 11pt; cursor: pointer; }
    @media print { .print-btn-wrap { display: none; } }
  </style>
</head>
<body>
  <div class="print-header">
    <h1>Peta Cascading Kinerja</h1>
    <p>Tahun ${year} &nbsp;&bull;&nbsp; Dicetak: ${printDate}</p>
  </div>
  <div class="cascade-tree">
    ${ssRows || '<p style="text-align:center;color:#9ca3af;padding:40px;">Tidak ada data untuk ditampilkan.</p>'}
  </div>
  <div class="print-btn-wrap">
    <button class="print-btn" onclick="window.print()">🖨️ Cetak / Simpan sebagai PDF</button>
  </div>
</body>
</html>`

    const win = window.open('', '_blank', 'width=1400,height=900')
    if (!win) {
      alert('Popup diblokir browser. Mohon izinkan popup untuk halaman ini.')
      return
    }
    win.document.write(html)
    win.document.close()
  } finally {
    printLoading.value = false
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>

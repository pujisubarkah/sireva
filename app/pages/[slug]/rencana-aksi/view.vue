<template>
  <div class="max-w-3xl mx-auto pb-10 space-y-4">
    <button
      @click="router.push(`/${$route.params.slug}/rencana-aksi`)"
      class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[#2663A3]"
    >
      <IconArrowLeft :size="16" />
      Kembali
    </button>

    <div class="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <h1 class="text-xl font-bold text-slate-800">Edit Rencana Aksi</h1>
        <p class="text-sm text-slate-500 mt-1">Form untuk mengubah rencana aksi operasional, indikator kegiatan, dan target bulanan.</p>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-700/30 border-t-blue-700 mb-4"></div>
        <p class="text-slate-500 font-semibold">Memuat data...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Indikator Kegiatan (Sasaran Kegiatan) -->
        <div class="space-y-4">
          <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <label for="indikatorId" class="block text-sm font-semibold text-slate-700 sm:w-56 sm:shrink-0">Indikator Kegiatan <span class="text-red-500">*</span></label>
            <div class="sm:flex-1">
              <select 
                id="indikatorId" 
                v-model="form.indikatorId" 
                required 
                class="field-input"
              >
                <option value="" disabled>-- Pilih Sasaran Kegiatan / Indikator --</option>
                <option 
                  v-for="sk in sasaranKegiatanList" 
                  :key="sk.id" 
                  :value="sk.id"
                >
                  {{ sk.kode ? `${sk.kode} - ` : '' }}{{ sk.sasaranText }} ({{ sk.unitKerjaNama }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Nama Rencana Aksi -->
        <div class="space-y-2 sm:space-y-0 sm:flex sm:items-start sm:gap-4">
          <label for="namaRencanaAksi" class="block text-sm font-semibold text-slate-700 sm:w-56 sm:shrink-0 sm:pt-3">Rencana Aksi <span class="text-red-500">*</span></label>
          <div class="sm:flex-1">
            <textarea
              id="namaRencanaAksi"
              v-model="form.namaRencanaAksi"
              required
              class="field-input min-h-28"
              placeholder="Masukkan deskripsi rencana aksi operasional..."
            ></textarea>
          </div>
        </div>

        <!-- Target Tahunan -->
        <div class="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <label for="target" class="block text-sm font-semibold text-slate-700 sm:w-56 sm:shrink-0">Target Tahunan</label>
          <div class="sm:flex-1">
            <input
              id="target"
              v-model="form.target"
              type="number"
              step="any"
              class="field-input"
              placeholder="0"
            />
            <p class="text-xs text-slate-500 mt-1">Total target untuk tahun berjalan</p>
          </div>
        </div>

        <!-- Target Bulanan (b01 - b12) -->
        <div class="space-y-3">
          <label class="block text-sm font-bold text-slate-700 uppercase tracking-wide">Target Bulanan (Triwulan)</label>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <div v-for="m in months" :key="m" class="space-y-1">
              <span class="block text-xs text-slate-500 text-center font-medium">B{{ m }}</span>
              <input
                :id="`b${m}`"
                v-model="form[`b${m}`]"
                type="number"
                step="any"
                class="field-input text-sm text-center px-2 py-2"
                placeholder="0"
              />
            </div>
          </div>
          <p class="text-xs text-slate-500">Target distribusi per bulan. Total 12 bulan.</p>
        </div>

        <div class="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            @click="router.push(`/${$route.params.slug}/rencana-aksi`)"
            class="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2.5 rounded-lg bg-[#2663A3] text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Menyimpan...' : 'Update Rencana' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useSWRV from 'swrv'
import { IconArrowLeft } from '@tabler/icons-vue'

const router = useRouter()
const route = useRoute()
const submitting = ref(false)
const loading = ref(true)
const id = Number(route.query.id)

const monthKeys = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'] as const
type MonthKey = typeof monthKeys[number]

const months = monthKeys

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Data sources
const { data: sasaranKegiatanRaw } = useSWRV('/api/sasaran-kegiatan', fetcher)
const sasaranKegiatanList = computed(() => sasaranKegiatanRaw.value?.data || [])

const form = ref({
  indikatorId: null as number | null,
  namaRencanaAksi: '',
  target: '',
  b01: '', b02: '', b03: '', b04: '',
  b05: '', b06: '', b07: '', b08: '',
  b09: '', b10: '', b11: '', b12: ''
})

onMounted(async () => {
  if (!id || isNaN(id)) {
    router.push(`/${route.params.slug}/rencana-aksi`)
    return
  }

  try {
    loading.value = true
    const existingData = await $fetch(`/api/rencana-aksi?id=${id}`)
    const data = Array.isArray(existingData) ? existingData[0] : existingData

    if (data) {
      const d = data as unknown as Record<string, unknown>

      form.value = {
        indikatorId: (d.indikatorId as number | undefined) ?? null,
        namaRencanaAksi:
          (d.namaRencanaAksi as string | null | undefined) ??
          (d.rencanaAksi as string | null | undefined) ??
          '',
        target: (d.target as string | null | undefined) ?? '',
        b01: (d.b01 as string | null | undefined) ?? '',
        b02: (d.b02 as string | null | undefined) ?? '',
        b03: (d.b03 as string | null | undefined) ?? '',
        b04: (d.b04 as string | null | undefined) ?? '',
        b05: (d.b05 as string | null | undefined) ?? '',
        b06: (d.b06 as string | null | undefined) ?? '',
        b07: (d.b07 as string | null | undefined) ?? '',
        b08: (d.b08 as string | null | undefined) ?? '',
        b09: (d.b09 as string | null | undefined) ?? '',
        b10: (d.b10 as string | null | undefined) ?? '',
        b11: (d.b11 as string | null | undefined) ?? '',
        b12: (d.b12 as string | null | undefined) ?? ''
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
    alert('Gagal memuat data rencana aksi.')
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  if (!form.value.namaRencanaAksi.trim() || !form.value.indikatorId) {
    alert('Indikator Kegiatan dan Nama Rencana Aksi wajib diisi.')
    return
  }

  submitting.value = true
  try {
    const updateData = {
      id,
      indikatorId: form.value.indikatorId,
      namaAksi: form.value.namaRencanaAksi.trim(),
      target: form.value.target || '0',
      b01: form.value.b01 || '0', b02: form.value.b02 || '0', b03: form.value.b03 || '0', b04: form.value.b04 || '0',
      b05: form.value.b05 || '0', b06: form.value.b06 || '0', b07: form.value.b07 || '0', b08: form.value.b08 || '0',
      b09: form.value.b09 || '0', b10: form.value.b10 || '0', b11: form.value.b11 || '0', b12: form.value.b12 || '0'
    }

    await $fetch('/api/rencana-aksi', {
      method: 'PUT',
      body: updateData
    })

    router.push(`/${route.params.slug}/rencana-aksi`)
  } catch (error) {
    console.error('Error updating:', error)
    alert('Gagal menyimpan perubahan. Silakan coba lagi.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="postcss">
.field-input {
  @apply w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 bg-white transition-all duration-200 focus:outline-none focus:border-[#2663A3] focus:ring-4 focus:ring-[#2663A3]/10 hover:border-slate-300;
}

.field-input::placeholder {
  @apply text-slate-400;
}

.field-input:disabled {
  @apply bg-slate-50 cursor-not-allowed;
}
</style>

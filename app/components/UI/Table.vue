<template>
  <div :class="className">
    <slot />
    <div class="rounded-xl bg-white p-4 overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm" style="table-layout: auto;">
        <thead class="bg-blue-100 sticky top-0 z-10">
          <template v-if="hasGroupedHeaders">
            <tr>
              <th
                v-for="cell in topHeaderCells"
                :key="cell.key"
                :rowspan="cell.type === 'column' ? 2 : undefined"
                :colspan="cell.type === 'group' ? cell.colspan : undefined"
                :style="cell.type === 'column' && cell.col.width ? { width: cell.col.width + (typeof cell.col.width === 'number' ? 'px' : '') } : {}"
                :class="[
                  'px-3 py-2 font-semibold align-middle',
                  cell.type === 'group' ? 'text-center text-blue-700' : getHeaderClass(cell.col)
                ]"
              >
                {{ cell.type === 'group' ? cell.label : (cell.col.label || cell.col.header) }}
              </th>
            </tr>
            <tr>
              <th
                v-for="col in groupedColumns"
                :key="col.key || col.accessor"
                :style="col.width ? { width: col.width + (typeof col.width === 'number' ? 'px' : '') } : {}"
                :class="['px-3 py-2 font-semibold align-middle', getHeaderClass(col)]"
              >
                {{ col.label || col.header }}
              </th>
            </tr>
          </template>
          <tr v-else>
            <th
              v-for="col in normalizedColumns"
              :key="col.key || col.accessor"
              :style="col.width ? { width: col.width + (typeof col.width === 'number' ? 'px' : '') } : {}"
              :class="['px-3 py-2 font-semibold align-middle', getHeaderClass(col)]"
            >
              {{ col.label || col.header }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <template v-if="pagedData.length">
            <tr v-for="(row, rowIndex) in pagedData" :key="row[rowKey] ?? rowIndex" class="align-middle bg-white">
              <td
                v-for="col in normalizedColumns"
                :key="col.key || col.accessor"
                :class="['px-3 py-2 text-sm align-middle text-black!', getCellClass(col)]"
                style="color: #000 !important;"
              >
                <slot
                  :name="`cell-${String(col.key || col.accessor)}`"
                  :row="row"
                  :col="col"
                  :value="row[col.key || col.accessor]"
                  :index="rowIndex"
                >
                  <span v-if="col.render">{{ col.render(row) }}</span>
                  <span v-else>{{ row[col.key || col.accessor] }}</span>
                </slot>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td :colspan="normalizedColumns.length" class="text-center py-8">
                <slot name="empty">
                  <span class="text-gray-400">Tidak ada data</span>
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <div v-if="showPagination && totalPages > 1" class="flex justify-end mt-4 gap-2">
        <button @click="prevPage" :disabled="page === 1" class="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50">Prev</button>
        <span class="text-sm text-slate-600">Page {{ page }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page === totalPages" class="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Column {
  key: string
  label: string
  render?: (row: any) => string
  width?: string | number
  className?: string
  group?: string
}

interface HeaderGroupCell {
  key: string
  type: 'group' | 'column'
  label?: string
  colspan?: number
  col?: any
}

const props = defineProps({
  columns: {
    type: Array as () => Column[],
    required: true,
  },
  data: {
    type: Array as () => any[],
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  className: {
    type: String,
    default: '',
  },
})

const searchTerm = ref('')
const page = ref(1)

const normalizedColumns = computed(() => {
  return props.columns.map((col: any) => {
    if (col.accessor && col.header) return col
    return {
      accessor: col.key,
      header: col.label,
      ...col,
    }
  })
})

const hasGroupedHeaders = computed(() => normalizedColumns.value.some((col: any) => Boolean(col.group)))

const groupedColumns = computed(() => normalizedColumns.value.filter((col: any) => Boolean(col.group)))

const topHeaderCells = computed<HeaderGroupCell[]>(() => {
  const cells: HeaderGroupCell[] = []
  for (let i = 0; i < normalizedColumns.value.length; i++) {
    const col = normalizedColumns.value[i]
    if (!col.group) {
      cells.push({
        key: `col-${String(col.key || col.accessor)}-${i}`,
        type: 'column',
        col,
      })
      continue
    }

    let span = 1
    while (i + span < normalizedColumns.value.length && normalizedColumns.value[i + span].group === col.group) {
      span++
    }

    cells.push({
      key: `group-${col.group}-${i}`,
      type: 'group',
      label: col.group,
      colspan: span,
    })

    i += span - 1
  }

  return cells
})

const filteredData = computed(() => {
  if (!props.showSearch || !searchTerm.value) return props.data
  return props.data.filter((row) =>
    Object.values(row).some((v) => String(v).toLowerCase().includes(searchTerm.value.toLowerCase()))
  )
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / props.pageSize) || 1)

const pagedData = computed(() => {
  const start = (page.value - 1) * props.pageSize
  const end = start + props.pageSize
  return filteredData.value.slice(start, end)
})

function prevPage() {
  if (page.value > 1) page.value--
}
function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function getHeaderClass(col: any) {
  const alignment = col.center ? 'text-center' : 'text-left'
  return [alignment, col.color || 'text-blue-700']
}

function getCellClass(col: any) {
  if (col.center) return 'text-center'
  if (col.right) return 'text-right'
  return 'text-left'
}

watch([() => props.data, searchTerm], () => {
  page.value = 1
})
</script>

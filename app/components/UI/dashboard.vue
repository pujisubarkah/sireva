<template>
  <div class="p-4 border border-gray-200 rounded-lg shadow-sm h-fit bg-guide-100">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <div v-for="stat in stats" :key="stat.title" class="w-full">
        <div class="flex flex-row gap-4 w-full bg-white p-2 border border-neutral-200 rounded-lg">
          <div class="flex flex-row justify-between w-full h-fit py-0">
            <div class="flex flex-col">
              <h1 class="text-[8px] md:text-[10px] font-medium text-slate-500">{{ stat.title }}</h1>
              <p class="text-xs md:text-sm font-semibold text-slate-900">{{ stat.value }}</p>
              <p
                class="text-[8px] md:text-[10px] font-medium text-emerald-500 flex flex-row gap-2 items-center"
              >
                <IconTrendingUp :size="12" class="inline" />
                {{ stat.subValue }}
                <span class="text-[8px] md:text-[10px] font-medium text-slate-400"
                  >{{ stat.subText }}</span
                >
              </p>
            </div>
            <div
              class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"
            >
              <component :is="stat.icon" :size="12" class="text-slate-700" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 h-[400px] w-full gap-4">
      <div class="border border-neutral-200 rounded-lg bg-white p-4">
        <component
          :is="apexchartComponent"
          v-if="apexchartComponent"
          type="area"
          height="100%"
          :series="series"
          :options="options"
        />
        <div v-else class="flex h-full items-center justify-center text-slate-400">
          Loading chart...
        </div>
      </div>

      <div class="border border-neutral-200 rounded-lg bg-white overflow-hidden">
        <Table
          :columns="columns"
          :fetchData="fetchData"
          :pageSizeOptions="[]"
          :initialSortOrder="null"
          :showSearch="false"
          :showPagination="false"
          rowKey="id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, onMounted } from 'vue';
import { Table } from '@idds/vue';
import { 
  IconTrendingUp, IconChartBar, IconTarget, 
  IconCreditCard, IconUsers, IconChartPie 
} from '@tabler/icons-vue';

const stats = [
  { title: 'Sasaran Strategis', value: '12', subValue: '+2.4%', subText: 'vs bln lalu', icon: IconTarget },
  { title: 'Sasaran Program', value: '48', subValue: '+5.1%', subText: 'vs bln lalu', icon: IconChartPie },
  { title: 'Realisasi Anggaran', value: '78.4%', subValue: '+12.3%', subText: 'vs bln lalu', icon: IconCreditCard },
  { title: 'Total User', value: '1,294', subValue: '+84', subText: 'new joiners', icon: IconUsers },
];

const columns = [
  {
    header: 'Bulan',
    accessor: 'day',
  },
  {
    header: 'Capaian (%)',
    accessor: 'price',
  },
];

const data = [
  { id: 1, day: 'Januari', price: 72 },
  { id: 2, day: 'Februari', price: 78 },
  { id: 3, day: 'Maret', price: 75 },
  { id: 4, day: 'April', price: 84 },
  { id: 5, day: 'Mei', price: 82 },
];

const fetchData = async () => {
  const initialPageSize = 5;
  let resultData = [...data];

  if (resultData.length < initialPageSize) {
    const emptyRowsCount = initialPageSize - resultData.length;
    const emptyRows = Array(emptyRowsCount).fill({});
    resultData = [...resultData, ...emptyRows];
  }

  return {
    data: resultData,
    total: resultData.length,
  };
};

const apexchartComponent = shallowRef<any>(null);

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const module = await import('vue3-apexcharts');
    apexchartComponent.value = module.default;
  }
});

const series = [{ name: 'Capaian', data: data.map((item) => item.price) }];

const options = {
  chart: {
    type: 'area',
    toolbar: { show: false },
    zoom: { enabled: false },
    fontFamily: 'Inter, sans-serif',
  },
  colors: ['#2663A3'],
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.5,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    strokeDashArray: 4,
    padding: {
      left: 8,
      right: 8,
    },
  },
  xaxis: {
    categories: data.map((item) => item.day),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      show: true,
      style: { colors: '#94a3b8' }
    },
  },
  yaxis: {
    labels: {
      show: true,
      style: { colors: '#94a3b8' }
    },
  },
  tooltip: {
    enabled: true,
  },
};
</script>

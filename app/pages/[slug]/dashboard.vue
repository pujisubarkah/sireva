<template>
  <div class="space-y-4">
    <PerformanceMap />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import PerformanceMap from '@/components/PerformanceMap.vue'
</script>

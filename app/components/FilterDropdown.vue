<template>
  <div class="relative" ref="refDropdown">
    <button
      type="button"
      @click="open = !open"
      class="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 border border-blue-600 text-white text-sm font-semibold rounded-lg px-3 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-30 justify-between"
    >
      <span class="flex items-center gap-1.5">
        <component :is="icon" :size="14" :stroke="'2'" />
        {{ modelValue }}
      </span>
      <component :is="iconMap.IconChevronDown" :size="14" :stroke="'2.5'" :class="['transition-transform duration-200', open ? 'rotate-180' : '']" />
    </button>
    <div v-if="open" class="absolute left-0 mt-2 w-full min-w-32.5 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
      <button
        v-for="opt in options"
        :key="opt"
        type="button"
        @click="select(opt)"
        :class="[
          'w-full text-left px-4 py-2 text-sm transition-colors rounded-lg',
          opt === modelValue
            ? 'bg-blue-50 text-blue-900 font-bold'
            : 'text-gray-700 hover:bg-gray-50'
        ]"
      >
        {{ opt }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { IconChevronDown } from '@tabler/icons-vue';

const props = defineProps({
  icon: { type: [Object, Function], required: true },
  modelValue: { type: String, required: true },
  options: { type: Array as () => string[], required: true }
});
const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const refDropdown = ref<HTMLElement|null>(null);
const iconMap = computed(() => ({ IconChevronDown }));

function handleClickOutside(event: MouseEvent) {
  if (refDropdown.value && !refDropdown.value.contains(event.target as Node)) {
    open.value = false;
  }
}
function select(opt: string) {
  emit('update:modelValue', opt);
  open.value = false;
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

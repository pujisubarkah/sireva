<template>
  <div>
    <NuxtLink
      v-if="item.href && !item.children"
      :to="item.href"
      :class="[
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-base font-medium',
        isActive(item.href)
          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
          : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
      ]"
    >
      <span :class="[
        'flex items-center justify-center transition-colors duration-200',
        isActive(item.href)
          ? 'text-white'
          : 'text-blue-300/70 group-hover:text-blue-200'
      ]">
        <component :is="iconMap[item.icon]" :size="20" :stroke="1.5" />
      </span>
      {{ item.label }}
    </NuxtLink>

    <div v-else-if="item.children" class="rounded-xl overflow-hidden border border-white/5 bg-white/2">
      <div
        @click="isOpen = !isOpen"
        :class="[
          'flex items-center justify-between gap-3 px-3 py-2.5 text-base font-medium cursor-pointer select-none transition-colors duration-200',
          isParentActive(item)
            ? 'text-white bg-blue-700/50'
            : 'text-blue-100/80 hover:bg-white/5 hover:text-white'
        ]"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span :class="isParentActive(item) ? 'text-white' : 'text-blue-300/80'">
            <component :is="iconMap[item.icon]" :size="20" :stroke="1.5" />
          </span>
          <span class="truncate">{{ item.label }}</span>
        </div>
        <component 
          :is="iconMap['IconChevronDown']" 
          :size="16" 
          :stroke="2" 
          :class="[
            'transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
            isParentActive(item) ? 'text-blue-100' : 'text-blue-300/70'
          ]" 
        />
      </div>
      <div v-show="isOpen" class="pb-2 px-2">
        <NuxtLink
          v-for="child in item.children"
          :key="child.href"
          :to="child.href"
          :class="[
            'group flex items-center gap-2 pl-6 pr-3 py-2 rounded-lg text-base transition-all duration-200',
            isActive(child.href)
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/20'
              : 'text-blue-100/70 hover:bg-white/5 hover:text-white'
          ]"
        >
          <span :class="[
            'flex items-center justify-center',
            isActive(child.href)
              ? 'text-white'
              : 'text-blue-300/70 group-hover:text-blue-200'
          ]">
            <component :is="iconMap[child.icon]" :size="16" :stroke="1.8" />
          </span>
          <span class="leading-snug">{{ child.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, watch, onMounted } from 'vue';
import type { PropType } from 'vue';

interface SidebarMenuChildItem {
  label: string;
  href: string;
  icon: string;
}
interface SidebarMenuItem {
  label: string;
  href?: string;
  children?: SidebarMenuChildItem[];
  icon: string;
  optional?: boolean;
}

const props = defineProps({
  item: {
    type: Object as PropType<SidebarMenuItem>,
    required: true,
    default: () => ({ label: '', icon: '' })
  },
  iconMap: {
    type: Object as PropType<Record<string, any>>,
    required: true,
    default: () => ({})
  },
  activePath: {
    type: String,
    required: true,
    default: ''
  }
});
const route = useRoute();
function isActive(href: string) {
  return props.activePath === href || props.activePath?.startsWith(`${href}/`);
}
function isParentActive(item: SidebarMenuItem) {
  if (item.href && isActive(item.href)) return true;
  if (item.children) return item.children.some(child => isActive(child.href));
  return false;
}

const isOpen = ref(false);

onMounted(() => {
  if (isParentActive(props.item)) {
    isOpen.value = true;
  }
});

watch(() => props.activePath, () => {
  if (isParentActive(props.item)) {
    isOpen.value = true;
  }
});
</script>

import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthUser } from '@/composables/useAuthUser';
import { SIDEBAR_MENU_ROUTES } from '@/constants/sidebarMenuRoutes';

export interface SidebarMenuChildItem {
  label: string;
  href: string;
  icon: string;
}

export interface SidebarMenuItem {
  label: string;
  href?: string;
  children?: SidebarMenuChildItem[];
  icon: string;
  optional?: boolean;
}

export type SidebarVariant = 'admin' | 'user';

interface UseSidebarMenuOptions {
  variant?: SidebarVariant;
  showLaporan?: boolean;
}

const adminMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    href: SIDEBAR_MENU_ROUTES.dashboard,
    icon: 'IconDashboard',
  },
  {
    label: 'Perencanaan Kinerja',
    icon: 'IconClipboardList',
    children: [
      { label: 'Visi, Misi, dan Tujuan', href: SIDEBAR_MENU_ROUTES.visiMisiTujuan, icon: 'IconFlag' },
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.sasaranStrategis, icon: 'IconTargetArrow' },
      { label: 'Perjanjian Kinerja', href: SIDEBAR_MENU_ROUTES.perjanjianKinerja, icon: 'IconChecklist' },
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.sasaranProgram, icon: 'IconFocus2' },
      { label: 'Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.sasaranKegiatan, icon: 'IconListDetails' },
    ],
  },
  {
    label: 'Pemantauan Kinerja',
    icon: 'IconChartBar',
    children: [
      { label: 'Cascading', href: SIDEBAR_MENU_ROUTES.cascading, icon: 'IconSitemap' },
    ],
  },
  {
    label: 'Data Master',
    icon: 'IconDatabase',
    children: [
      { label: 'Master Unit Kerja', href: SIDEBAR_MENU_ROUTES.masterUnitKerja, icon: 'IconSitemap' },
      { label: 'Master User', href: SIDEBAR_MENU_ROUTES.masterUser, icon: 'IconUser' },
    ],
  },
];

const userMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    href: SIDEBAR_MENU_ROUTES.dashboard,
    icon: 'IconDashboard',
  },
  {
    label: 'Pemantauan Kinerja',
    icon: 'IconChartBar',
    children: [
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.sasaranStrategis, icon: 'IconActivity' },
      { label: 'Perjanjian Kinerja', href: SIDEBAR_MENU_ROUTES.perjanjianKinerja, icon: 'IconChecklist' },
      { label: 'Cascading', href: SIDEBAR_MENU_ROUTES.cascading, icon: 'IconSitemap' },
    ],
  },
  {
    label: 'Rencana Aksi',
    href: SIDEBAR_MENU_ROUTES.rencanaAksi,
    icon: 'IconChecklist',
  },
  {
    label: 'Laporan',
    href: SIDEBAR_MENU_ROUTES.laporan,
    icon: 'IconFileText',
    optional: true,
  },
];

export function useSidebarMenu(options: UseSidebarMenuOptions = {}) {
  const route = useRoute();
  const { role } = useAuthUser();

  const showLaporan = options.showLaporan ?? true;
  const slug = computed(() => String(route.params.slug || '').toLowerCase());

  const resolvedVariant = computed<SidebarVariant>(() => {
    if (options.variant) return options.variant;
    if (role.value) return role.value === 'admin' ? 'admin' : 'user';
    return slug.value === 'admin' ? 'admin' : 'user';
  });

  const menuTitle = computed(() => (resolvedVariant.value === 'user' ? 'Menu User' : 'Menu Utama'));

  const slugPrefix = computed(() => (slug.value ? `/${slug.value}` : ''));

  const resolveHref = (href: string) => `${slugPrefix.value}${href}`;

  const menuItems = computed<SidebarMenuItem[]>(() => {
    const baseMenuItems = resolvedVariant.value === 'user' ? userMenuItems : adminMenuItems;
    return baseMenuItems
      .filter((item) => !(item.optional && !showLaporan))
      .map((item) => ({
        ...item,
        href: item.href ? resolveHref(item.href) : undefined,
        children: item.children?.map((child) => ({
          ...child,
          href: resolveHref(child.href),
        })),
      }));
  });

  return { menuItems, menuTitle, resolvedVariant };
}

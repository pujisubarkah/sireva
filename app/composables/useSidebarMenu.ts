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

export type SidebarVariant = 'super_admin' | 'admin' | 'user' | 'verifikator' | 'kepala';

interface UseSidebarMenuOptions {
  variant?: SidebarVariant;
  showLaporan?: boolean;
}

const superAdminMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    href: SIDEBAR_MENU_ROUTES.dashboard,
    icon: 'IconDashboard',
  },
  {
    label: 'Perencanaan',
    icon: 'IconClipboardList',
    children: [
      { label: 'Visi, Misi, Tujuan', href: SIDEBAR_MENU_ROUTES.visiMisiTujuan, icon: 'IconFlag' },
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.sasaranStrategis, icon: 'IconTargetArrow' },
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.sasaranProgram, icon: 'IconFocus2' },
      { label: 'Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.sasaranKegiatan, icon: 'IconListDetails' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.rencanaAksi, icon: 'IconChecklist' },
    ],
  },
  {
    label: 'Pemantauan',
    icon: 'IconChartBar',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.pemantauanSasaranProgram, icon: 'IconFocus2' },
      { label: 'Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.pemantauanSasaranKegiatan, icon: 'IconListDetails' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.pemantauanRencanaAksi, icon: 'IconChecklist' },
    ],
  },
  {
    label: 'Cascading Kinerja',
    href: SIDEBAR_MENU_ROUTES.cascading,
    icon: 'IconSitemap',
  },
  {
    label: 'Laporan',
    icon: 'IconReport',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.laporanSasaranProgram, icon: 'IconReport' },
      { label: 'Kinerja (Rencana Aksi)', href: SIDEBAR_MENU_ROUTES.laporanRencanaAksi, icon: 'IconReport' },
    ],
  },
  {
    label: 'Manajemen Sistem',
    icon: 'IconSettings',
    children: [
      { label: 'Master Unit Kerja', href: SIDEBAR_MENU_ROUTES.masterUnitKerja, icon: 'IconSitemap' },
      { label: 'Master User', href: SIDEBAR_MENU_ROUTES.masterUser, icon: 'IconUser' },
      { label: 'Master Visi, Misi, Tujuan', href: SIDEBAR_MENU_ROUTES.masterVisiMisiTujuan, icon: 'IconFlag' },
      { label: 'Master Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.masterSasaranStrategis, icon: 'IconTargetArrow' },
      { label: 'Master Sasaran Program', href: SIDEBAR_MENU_ROUTES.masterSasaranProgram, icon: 'IconFocus2' },
      { label: 'Master Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.masterSasaranKegiatan, icon: 'IconListDetails' },
    ],
  },
];

const adminMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    href: SIDEBAR_MENU_ROUTES.dashboard,
    icon: 'IconDashboard',
  },
  {
    label: 'Perencanaan',
    icon: 'IconClipboardList',
    children: [
      { label: 'Visi, Misi, Tujuan', href: SIDEBAR_MENU_ROUTES.visiMisiTujuan, icon: 'IconFlag' },
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.sasaranStrategis, icon: 'IconTargetArrow' },
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.sasaranProgram, icon: 'IconFocus2' },
      { label: 'Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.sasaranKegiatan, icon: 'IconListDetails' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.rencanaAksi, icon: 'IconChecklist' },
    ],
  },
  {
    label: 'Pemantauan',
    icon: 'IconChartBar',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.pemantauanSasaranProgram, icon: 'IconFocus2' },
      { label: 'Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.pemantauanSasaranKegiatan, icon: 'IconListDetails' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.pemantauanRencanaAksi, icon: 'IconChecklist' },
    ],
  },
  {
    label: 'Cascading Kinerja',
    href: SIDEBAR_MENU_ROUTES.cascading,
    icon: 'IconSitemap',
  },
  {
    label: 'Laporan',
    icon: 'IconReport',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.laporanSasaranProgram, icon: 'IconReport' },
      { label: 'Kinerja (Rencana Aksi)', href: SIDEBAR_MENU_ROUTES.laporanRencanaAksi, icon: 'IconReport' },
    ],
  },
];

const userMenuItems: SidebarMenuItem[] = [
  ...adminMenuItems,
];

const verifikatorMenuItems: SidebarMenuItem[] = [
  ...adminMenuItems,
];

const kepalaMenuItems: SidebarMenuItem[] = [
  ...adminMenuItems,
];

export function useSidebarMenu(options: UseSidebarMenuOptions = {}) {
  const route = useRoute();
  const { role } = useAuthUser();

  const showLaporan = options.showLaporan ?? true;
  const slug = computed(() => String(route.params.slug || '').toLowerCase());

  const resolvedVariant = computed<SidebarVariant>(() => {
    if (options.variant) return options.variant;
    const roleName = role.value?.replace(/\s+/g, '_') as SidebarVariant;
    if (roleName) return roleName;
    return (slug.value?.replace(/\s+/g, '_') as SidebarVariant) || 'user';
  });

  const menuTitle = computed(() => {
    switch (resolvedVariant.value) {
      case 'super_admin': return 'Menu Super Admin';
      case 'admin': return 'Menu Admin (Eselon 1)';
      case 'user': return 'Menu User';
      case 'verifikator': return 'Menu Verifikator';
      case 'kepala': return 'Menu Kepala';
      default: return 'Menu Utama';
    }
  });

  const slugPrefix = computed(() => (slug.value ? `/${slug.value}` : ''));

  const resolveHref = (href: string) => `${slugPrefix.value}${href}`;

  const menuItems = computed<SidebarMenuItem[]>(() => {
    let baseMenuItems: SidebarMenuItem[] = [];
    switch (resolvedVariant.value) {
      case 'super_admin': baseMenuItems = superAdminMenuItems; break;
      case 'admin': baseMenuItems = adminMenuItems; break;
      case 'verifikator': baseMenuItems = verifikatorMenuItems; break;
      case 'kepala': baseMenuItems = kepalaMenuItems; break;
      default: baseMenuItems = userMenuItems; break;
    }
    
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

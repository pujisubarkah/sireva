import { computed } from 'vue';

export interface AuthUser {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
  role_id?: number;
  alias?: string;
  unit_kerja?: string;
}

export function useAuthUser() {
  const authUser = useCookie<AuthUser | null>('sireva_user', {
    default: () => null,
    sameSite: 'lax',
  });

  const role = computed(() => String(authUser.value?.role || '').toLowerCase());

  const setAuthUser = (user: AuthUser | null) => {
    authUser.value = user;
  };

  const clearAuthUser = () => {
    authUser.value = null;
  };

  return {
    authUser,
    role,
    setAuthUser,
    clearAuthUser,
  };
}

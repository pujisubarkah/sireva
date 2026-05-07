import { useAuthUser } from '~/composables/useAuthUser'

export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Skip middleware during SSR if needed, or if on login page
  if (to.path === '/login' || to.path === '/') {
    return
  }

  // 2. Get auth state
  const { authUser } = useAuthUser()
  
  // 3. If no user, redirect to login
  if (!authUser.value) {
    return navigateTo('/login')
  }

  // 4. Role-based path protection (Slug validation)
  // Our URLs are structured as /[role]/[page]
  const pathParts = to.path.split('/').filter(Boolean)
  if (pathParts.length > 0 && pathParts[0]) {
    const slug = pathParts[0].toLowerCase()
    const userRole = String(authUser.value?.role || '').toLowerCase().replace(/\s+/g, '_')
    
    // Check if user is trying to access a slug that doesn't belong to their role
    // Super admin can access anything (usually) or we might want to redirect them to their own dashboard
    if (userRole !== 'super_admin' && slug !== userRole) {
       // Allow navigation if the first part is NOT a role slug (e.g. static assets, public pages)
       // But here we assume everything under /[slug] is protected
       const roles = ['super_admin', 'admin', 'user', 'verifikator', 'kepala']
       if (roles.includes(slug)) {
         return navigateTo(`/${userRole}/dashboard`)
       }
    }
  }
})

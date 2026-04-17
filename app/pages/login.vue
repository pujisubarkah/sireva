<template>
  <!-- Login Page -->
  <div class="min-h-screen bg-blue-600 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-2xl shadow-xl space-y-6 w-full max-w-md overflow-hidden">
      <!-- Blue header banner -->
      <div class="bg-blue-600 px-8 pt-8 pb-6">
        <h1 class="text-2xl font-bold text-white">Login</h1>
        <p class="text-sm text-blue-100 mt-1">Masuk ke akun Sireva kamu</p>
      </div>
      <div class="px-8 pb-8 space-y-4">
      <!-- Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-full">
        <div class="flex flex-col gap-2">
          <TextField 
            label="Email" 
            v-model="email" 
            type="email"
            placeholder="example@email.com"
            :error="errors.email"
          />
        </div>
        <div class="flex flex-col gap-2">
          <PasswordInput 
            label="Password" 
            v-model="password" 
            placeholder="Kata sandi"
            :error="errors.password"
          />
          <Button hierarchy="link" class="self-start text-xs text-indigo-500 hover:text-indigo-700">Lupa Password?</Button>
        </div>
        <!-- Buttons -->
        <div class="flex flex-col gap-3 pt-2">
          <Button 
            hierarchy="primary" 
            type="submit"
            :loading="loading"
            :disabled="!isValid"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Masuk
          </Button>
          <div class="flex items-center gap-2">
            <div class="flex-1 h-px bg-gray-200"></div>
            <p class="text-xs text-gray-400">Atau</p>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>
          <Button hierarchy="secondary" @click="handleSSO" class="w-full border border-blue-400 text-blue-600 hover:bg-blue-50 font-medium py-2 rounded-lg transition-colors">SSO Login</Button>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#app'
import { useToast } from '#imports'
import { Button, TextField, PasswordInput } from '@idds/vue'

// nuxt-users is temporarily disabled — stub auth state locally
const user = ref<null | { email: string }>(null)
const login = (u: { email: string }) => { user.value = u }
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const serverError = ref('')

const errors = ref({
  email: '',
  password: ''
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isValid = computed(() => {
  errors.value.email = email.value && !emailRegex.test(email.value) ? 'Email tidak valid' : ''
  errors.value.password = !password.value ? 'Password wajib diisi' : ''
  return !errors.value.email && !errors.value.password && email.value && password.value
})

const resetErrors = () => {
  serverError.value = ''
  errors.value = { email: '', password: '' }
}

const handleLogin = async () => {
  if (!isValid.value) return
  
  loading.value = true
  resetErrors()
  
  try {
    // TODO: replace with real auth endpoint when nuxt-users is re-enabled
    toast.error('Autentikasi belum aktif. Hubungi administrator.')
  } catch (error: any) {
    console.error('Login error:', error)
    const message = error.message || 'Login gagal. Coba lagi.'
    toast.error(message)
    serverError.value = message
  } finally {
    loading.value = false
  }
}

const handleSSO = () => {
  toast.info('SSO belum diimplementasi')
}

// Check if already logged in
onMounted(() => {
  if (user.value) navigateTo('/')
})
</script>

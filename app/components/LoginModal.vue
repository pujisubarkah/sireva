<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="$emit('update:modelValue', false)"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('update:modelValue', false)"></div>

        <!-- Modal Card -->
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10">
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 text-white/80 hover:text-white z-20 transition-colors"
            type="button"
            @click="$emit('update:modelValue', false)"
            aria-label="Tutup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>

          <!-- Blue header banner -->
          <div class="bg-[#1F4F85] px-8 pt-8 pb-6">
            <h1 class="text-2xl font-bold text-white">Login</h1>
            <p class="text-sm text-blue-100 mt-1">Masuk ke akun Sireva kamu</p>
          </div>

          <!-- Form -->
          <div class="px-8 pb-8 pt-6 space-y-4">
            <form @submit.prevent="handleLogin" class="flex flex-col gap-4 w-full">
              <div class="flex flex-col gap-2">
                <div class="relative">
                  <label class="text-sm font-semibold text-black mb-1 ml-1 flex items-center gap-1" for="login-username">
                    <IconMail size="18" class="inline-block" />
                    Username
                  </label>
                  <input
                    id="login-username"
                    v-model="usernameOrEmail"
                    type="text"
                    placeholder="username"
                    :class="['transition-all duration-200 w-full py-2 pl-4 pr-3 rounded-lg border focus:outline-none', errors.usernameOrEmail ? 'border-red-400 focus:border-red-500' : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100']"
                  />

                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div class="relative">
                  <label class="text-sm font-semibold text-black mb-1 ml-1 flex items-center gap-1" for="login-password">
                    <IconLock size="18" class="inline-block" />
                    Password
                  </label>
                  <input
                    id="login-password"
                    v-model="password"
                    type="password"
                    placeholder="Kata sandi"
                    :class="['transition-all duration-200 w-full py-2 pl-4 pr-3 rounded-lg border focus:outline-none', errors.password ? 'border-red-400 focus:border-red-500' : 'border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100']"
                  />

                </div>
                <Button hierarchy="link" class="self-start text-xs text-indigo-500 hover:text-indigo-700">Lupa Password?</Button>
                              <span class="text-xs text-gray-400 mt-1 block ml-1">Jika Anda lupa kata sandi, silakan hubungi admin sireva.</span>
              </div>
              <!-- Buttons -->
              <div class="flex flex-col gap-3 pt-2">
                <Button
                  hierarchy="primary"
                  type="submit"
                  :loading="loading"
                  :disabled="!isValid"
                  class="w-full bg-[#2663A3] hover:bg-[#1F4F85] text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Masuk
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { navigateTo } from '#app'
import { useToast } from '#imports'
import { Button } from '@idds/vue'
import { IconMail, IconLock } from '@tabler/icons-vue'
import { useAuthUser } from '@/composables/useAuthUser'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const toast = useToast()
const { setAuthUser } = useAuthUser()

const usernameOrEmail = ref('')
const password = ref('')
const loading = ref(false)
const serverError = ref('')

const errors = ref({ usernameOrEmail: '', password: '' })

const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/

const isValid = computed(() => {
  if (!usernameOrEmail.value) {
    errors.value.usernameOrEmail = 'Username wajib diisi'
  } else if (!usernameRegex.test(usernameOrEmail.value)) {
    errors.value.usernameOrEmail = 'Username minimal 3 karakter, hanya huruf, angka, titik, underscore, atau strip'
  } else {
    errors.value.usernameOrEmail = ''
  }
  errors.value.password = !password.value ? 'Password wajib diisi' : ''
  return !errors.value.usernameOrEmail && !errors.value.password && usernameOrEmail.value && password.value
})

const resetForm = () => {
  usernameOrEmail.value = ''
  password.value = ''
  serverError.value = ''
  errors.value = { usernameOrEmail: '', password: '' }
}

// Reset form when modal closes
watch(() => props.modelValue, (val) => {
  if (!val) resetForm()
})


const handleLogin = async () => {
  if (!isValid.value) return
  loading.value = true
  serverError.value = ''

  try {
    const data = await $fetch<any>('/api/auth/login', {
      method: 'POST',
      body: {
        usernameOrEmail: usernameOrEmail.value,
        password: password.value,
      },
    })
    if (data.success) {
      toast.success('Login berhasil!')
      setAuthUser(data.user ?? null)
      emit('update:modelValue', false)
      resetForm()
      // Redirect ke /[slug] sesuai role
      const role = data.user?.role?.toLowerCase()
      if (role) {
        navigateTo(`/${role}`)
      } else {
        navigateTo('/')
      }
    } else {
      toast.error(data.message || 'Login gagal')
      serverError.value = data.message || 'Login gagal'
    }
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
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>

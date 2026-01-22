<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/auth/useAuth'

const username = ref('')
const password = ref('')

const { login, isLoading, errorMessage } = useAuth()

const submit = async () => {
    const ok = await login(username.value, password.value)
    if (ok) {
        window.location.href = '/home'
    }
}
</script>

<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="login-form-container">
            <form @submit.prevent="submit" class="login-form" autocomplete="off">
                <div class="text-center mb-4">
                    <img src="../assets/logo.png" alt="Logo" class="img-fluid" style="max-width: 200px" />
                </div>
                <div class="login-form-group-custom">
                    <div class="mb-3">
                        <label for="username" class="login-form-label">Usuario</label>
                        <input id="username" type="text" placeholder="Usuario" class="form-control form-control-sm"
                            name="username" v-model="username" />
                    </div>

                    <div class="mb-3">
                        <label for="password" class="login-form-label">Contraseña</label>
                        <input id="password" type="password" placeholder="Contraseña"
                            class="form-control form-control-sm" name="password" v-model="password" />
                    </div>

                    <div class="mb-3">
                        <button class="btn btn-primary login-btn-sm w-100" type="submit" :disabled="isLoading">
                            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"
                                aria-hidden="true"></span>
                            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                        </button>
                    </div>

                    <div v-if="errorMessage" class="alert alert-danger login-alert-sm" role="alert">
                        {{ errorMessage }}
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>

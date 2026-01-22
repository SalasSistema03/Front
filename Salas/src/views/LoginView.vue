<script setup>
import { ref } from 'vue'
import axios from 'axios'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const loginUrl = import.meta.env.VITE_API_AUTH_URL + '/v1/auth/login'
const login = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        const response = await axios.post(loginUrl, {
            username: username.value,
            password: password.value,
        })
        //console.log(response)
        const { access_token, token_type } = response.data
        localStorage.setItem('token', access_token)
        localStorage.setItem('token_type', token_type)
        //console.log(access_token, token_type)

        window.location.href = '/home'
    } catch (error) {
        if (error.response) {
            const data = error.response.data

            // Si es error de validación (422)
            if (error.response.status === 422 && data.errors) {
                // Tomamos el primer error del primer campo
                const firstField = Object.keys(data.errors)[0]
                errorMessage.value = data.errors[firstField][0]
            }
            // Si viene un message simple
            else if (data.message) {
                errorMessage.value = data.message
            } else {
                errorMessage.value = 'Error en el inicio de sesión'
            }
        } else {
            errorMessage.value = 'Error en la conexión con el servidor'
        }

        //console.error(error)
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
        <div class="login-form-container">
            <form @submit.prevent="login" class="login-form" autocomplete="off">
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

// Función para verificar si el usuario está autenticado (mejorada)
import { getUser } from "../api/Usuario/userApi";
import axios from 'axios'

export function isAuthenticated() {
    const token = getToken()
    if (!token) return false

    try {
        // Verificar formato del token
        const parts = token.split('.')
        if (parts.length !== 3) return false

        // Verificar payload
        const payload = JSON.parse(atob(parts[1]))
        const currentTime = Date.now() / 1000

        // Verificar que no esté expirado y tenga datos mínimos
        return payload.exp && payload.exp > currentTime && payload.sub
    } catch {
        return false
    }
}

// Función para verificar si el usuario es admin
export async function isAdmin() {
    const token = getToken()

    if (!token || !isAuthenticated()) return false


    try {
        const user = await getUser(token)
      

        if (user.data.admin === 1) {
          
            return user.data.admin === 1
        }
        return false
    } catch {
        return false
    }
}

// Función para obtener el token (con validación)
export function getToken() {
    const token = localStorage.getItem('token')
    if (!token) return null

    // Validación básica del formato
    if (typeof token !== 'string' || token.length < 50) {
        clearAuth()
        return null
    }

    return token

}

// Función para obtener el token type
export function getTokenType() {
    return localStorage.getItem('token_type') || 'Bearer'
}

// Función para obtener headers de autenticación
export function getAuthHeaders() {
    const token = getToken()
    const tokenType = getTokenType()

    if (!token) return {}

    return {
        'Authorization': `${tokenType} ${token}`,
        'Content-Type': 'application/json'
    }
}

// Función para limpiar la autenticación
export function clearAuth() {
    localStorage.removeItem('token')
    localStorage.removeItem('token_type')
    localStorage.removeItem('user_data')
}

// Función para verificar si el token está por expirar (5 minutos)
export function isTokenExpiringSoon() {
    const token = getToken()
    if (!token) return true

    try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000
        const fiveMinutes = 5 * 60 // 5 minutos en segundos
        return payload.exp - currentTime < fiveMinutes
    } catch {
        return true
    }
}

// Función para refrescar el token (implementar según tu API)
export async function refreshToken() {
    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: getAuthHeaders()
        })

        if (response.ok) {
            const data = await response.json()
            localStorage.setItem('token', data.access_token)
            return true
        }
    } catch (error) {
        console.error('Error refreshing token:', error)
    }

    clearAuth()
    return false
}

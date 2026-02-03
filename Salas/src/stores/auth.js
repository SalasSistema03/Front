import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null, // Aquí guardaremos los datos del usuario
        menuData: [],
        permisos: { navs: [], vistas: [], botones: [] },
        isLoaded: false
    }),

    actions: {
        async fetchPermissions() {
            if (!this.token || this.isLoaded) return;

            try {
                const urlNav = import.meta.env.VITE_API_AUTH_URL + '/v1/auth/nav';
                const urlMe = import.meta.env.VITE_API_AUTH_URL + '/v1/auth/me';

                // Lanzamos ambas peticiones para tener todo
                const [resNav, resMe] = await Promise.all([
                    axios.get(urlNav, { headers: { Authorization: `Bearer ${this.token}` } }),
                    axios.get(urlMe, { headers: { Authorization: `Bearer ${this.token}` } })
                ]);

                const dataNav = resNav.data.data || resNav.data;
                const dataMe = resMe.data.data || resMe.data;

                // Guardamos todo
                this.menuData = dataNav.menu;
                this.permisos = dataNav.permisos;
                this.user = dataMe; // Aquí es donde llega el campo 'admin'

                this.isLoaded = true;

                
            } catch (error) {
                
                this.logout();
            }
        },

        // Verifica si el nombre de la vista está en el array de permisos
        canView(nombreVista) {
            return this.permisos.vistas.includes(nombreVista);
        },

        // Verifica si el nombre del botón está en el array de botones
        canAction(nombreBoton) {
            return this.permisos.botones.includes(nombreBoton);
        },

        logout() {
            this.token = null;
            this.user = null;
            this.menuData = [];
            this.permisos = { navs: [], vistas: [], botones: [] };
            this.isLoaded = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
    }
});
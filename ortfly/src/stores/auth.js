import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // Estados reactivos globales
  const usuario = ref(null) // Guardará los datos del usuario logueado
  const rol = ref(null)     // 'cliente', 'admin' o null si está deslogueado

  const estaLogueado = computed(() => usuario.value !== null)
  const esAdmin = computed(() => rol.value === 'admin')

  // funciones para modificar el estado
  const login = (datosUsuario, rolAsignado) => {
    usuario.value = datosUsuario
    rol.value = rolAsignado
    // localStorage por si se refresca la pantalla
    localStorage.setItem('ortfly_rol', rolAsignado)
    localStorage.setItem('ortfly_user', JSON.stringify(datosUsuario))
  }

  const logout = () => {
    usuario.value = null
    rol.value = null
    localStorage.removeItem('ortfly_rol')
    localStorage.removeItem('ortfly_user')
  }

  return {
    usuario,
    rol,
    estaLogueado,
    esAdmin,
    login,
    logout
  }
})
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // Intentamos recuperar los datos guardados en el disco antes de inicializar en null
  const rolGuardado = localStorage.getItem('ortfly_rol')
  const usuarioGuardado = localStorage.getItem('ortfly_user')

  // Estados reactivos globales inicializados de forma persistente
  const usuario = ref(usuarioGuardado ? JSON.parse(usuarioGuardado) : null) 
  const rol = ref(rolGuardado || null)     

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
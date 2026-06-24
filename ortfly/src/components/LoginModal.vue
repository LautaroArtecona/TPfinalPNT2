<script setup>
import { ref } from 'vue'
import { MOCKAPI_URL } from '../config/api'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  mostrar: Boolean,
  rol: String // 'cliente' o 'admin'
})

const emit = defineEmits(['cerrar', 'loginExitoso'])

const authStore = useAuthStore() // Instanciamos Pinia

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const cargando = ref(false)

const handleSubmit = async () => {
  errorMsg.value = ''
  cargando.value = true

  try {
    // Buscamos en MockAPI el usuario que coincida con el email ingresado
    const respuesta = await fetch(`${MOCKAPI_URL}/usuarios?email=${email.value}`)
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const usuariosEncontrados = await respuesta.json()

    // MockAPI devuelve un array. Si está vacío, el email no existe
    if (usuariosEncontrados.length === 0) {
      throw new Error('El correo electrónico no está registrado.')
    }

    const usuario = usuariosEncontrados[0]

    // Validamos que la contraseña coincida
    if (usuario.password !== password.value) {
      throw new Error('Contraseña incorrecta.')
    }

    // Validamos que el rol del usuario coincida con el tipo de login seleccionado
    if (usuario.rol !== props.rol) {
      throw new Error(`Este usuario no tiene permisos de ${props.rol === 'admin' ? 'Administrador' : 'Cliente'}.`)
    }

    // Si todo está ok, guardamos en Pinia y avisamos al componente padre
    authStore.login(usuario, usuario.rol)
    emit('loginExitoso', usuario.rol)
    
    // Limpiamos formulario
    email.value = ''
    password.value = ''

  } catch (error) {
    errorMsg.value = error.message
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div v-if="mostrar" class="modal-overlay" @click.self="emit('cerrar')">
    <div class="modal-container">
      <button class="modal-close" @click="emit('cerrar')">✕</button>
      
      <h2>OrtFly Pasajes</h2>
      <p class="modal-subtitle">
        {{ rol === 'admin' ? '🔑 Panel de Administración' : '✈️ Ingreso para Clientes' }}
      </p>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label>Correo Electrónico</label>
          <input 
            type="email" 
            v-model="email" 
            placeholder="ejemplo@correo.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <div v-if="rol === 'cliente'" class="modal-actions">
          <button type="button" class="modal-link" @click="alert('Simulación: Registro')">
            Registrarse
          </button>
          <button type="button" class="modal-link" @click="alert('Simulación: Recuperar clave')">
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <p v-if="errorMsg" class="modal-error">
          ⚠️ {{ errorMsg }}
        </p>

        <button type="submit" class="btn-submit">
          Ingresar como {{ rol === 'admin' ? 'Admin' : 'Cliente' }}
        </button>
      </form>
    </div>
  </div>
</template>
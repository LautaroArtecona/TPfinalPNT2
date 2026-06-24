<script setup>
import { ref } from 'vue'
import { MOCKAPI_URL } from '../config/api'

const props = defineProps({
  mostrar: Boolean
})

const emit = defineEmits(['cerrar', 'irALogin'])

const nombre = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const exitoMsg = ref('')
const cargando = ref(false)

const handleRegister = async () => {
  errorMsg.value = ''
  exitoMsg.value = ''
  cargando.value = true

  try {
    // Traemos la lista completa de usuarios para verificar en JS
    const verificarRespuesta = await fetch(`${MOCKAPI_URL}/usuarios`)
    
    if (!verificarRespuesta.ok) {
      throw new Error('Error al conectar con el servidor de registros.')
    }
    
    const todosLosUsuarios = await verificarRespuesta.json()
    
    // Filtramos nosotros mismos en el frontend para ver si ya existe el mail
    const existeEmail = todosLosUsuarios.some(u => u.email?.toLowerCase() === email.value.toLowerCase())
    
    if (existeEmail) {
      throw new Error('El correo electrónico ya se encuentra registrado.')
    }

    // Si no existe, creamos el objeto para el nuevo usuario cliente
    const nuevoUsuario = {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
      rol: 'cliente'
    }

    // Hacemos el POST para darlo de alta en MockAPI
    const respuestaPost = await fetch(`${MOCKAPI_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoUsuario)
    })

    if (!respuestaPost.ok) {
      throw new Error('No se pudo guardar el usuario en el servidor.')
    }

    exitoMsg.value = '¡Cuenta creada con éxito! Ya puedes iniciar sesión.'
    
    // Limpiamos los campos del formulario
    nombre.value = ''
    email.value = ''
    password.value = ''

    // Redirigir al login automáticamente después de 2 segundos
    setTimeout(() => {
      emit('irALogin')
    }, 2000)

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
      
      <h2>Crear Cuenta</h2>
      <p class="modal-subtitle">✈️ Regístrate para gestionar tus pasajes en OrtFly</p>

      <form @submit.prevent="handleRegister" class="modal-form">
        <div class="form-group">
          <label>Nombre Completo</label>
          <input type="text" v-model="nombre" required placeholder="Ej: Juan Pérez" />
        </div>

        <div class="form-group">
          <label>Correo Electrónico</label>
          <input type="email" v-model="email" required placeholder="ejemplo@correo.com" />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" v-model="password" required placeholder="••••••••" minlength="4" />
        </div>

        <p v-if="errorMsg" class="modal-error">⚠️ {{ errorMsg }}</p>
        
        <p v-if="exitoMsg" class="modal-success">✅ {{ exitoMsg }}</p>

        <button type="submit" class="btn-submit" :disabled="cargando">
          {{ cargando ? 'Registrando...' : 'Registrarse' }}
        </button>

        <p class="register-redirect-text">
          ¿Ya tienes cuenta? 
          <a href="#" @click.prevent="emit('irALogin')" class="register-link">Inicia sesión</a>
        </p>
      </form>
    </div>
  </div>
</template>
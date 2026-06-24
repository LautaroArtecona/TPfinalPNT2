<script setup>
import { ref } from 'vue'
import { MOCKAPI_URL } from '../config/api'

defineProps({
  mostrar: Boolean
})

const emit = defineEmits(['cerrar'])

const cargando = ref(false)
const errorMsg = ref('')
const exitoMsg = ref('')

const formAdmin = ref({
  nombre: '',
  email: '',
  password: ''
})

const guardarAdministrador = async () => {
  errorMsg.value = ''
  exitoMsg.value = ''
  cargando.value = true

  try {
    const verificarRespuesta = await fetch(`${MOCKAPI_URL}/usuarios`)
    if (!verificarRespuesta.ok) throw new Error('Error al conectar con la base de datos.')
    
    const todosLosUsuarios = await verificarRespuesta.json()
    const existeEmail = todosLosUsuarios.some(u => u.email?.toLowerCase() === formAdmin.value.email.toLowerCase())
    
    if (existeEmail) {
      throw new Error('El correo electrónico ya se encuentra registrado.')
    }

    const nuevoAdmin = {
      nombre: formAdmin.value.nombre,
      email: formAdmin.value.email,
      password: formAdmin.value.password,
      rol: 'admin'
    }

    const respuestaPost = await fetch(`${MOCKAPI_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoAdmin)
    })

    if (!respuestaPost.ok) throw new Error('No se pudo guardar el administrador.')

    exitoMsg.value = '¡Administrador registrado con éxito!'
    formAdmin.value = { nombre: '', email: '', password: '' }

    setTimeout(() => {
      emit('cerrar')
      exitoMsg.value = ''
    }, 1500)

  } catch (error) {
    errorMsg.value = error.message
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div v-if="mostrar" class="modal-overlay" @click.self="emit('cerrar')">
    <div class="modal-container modal-container-admin modal-admin-small">
      <button class="modal-close" @click="emit('cerrar')">✕</button>
      <h2>🛠️ Registrar Administrador</h2>
      <p class="modal-subtitle">Agrega un nuevo usuario con permisos de gestión operativa.</p>

      <form @submit.prevent="guardarAdministrador" class="modal-form">
        <div class="form-group">
          <label>Nombre Completo</label>
          <input type="text" v-model="formAdmin.nombre" required placeholder="Ej: Admin ORT" />
        </div>

        <div class="form-group">
          <label>Correo Electrónico</label>
          <input type="email" v-model="formAdmin.email" required placeholder="admin@ortfly.com" />
        </div>

        <div class="form-group">
          <label>Contraseña de Acceso</label>
          <input type="password" v-model="formAdmin.password" required placeholder="••••••••" minlength="4" />
        </div>

        <p v-if="errorMsg" class="modal-error">⚠️ {{ errorMsg }}</p>
        <p v-if="exitoMsg" class="modal-success">✅ {{ exitoMsg }}</p>

        <button type="submit" class="btn-submit btn-admin-submit" :disabled="cargando">
          {{ cargando ? 'Guardando en la nube...' : 'Dar de Alta Administrador' }}
        </button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  rol: String // Puede ser 'cliente' o 'admin'
})


const emit = defineEmits(['cerrar', 'loginExitoso'])

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  // Por ahora no validamos contra API, solo avisamos que se inició sesión
  emit('loginExitoso', props.rol)
  email.value = ''
  password.value = ''
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

        <button type="submit" class="btn-submit">
          Ingresar como {{ rol === 'admin' ? 'Admin' : 'Cliente' }}
        </button>
      </form>
    </div>
  </div>
</template>
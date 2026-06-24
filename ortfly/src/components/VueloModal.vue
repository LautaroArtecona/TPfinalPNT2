<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: Boolean,
  editando: Boolean,
  vueloData: Object
})

const emit = defineEmits(['cerrar', 'guardar'])

// Clonamos reactivamente los datos que vienen del padre para poder editarlos localmente
const form = ref({
  origen: '',
  destino: '',
  fecha: '',
  hora: '',
  horaDestino: '',
  precio: 100,
  capacidad: 150,
  estado: 'Activo'
})

// Escuchamos si cambia el vuelo a editar para cargar sus datos en el formulario
watch(() => props.vueloData, (nuevoVuelo) => {
  if (nuevoVuelo) {
    form.value = { ...nuevoVuelo }
  } else {
    form.value = { origen: '', destino: '', fecha: '', hora: '', horaDestino: '', precio: 100, capacidad: 150, estado: 'Activo' }
  }
}, { immediate: true })

const manejarSubmit = () => {
  emit('guardar', form.value)
}
</script>

<template>
  <div v-if="mostrar" class="modal-overlay" @click.self="emit('cerrar')">
    <div class="modal-container modal-container-admin">
      <button class="modal-close" @click="emit('cerrar')">✕</button>
      <h2>{{ editando ? '📝 Modificar Vuelo' : '➕ Registrar Nuevo Vuelo' }}</h2>
      <p class="modal-subtitle">Completá la información del itinerario de viaje.</p>

      <form @submit.prevent="manejarSubmit" class="modal-form">
        <div class="admin-form-grid">
          <div class="form-group">
            <label>Origen</label>
            <input type="text" v-model="form.origen" required placeholder="Ej: Buenos Aires" />
          </div>
          <div class="form-group">
            <label>Destino</label>
            <input type="text" v-model="form.destino" required placeholder="Ej: Madrid" />
          </div>
          <div class="form-group">
            <label>Fecha</label>
            <input type="date" v-model="form.fecha" required />
          </div>
          <div class="form-group">
            <label>Hora Salida</label>
            <input type="time" v-model="form.hora" required />
          </div>
          <div class="form-group">
            <label>Hora Llegada (Destino)</label>
            <input type="time" v-model="form.horaDestino" required />
          </div>
          <div class="form-group">
            <label>Precio (USD)</label>
            <input type="number" v-model="form.precio" required min="1" />
          </div>
          <div class="form-group">
            <label>Capacidad Pasajeros</label>
            <input type="number" v-model="form.capacidad" required min="1" />
          </div>
        </div>

        <button type="submit" class="btn-submit">
          {{ editando ? 'Guardar Cambios' : 'Dar de Alta Vuelo' }}
        </button>
      </form>
    </div>
  </div>
</template>
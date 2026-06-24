<script setup>
import { ref, onMounted } from 'vue'
import { MOCKAPI_URL } from '../config/api'

// Estados reactivos de datos
const listaVuelos = ref([])
const cargando = ref(true)

// Estados para controlar el Modal del Formulario (Alta/Modificación)
const mostrarModalForm = ref(false)
const editando = ref(false)
const idVueloEditando = ref(null)

// Campos del formulario
const form = ref({
  origen: '',
  destino: '',
  fecha: '',
  hora: '',
  precio: 0,
  capacidad: 150,
  estado: 'Activo'
})

// OBTENER VUELOS 
const obtenerVuelos = async () => {
  try {
    cargando.value = true
    const respuesta = await fetch(`${MOCKAPI_URL}/vuelos`)
    if (!respuesta.ok) throw new Error('Error al traer vuelos')
    listaVuelos.value = await respuesta.json()
  } catch (error) {
    console.error(error)
  } finally {
    cargando.value = false
  }
}

// Abrir modal para Crear 
const abrirCrear = () => {
  editando.value = false
  idVueloEditando.value = null
  form.value = { 
    origen: '', 
    destino: '', 
    fecha: '', 
    hora: '', 
    horaDestino: '', // 👈 Agregamos esto
    precio: 100, 
    capacidad: 150, 
    estado: 'Activo' 
  }
  mostrarModalForm.value = true
}

// Abrir modal para Editar 
const abrirEditar = (vuelo) => {
  editando.value = true
  idVueloEditando.value = vuelo.id
  // Clonamos los datos actuales en el formulario
  form.value = { ...vuelo }
  mostrarModalForm.value = true
}

// GUARDAR DATOS (Alta con POST o Modificación con PUT)
const guardarVuelo = async () => {
  try {
    let url = `${MOCKAPI_URL}/vuelos`
    let metodo = 'POST'

    if (editando.value) {
      url = `${MOCKAPI_URL}/vuelos/${idVueloEditando.value}`
      metodo = 'PUT'
    }

    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })

    if (!respuesta.ok) throw new Error('Error al guardar el vuelo')
    
    mostrarModalForm.value = false
    obtenerVuelos() // Recargamos la lista en tiempo real
  } catch (error) {
    alert(error.message)
  }
}

// BAJA LÓGICA (Alternar entre Activo y Cancelado con PUT)
const cambiarEstadoVuelo = async (vuelo) => {
  try {
    const nuevoEstado = vuelo.estado === 'Activo' ? 'Cancelado' : 'Activo'
    
    const respuesta = await fetch(`${MOCKAPI_URL}/vuelos/${vuelo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    })

    if (!respuesta.ok) throw new Error('Error al actualizar el estado')
    obtenerVuelos() // Recarga la grilla
  } catch (error) {
    alert(error.message)
  }
}

onMounted(() => {
  obtenerVuelos()
})
</script>

<template>
  <div class="admin-container">
    
    <div class="admin-header-actions">
      <div>
        <h2>Panel de Control</h2>
        <p class="admin-subtitle">Gestión en tiempo real de itinerarios y métricas operativas.</p>
      </div>
      <button class="btn-create" @click="abrirCrear">➕ Crear Nuevo Vuelo</button>
    </div>

    <section class="metrics-grid">
      <div class="metric-card">
        <p class="metric-title">Ingresos Totales</p>
        <p class="metric-value">USD $245,500</p>
      </div>
      <div class="metric-card green">
        <p class="metric-title">Pasajes Vendidos</p>
        <p class="metric-value">342</p>
      </div>
      <div class="metric-card blue">
        <p class="metric-title">Capacidad Operativa</p>
        <p class="metric-value">78.4%</p>
      </div>
    </section>

    <section class="reports-layout">
      <div class="panel-box">
        <h3>Destinos Más Vendidos</h3>
        <div class="bar-chart-simulated">
          <div class="chart-row">
            <span class="chart-label">Madrid</span>
            <div class="chart-bar-container"><div class="chart-bar-fill" :style="{ width: '85%' }"></div></div>
            <strong>85%</strong>
          </div>
          <div class="chart-row">
            <span class="chart-label">Miami</span>
            <div class="chart-bar-container"><div class="chart-bar-fill" :style="{ width: '60%' }"></div></div>
            <strong>60%</strong>
          </div>
          <div class="chart-row">
            <span class="chart-label">Bariloche</span>
            <div class="chart-bar-container"><div class="chart-bar-fill" :style="{ width: '45%' }"></div></div>
            <strong>45%</strong>
          </div>
        </div>
      </div>
      <div class="panel-box">
        <h3>Información Operativa</h3>
        <p class="admin-sync-text">Sincronizado con MockAPI cloud de manera exitosa.</p>
      </div>
    </section>

    <section class="panel-box">
      <h3>Listado y Gestión de Vuelos (ABM)</h3>
      
      <div v-if="cargando" class="admin-loading">
        ⏳ Sincronizando base de datos...
      </div>

      <div v-else class="crud-table-container">
        <table class="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha/Hora</th>
              <th>Precio Base</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vuelo in listaVuelos" :key="vuelo.id">
              <td>#{{ vuelo.id }}</td>
              <td>{{ vuelo.origen }}</td>
              <td>{{ vuelo.destino }}</td>
              <td>{{ new Date(vuelo.fecha).toLocaleDateString() }} - {{ vuelo.hora }}</td>
              <td>USD ${{ vuelo.precio }}</td>
              <td>
                <span class="badge" :class="vuelo.estado === 'Activo' ? 'badge-activo' : 'badge-cancelado'">
                  {{ vuelo.estado }}
                </span>
              </td>
              <td>
                <button class="btn-action btn-edit" @click="abrirEditar(vuelo)">Editar</button>
                <button class="btn-action btn-delete" @click="cambiarEstadoVuelo(vuelo)">
                  {{ vuelo.estado === 'Activo' ? 'Cancelar' : 'Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div v-if="mostrarModalForm" class="modal-overlay" @click.self="mostrarModalForm = false">
      <div class="modal-container modal-container-admin">
        <button class="modal-close" @click="mostrarModalForm = false">✕</button>
        <h2>{{ editando ? '📝 Modificar Vuelo' : '➕ Registrar Nuevo Vuelo' }}</h2>
        <p class="modal-subtitle">Completá la información del itinerario de viaje.</p>

        <form @submit.prevent="guardarVuelo" class="modal-form">
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

  </div>
</template>
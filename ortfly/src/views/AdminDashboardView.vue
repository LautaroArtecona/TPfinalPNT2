<script setup>
import { ref, onMounted } from 'vue'
import { MOCKAPI_URL } from '../config/api'
import { useAuthStore } from '../stores/auth'
import VueloModal from '../components/VueloModal.vue'
import RegisterAdminModal from '../components/RegisterAdminModal.vue'

const authStore = useAuthStore()

// Estados reactivos de datos
const listaVuelos = ref([])
const cargando = ref(true)

// Estados para controlar el Modal del Formulario (Alta/Modificación)
const mostrarModalForm = ref(false)
const mostrarModalAdmin = ref(false)

// Estados auxiliares para el abm de vuelos
const editando = ref(false)
const vueloSeleccionado = ref(null)


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

// Abrir modal para Editar 
const abrirCrear = () => {
  editando.value = false
  vueloSeleccionado.value = null
  mostrarModalForm.value = true
}

const abrirEditar = (vuelo) => {
  editando.value = true
  vueloSeleccionado.value = vuelo
  mostrarModalForm.value = true
}


// GUARDAR O ACTUALIZAR VUELO (Recibe los datos desde el componente VueloModal)
const manejarGuardarVuelo = async (datosFormulario) => {
  try {
    let url = `${MOCKAPI_URL}/vuelos`
    let metodo = 'POST'

    if (editando.value) {
      url = `${MOCKAPI_URL}/vuelos/${vueloSeleccionado.value.id}`
      metodo = 'PUT'
    }

    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosFormulario)
    })

    if (!respuesta.ok) throw new Error('Error al guardar el vuelo')
    
    mostrarModalForm.value = false
    obtenerVuelos()
  } catch (error) {
    alert(error.message)
  }
}

// CAMBIAR ESTADO (Baja lógica)
const cambiarEstadoVuelo = async (vuelo) => {
  try {
    const nuevoEstado = vuelo.estado === 'Activo' ? 'Cancelado' : 'Activo'
    const respuesta = await fetch(`${MOCKAPI_URL}/vuelos/${vuelo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    })

    if (!respuesta.ok) throw new Error('Error al actualizar el estado')
    obtenerVuelos()
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
      <div class="admin-header-buttons-container">
        <button class="btn-create btn-register-admin" @click="mostrarModalAdmin = true">👤 Registrar Admin</button>
        <button class="btn-create" @click="abrirCrear">➕ Crear Nuevo Vuelo</button>
      </div>
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
        <div class="admin-profile-box">
          <p class="admin-profile-text">
            <strong>Administrador:</strong> {{ authStore.usuario?.nombre || 'Administrador Global' }}
          </p>
          <p class="admin-profile-subtext">
            <strong>Email:</strong> {{ authStore.usuario?.email || 'admin@ortfly.com' }}
          </p>
        </div>
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

    <VueloModal 
      :mostrar="mostrarModalForm"
      :editando="editando"
      :vueloData="vueloSeleccionado"
      @cerrar="mostrarModalForm = false"
      @guardar="manejarGuardarVuelo"
    />

    <RegisterAdminModal 
      :mostrar="mostrarModalAdmin"
      @cerrar="mostrarModalAdmin = false"
    />

  </div>
</template>
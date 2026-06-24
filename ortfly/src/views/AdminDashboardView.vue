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
  <!-- .container limita el ancho máximo en pantallas gigantes para que no se desparrame todo el diseño -->
  <div class="container py-4">
    
    <!-- CABECERA RESPONSIVA -->
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
      <div>
        <h2 class="fw-bold m-0 text-dark">Panel de Control</h2>
        <p class="text-muted m-0">Gestión en tiempo real de itinerarios y métricas operativas.</p>
      </div>
      <div class="d-flex flex-wrap gap-2">
        <button class="btn btn-secondary d-flex align-items-center gap-2 px-3" @click="mostrarModalAdmin = true">
          <span>👤</span> Registrar Admin
        </button>
        <button class="btn btn-primary d-flex align-items-center gap-2 px-3" @click="abrirCrear">
          <span>➕</span> Crear Nuevo Vuelo
        </button>
      </div>
    </div>

    <!-- TARJETAS MÉTRICAS (Uso de tarjetas nativas de Bootstrap para evitar deformaciones) -->
    <section class="row g-3 mb-4">
      <div class="col-12 col-md-4">
        <div class="card shadow-sm border-0 border-start border-4 border-primary h-100">
          <div class="card-body p-3">
            <p class="text-muted small fw-bold text-uppercase mb-1">Ingresos Totales</p>
            <p class="fs-3 fw-bold m-0 text-dark">USD $245,500</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card shadow-sm border-0 border-start border-4 border-success h-100">
          <div class="card-body p-3">
            <p class="text-muted small fw-bold text-uppercase mb-1">Pasajes Vendidos</p>
            <p class="fs-3 fw-bold m-0 text-success">342</p>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="card shadow-sm border-0 border-start border-4 border-info h-100">
          <div class="card-body p-3">
            <p class="text-muted small fw-bold text-uppercase mb-1">Capacidad Operativa</p>
            <p class="fs-3 fw-bold m-0 text-info">78.4%</p>
          </div>
        </div>
      </div>
    </section>

    <!-- GRÁFICOS E INFORMACIÓN OPERATIVA -->
    <section class="row g-3 mb-4">
      <!-- Destinos más vendidos -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body p-4">
            <h3 class="fs-5 fw-bold mb-4 text-dark">Destinos Más Vendidos</h3>
            <div class="d-flex flex-column gap-3">
              <!-- Madrid -->
              <div class="d-flex align-items-center">
                <span class="text-dark fw-medium" style="width: 90px; min-width: 90px;">Madrid</span>
                <div class="progress flex-grow-1 mx-3" style="height: 12px;">
                  <div class="progress-bar bg-primary rounded" role="progressbar" :style="{ width: '85%' }" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <strong class="text-dark" style="width: 45px; text-align: right;">85%</strong>
              </div>
              <!-- Miami -->
              <div class="d-flex align-items-center">
                <span class="text-dark fw-medium" style="width: 90px; min-width: 90px;">Miami</span>
                <div class="progress flex-grow-1 mx-3" style="height: 12px;">
                  <div class="progress-bar bg-primary rounded" role="progressbar" :style="{ width: '60%' }" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <strong class="text-dark" style="width: 45px; text-align: right;">60%</strong>
              </div>
              <!-- Bariloche -->
              <div class="d-flex align-items-center">
                <span class="text-dark fw-medium" style="width: 90px; min-width: 90px;">Bariloche</span>
                <div class="progress flex-grow-1 mx-3" style="height: 12px;">
                  <div class="progress-bar bg-primary rounded" role="progressbar" :style="{ width: '45%' }" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <strong class="text-dark" style="width: 45px; text-align: right;">45%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de Sesión del Administrador -->
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-body p-4 d-flex flex-column justify-content-between">
            <div>
              <h3 class="fs-5 fw-bold mb-3 text-dark">Información Operativa</h3>
              <div class="p-3 mb-3 bg-light rounded border">
                <p class="mb-2 text-dark fs-6">
                  <strong>Administrador:</strong> {{ authStore.usuario?.nombre || 'Administrador Global' }}
                </p>
                <p class="m-0 text-muted small">
                  <strong>Email:</strong> {{ authStore.usuario?.email || 'admin@ortfly.com' }}
                </p>
              </div>
            </div>
            <p class="text-success small m-0 d-flex align-items-center gap-2 pt-2">
              <span>🟢</span> Sincronizado con MockAPI cloud de manera exitosa.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- LISTADO ABM DE VUELOS -->
    <section class="card shadow-sm border-0">
      <div class="card-body p-4">
        <h3 class="fs-5 fw-bold mb-3 text-dark">Listado y Gestión de Vuelos (ABM)</h3>
        
        <div v-if="cargando" class="text-center py-5 text-muted">
          <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
          Sincronizando base de datos...
        </div>

        <div v-else class="table-responsive rounded border">
          <table class="table table-striped table-hover align-middle m-0">
            <thead class="table-dark">
              <tr>
                <th scope="col" class="ps-3">ID</th>
                <th scope="col">Origen</th>
                <th scope="col">Destino</th>
                <th scope="col">Fecha/Hora</th>
                <th scope="col">Precio Base</th>
                <th scope="col">Estado</th>
                <th scope="col" class="text-center pe-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vuelo in listaVuelos" :key="vuelo.id">
                <th scope="row" class="ps-3">#{{ vuelo.id }}</th>
                <td>{{ vuelo.origen }}</td>
                <td>{{ vuelo.destino }}</td>
                <td>{{ new Date(vuelo.fecha).toLocaleDateString() }} - {{ vuelo.hora }}</td>
                <td class="fw-semibold text-dark">USD ${{ vuelo.precio }}</td>
                <td>
                  <span class="badge rounded-pill px-3 py-2" :class="vuelo.estado === 'Activo' ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-danger-subtle text-danger border border-danger-subtle'">
                    {{ vuelo.estado }}
                  </span>
                </td>
                <td class="pe-3">
                  <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-outline-primary px-3" @click="abrirEditar(vuelo)">
                      Editar
                    </button>
                    <button class="btn btn-sm px-3" :class="vuelo.estado === 'Activo' ? 'btn-outline-danger' : 'btn-outline-success'" @click="cambiarEstadoVuelo(vuelo)">
                      {{ vuelo.estado === 'Activo' ? 'Cancelar' : 'Activar' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- COMPONENTES MODALES -->
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
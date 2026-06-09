<script setup>
import { ref } from 'vue'

// Vuelos mockeados para visualizar en la tabla del ABM
const listaVuelos = ref([
  { id: 1, origen: 'Buenos Aires (EZE)', destino: 'Madrid (MAD)', fecha: '2026-07-15', precio: 1200, asientos: 150, estado: 'Activo' },
  { id: 2, origen: 'Buenos Aires (AEP)', destino: 'Bariloche (BRC)', fecha: '2026-07-18', precio: 150, asientos: 98, estado: 'Activo' },
  { id: 3, origen: 'Buenos Aires (EZE)', destino: 'Miami (MIA)', fecha: '2026-07-20', precio: 950, asientos: 180, estado: 'Cancelado' }
])

const abrirModalCrear = () => {
  alert('Simulación: Aquí se abrirá un formulario para dar de Alta un nuevo vuelo en MockAPI.')
}

const editarVuelo = (id) => {
  alert(`Simulación: Modificar vuelo con ID: ${id}`)
}

const cambiarEstadoVuelo = (id) => {
  alert(`Simulación: Baja lógica del vuelo ID: ${id} (Cambiará su estado a Cancelado en MockAPI)`)
}
</script>

<template>
  <div class="admin-container">
    
    <div class="admin-header-actions">
      <div>
        <h2>Panel de Control (Administrador)</h2>
        <p style="color: #64748b;">Monitoreo general de ventas y gestión de la oferta de vuelos.</p>
      </div>
      <button class="btn-create" @click="abrirModalCrear">➕ Crear Nuevo Vuelo</button>
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
        <p class="metric-title">Vuelos Activos</p>
        <p class="metric-value">18 / 20</p>
      </div>
    </section>

    <section class="reports-layout">
      <div class="panel-box">
        <h3>Destinos Más Vendidos (Métricas)</h3>
        <div class="bar-chart-simulated">
          <div class="chart-row">
            <span class="chart-label">Madrid</span>
            <div class="chart-bar-container"><div class="chart-bar-fill" style="width: 85%;"></div></div>
            <span style="font-weight: bold;">85%</span>
          </div>
          <div class="chart-row">
            <span class="chart-label">Miami</span>
            <div class="chart-bar-container"><div class="chart-bar-fill" style="width: 60%;"></div></div>
            <span style="font-weight: bold;">60%</span>
          </div>
          <div class="chart-row">
            <span class="chart-label">Bariloche</span>
            <div class="chart-bar-container"><div class="chart-bar-fill" style="width: 45%;"></div></div>
            <span style="font-weight: bold;">45%</span>
          </div>
        </div>
      </div>

      <div class="panel-box">
        <h3>Ocupación</h3>
        <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 1rem;">Capacidad promedio de la flota actual.</p>
        <div style="text-align: center; margin: 1rem 0;">
          <span style="font-size: 2.5rem; font-weight: bold; color: #0ea5e9;">78.4%</span>
        </div>
      </div>
    </section>

    <section class="panel-box">
      <h3>Listado y Gestión de Vuelos (ABM)</h3>
      <div class="crud-table-container">
        <table class="crud-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Fecha</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vuelo in listaVuelos" :key="vuelo.id">
              <td>#{{ vuelo.id }}</td>
              <td>{{ vuelo.origen }}</td>
              <td>{{ vuelo.destino }}</td>
              <td>{{ vuelo.fecha }}</td>
              <td>USD ${{ vuelo.precio }}</td>
              <td>
                <span 
                  style="padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold;"
                  :style="vuelo.estado === 'Activo' ? 'background: #dcfce7; color: #166534;' : 'background: #fee2e2; color: #991b1b;'"
                >
                  {{ vuelo.estado }}
                </span>
              </td>
              <td>
                <button class="btn-action btn-edit" @click="editarVuelo(vuelo.id)">Editar</button>
                <button class="btn-action btn-delete" @click="cambiarEstadoVuelo(vuelo.id)">
                  {{ vuelo.estado === 'Activo' ? 'Cancelar' : 'Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>
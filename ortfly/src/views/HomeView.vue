<script setup>
import { ref, onMounted } from 'vue'
import { MOCKAPI_URL } from '../config/api' 

const vuelos = ref([])
const cargando = ref(true)

const obtenerVuelos = async () => {
  try {
    cargando.value = true
    // traemos la api y combino con el endpoint
    const respuesta = await fetch(`${MOCKAPI_URL}/vuelos`)

    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    const datos = await respuesta.json()
    
    vuelos.value = datos
  } catch (error) {
    console.error('Error cargando vuelos:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  obtenerVuelos()
})
</script>

<template>
  <div class="home-container">
    <section class="search-section">
      <h2>Busca tu próximo destino</h2>
      <div class="search-form">
        <div class="form-group">
          <label>Origen</label>
          <input type="text" placeholder="Ciudad de salida" value="Buenos Aires" />
        </div>
        <div class="form-group">
          <label>Destino</label>
          <input type="text" placeholder="¿A dónde vas?" />
        </div>
        <div class="form-group">
          <label>Fecha</label>
          <input type="date" />
        </div>
        <button class="btn-search">🔍 Buscar Vuelos</button>
      </div>
    </section>

    <section class="flights-section">
      <h3>Vuelos Disponibles</h3>
      
      <div v-if="cargando" style="text-align: center; padding: 2rem; color: #64748b;">
        ⏳ Cargando itinerarios en tiempo real...
      </div>

      <div v-else class="flights-grid">
        <div 
          v-for="vuelo in vuelos" 
          :key="vuelo.id" 
          class="flight-card"
          :class="{ 'sold-out': vuelo.estado === 'Cancelado' }"
        >
          <div class="flight-route">
            <div>
              <p class="time">{{ vuelo.hora }}</p>
              <p class="city">{{ vuelo.origen }}</p>
            </div>
            <div class="route-line">✈️</div>
            <div>
              <p class="time">{{vuelo.horaDestino}}</p>
              <p class="city">{{ vuelo.destino }}</p>
            </div>
          </div>
          
          <div class="flight-info">
            <p class="date">📅 {{ new Date(vuelo.fecha).toLocaleDateString() }}</p>
            <p class="price">USD ${{ vuelo.precio }}</p>
          </div>

          <button class="btn-book" :disabled="vuelo.estado === 'Cancelado'">
            {{ vuelo.estado === 'Activo' ? 'Seleccionar Vuelo' : 'Cancelado' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

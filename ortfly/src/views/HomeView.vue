<script setup>
import { ref } from 'vue'

// Datos mockeados solo para diseño visual
const vuelosEjemplo = ref([
  { id: 1, origen: 'Buenos Aires (EZE)', destino: 'Madrid (MAD)', fecha: '2026-07-15', hora: '13:45', precio: 1200, disponible: true },
  { id: 2, origen: 'Buenos Aires (AEP)', destino: 'Bariloche (BRC)', fecha: '2026-07-18', hora: '08:20', precio: 150, disponible: true },
  { id: 3, origen: 'Buenos Aires (EZE)', destino: 'Miami (MIA)', fecha: '2026-07-20', hora: '23:10', precio: 950, disponible: true },
  { id: 4, origen: 'Buenos Aires (EZE)', destino: 'Rio de Janeiro (GIG)', fecha: '2026-07-22', hora: '11:00', precio: 300, disponible: false }
])
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
      
      <div class="flights-grid">
        <div 
          v-for="vuelo in vuelosEjemplo" 
          :key="vuelo.id" 
          class="flight-card"
          :class="{ 'sold-out': !vuelo.disponible }"
        >
          <div class="flight-route">
            <div>
              <p class="time">{{ vuelo.hora }}</p>
              <p class="city">{{ vuelo.origen }}</p>
            </div>
            <div class="route-line">✈️</div>
            <div>
              <p class="time">--:--</p>
              <p class="city">{{ vuelo.destino }}</p>
            </div>
          </div>
          
          <div class="flight-info">
            <p class="date">📅 {{ vuelo.fecha }}</p>
            <p class="price">USD ${{ vuelo.precio }}</p>
          </div>

          <button class="btn-book" :disabled="!vuelo.disponible">
            {{ vuelo.disponible ? 'Seleccionar Vuelo' : 'Agotado' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

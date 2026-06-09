<script setup>
import { ref } from 'vue'

const seccionActual = ref('viajes') // 'viajes' o 'ia'
const filtroViajes = ref('activos') // 'activos' o 'pasados'

const misViajes = ref([
  { id: 101, destino: 'Madrid', fecha: '2026-07-15', estado: 'activo', asiento: '12F' },
  { id: 102, destino: 'Bariloche', fecha: '2026-01-10', estado: 'pasado', asiento: '04A' }
])

const mensajesChat = ref([
  { id: 1, text: "¡Hola! Soy tu asistente OrtFly IA. ¿A dónde te gustaría viajar hoy?", sender: 'ai' }
])

const nuevoMensaje = ref('')

const enviarMensaje = () => {
  if (!nuevoMensaje.value) return
  mensajesChat.value.push({ id: Date.now(), text: nuevoMensaje.value, sender: 'user' })
  nuevoMensaje.value = ''
  
  // Simulación de respuesta IA
  setTimeout(() => {
    mensajesChat.value.push({ 
      id: Date.now(), 
      text: "Entiendo. Analizando destinos según tu presupuesto y días disponibles...", 
      sender: 'ai' 
    })
  }, 1000)
}
</script>

<template>
  <div class="client-container">
    <aside class="sidebar">
      <h3>Mi Perfil</h3>
      <button 
        class="sidebar-btn" 
        :class="{ active: seccionActual === 'viajes' }"
        @click="seccionActual = 'viajes'"
      >
        ✈️ Mis Viajes
      </button>
      <button 
        class="sidebar-btn" 
        :class="{ active: seccionActual === 'ia' }"
        @click="seccionActual = 'ia'"
      >
        ✨ Asistente IA
      </button>
      <hr>
      <button class="sidebar-btn" style="color: #ef4444;">🚪 Cerrar Sesión</button>
    </aside>

    <section class="content-area">
      
      <div v-if="seccionActual === 'viajes'" class="trips-section">
        <h2>Gestión de Mis Pasajes</h2>
        
        <div class="trips-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: filtroViajes === 'activos' }"
            @click="filtroViajes = 'activos'"
          >
            Próximos Viajes
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: filtroViajes === 'pasados' }"
            @click="filtroViajes = 'pasados'"
          >
            Historial
          </button>
        </div>

        <div v-for="viaje in misViajes.filter(v => v.estado === filtroViajes)" :key="viaje.id" class="trip-card-client">
          <div>
            <p style="font-weight: bold; font-size: 1.1rem;">Destino: {{ viaje.destino }}</p>
            <p style="color: #64748b;">Fecha: {{ viaje.fecha }} | Asiento: {{ viaje.asiento }}</p>
          </div>
          <span class="status-badge" :class="viaje.estado === 'activo' ? 'status-active' : 'status-past'">
            {{ viaje.estado }}
          </span>
        </div>
      </div>

      <div v-if="seccionActual === 'ia'" class="ai-section">
        <h2>Asistente de Viajes Inteligente</h2>
        <p style="margin-bottom: 1rem; color: #64748b;">Pregúntame sobre destinos, horas de vuelo o presupuestos.</p>
        
        <div class="ai-container">
          <div class="chat-messages">
            <div v-for="msg in mensajesChat" :key="msg.id" class="message" :class="msg.sender">
              {{ msg.text }}
            </div>
          </div>
          <div class="chat-input-area">
            <input 
              v-model="nuevoMensaje" 
              type="text" 
              placeholder="Ej: Quiero viajar 5 días con 1000 USD..." 
              @keyup.enter="enviarMensaje"
            />
            <button class="btn-ai" @click="enviarMensaje">Enviar</button>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>
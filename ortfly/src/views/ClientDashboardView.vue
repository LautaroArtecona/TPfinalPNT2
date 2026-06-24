<script setup>
import { ref } from 'vue'
import { VECTORSHIFT_URL, VECTORSHIFT_KEY } from '../config/api'

const seccionActual = ref('viajes') 
const filtroViajes = ref('activos') 

const misViajes = ref([
  { id: 101, destino: 'Madrid', fecha: '2026-07-15', estado: 'activo', asiento: '12F' },
  { id: 102, destino: 'Bariloche', fecha: '2026-01-10', estado: 'pasado', asiento: '04A' }
])

const mensajesChat = ref([
  { id: 1, text: "¡Hola! Soy tu asistente OrtFly IA. ¿A dónde te gustaría viajar hoy?", sender: 'ai' }
])

const nuevoMensaje = ref('')
const cargandoIA = ref(false) // Estado para deshabilitar el botón mientras la IA piensa

const enviarMensaje = async () => {
  if (!nuevoMensaje.value.trim() || cargandoIA.value) return
  
  const textoUsuario = nuevoMensaje.value
  mensajesChat.value.push({ id: Date.now(), text: textoUsuario, sender: 'user' })
  nuevoMensaje.value = ''
  
  try {
    cargandoIA.value = true
    
    const respuesta = await fetch(VECTORSHIFT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VECTORSHIFT_KEY}`
      },
      body: JSON.stringify({
        inputs: {
          mensaje_usuario: textoUsuario
        }
      })
    })

    if (!respuesta.ok) throw new Error('Error al conectar con la IA')
    
    const resultado = await respuesta.json()
    console.log('Respuesta cruda de VectorShift:', resultado) 

    const respuestaTexto = resultado.outputs?.respuesta_ia || resultado.respuesta_ia || "Disculpa, no pude procesar tu solicitud.";

    mensajesChat.value.push({ id: Date.now(), text: respuestaTexto, sender: 'ai' })

  } catch (error) {
    console.error(error)
    mensajesChat.value.push({ 
      id: Date.now(), 
      text: "⚠️ Ocurrió un error al conectar con el servicio de IA. Por favor, intenta de nuevo.", 
      sender: 'ai' 
    })
  } finally {
    cargandoIA.value = false
  }
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
              :placeholder="cargandoIA ? 'OrtFly IA está pensando...' : 'Ej: Quiero viajar 5 días con 1000 USD...'" 
              :disabled="cargandoIA"
              @keyup.enter="enviarMensaje"
            />
            <button class="btn-ai" :disabled="cargandoIA" @click="enviarMensaje">
              {{ cargandoIA ? '...' : 'Enviar' }}
            </button>
          </div>
        </div>
      </div>

    </section>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { VECTORSHIFT_URL, VECTORSHIFT_KEY } from '../config/api'

const router = useRouter()
const authStore = useAuthStore()

// Secciones de la navegación lateral
const seccionActual = ref('viajes') 
const filtroViajes = ref('activos') 

// Datos Ficticios bien presentados para rellenar las pestañas
const misViajes = ref([
  { id: 101, destino: 'Madrid (MAD)', fecha: '15/07/2026', estado: 'activos', asiento: '12F', hora: '13:40', boarding: '12:55' },
  { id: 102, destino: 'Miami (MIA)', fecha: '28/08/2026', estado: 'activos', asiento: '08C', hora: '22:30', boarding: '21:45' },
  { id: 103, destino: 'Bariloche (BRC)', fecha: '10/01/2026', estado: 'pasados', asiento: '04A', hora: '08:15', boarding: 'Finalizado' },
  { id: 104, destino: 'Mendoza (MDZ)', fecha: '05/04/2026', estado: 'pasados', asiento: '19D', hora: '11:05', boarding: 'Finalizado' }
])

// Funcionalidad de Salida Segura
const manejarLogout = () => {
  authStore.logout()
  router.push('/') 
}

// Lógica del Chat con el Asistente IA
const mensajesChat = ref([
  { id: 1, text: "¡Hola! Soy tu asistente OrtFly IA. ¿A dónde te gustaría viajar hoy?", sender: 'ai' }
])
const nuevoMensaje = ref('')
const cargandoIA = ref(false)

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
    const respuestaTexto = resultado.outputs?.respuesta_ia || resultado.respuesta_ia || "Disculpa, no pude procesar tu solicitud."

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
    <!-- Menú Lateral Dinámico -->
    <aside class="sidebar">
      <div class="user-profile-summary">
        <h3>Mi Perfil</h3>
        <!-- Consumimos de forma reactiva los datos del store de Pinia -->
        <p class="user-name">👤 {{ authStore.usuario?.nombre || 'Pasajero OrtFly' }}</p>
        <p class="user-email">✉️ {{ authStore.usuario?.email || 'sin-correo@ort.edu.ar' }}</p>
      </div>
      
      <hr class="sidebar-divider" />

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
      
      <hr class="sidebar-divider" />
      
      <button class="sidebar-btn btn-logout" @click="manejarLogout">
        🚪 Cerrar Sesión
      </button>
    </aside>


    <section class="content-area">
      
      <!-- SECCIÓN: MIS PASAJES -->
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
            Historial de Viajes
          </button>
        </div>

        <!-- Renderizado de las tarjetas simuladas filtradas -->
        <div class="trips-list-container">
          <div 
            v-for="viaje in misViajes.filter(v => v.estado === filtroViajes)" 
            :key="viaje.id" 
            class="trip-card-client"
          >
            <div class="trip-info">
              <p class="trip-destination">Destino: {{ viaje.destino }}</p>
              <p class="trip-details">
                Fecha: {{ viaje.fecha }} | Horario: {{ viaje.hora }} hs | Asiento: <strong>{{ viaje.asiento }}</strong>
              </p>
            </div>
            <span class="status-badge" :class="viaje.estado === 'activos' ? 'status-active' : 'status-past'">
              {{ viaje.estado === 'activos' ? `Embarque ${viaje.boarding}` : 'Finalizado' }}
            </span>
          </div>
          
          <!-- Estado en caso de que un filtro quede vacío -->
          <div v-if="misViajes.filter(v => v.estado === filtroViajes).length === 0" class="empty-trips">
            No tienes itinerarios registrados en este apartado.
          </div>
        </div>
      </div>

      <!-- SECCIÓN: ASISTENTE INTELIGENTE -->
      <div v-if="seccionActual === 'ia'" class="ai-section">
        <h2>Asistente de Viajes Inteligente</h2>
        <p class="ai-subtitle">Pregúntame sobre destinos, horas de vuelo o presupuestos.</p>
        
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
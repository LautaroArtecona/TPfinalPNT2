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
  <div class="container py-4">
    
    <div class="row g-4 align-items-start">
      
      <aside class="col-12 col-md-4 col-lg-3">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 d-flex flex-column justify-content-between h-100">
            <div>
              <h3 class="fs-5 fw-bold mb-3 text-dark border-bottom pb-2">Mi Perfil</h3>
              
              <div class="mb-4">
                <div class="d-flex align-items-center gap-2 mb-2 text-dark fs-6">
                  <span>👤</span>
                  <span class="fw-semibold text-break">{{ authStore.usuario?.nombre || 'Pasajero OrtFly' }}</span>
                </div>
                <div class="d-flex align-items-center gap-2 text-muted small text-break">
                  <span>✉️</span>
                  <span>{{ authStore.usuario?.email || 'sin-correo@ort.edu.ar' }}</span>
                </div>
              </div>

              <div class="d-flex flex-column gap-2 mb-4">
                <button 
                  class="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 fw-medium transition" 
                  :class="seccionActual === 'viajes' ? 'btn-primary' : 'btn-light text-secondary'"
                  @click="seccionActual = 'viajes'"
                >
                  <span>✈️</span> Mis Viajes
                </button>
                <button 
                  class="btn w-100 text-start d-flex align-items-center gap-2 px-3 py-2 fw-medium transition" 
                  :class="seccionActual === 'ia' ? 'btn-primary' : 'btn-light text-secondary'"
                  @click="seccionActual = 'ia'"
                >
                  <span>✨</span> Asistente IA
                </button>
                <button 
                  class="btn btn-light text-secondary w-100 text-start d-flex align-items-center gap-2 px-3 py-2 fw-medium transition"
                  @click="router.push('/')"
                >
                  <span>🔍</span> Ver Vuelos
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main class="col-12 col-md-8 col-lg-9">
        <div class="card shadow-sm border-0 p-4">
          
          <div v-if="seccionActual === 'viajes'">
            <h2 class="fs-4 fw-bold text-dark mb-3">Gestión de Mis Pasajes</h2>
            
            <div class="mb-4">
              <ul class="nav nav-tabs border-bottom-0">
                <li class="nav-item">
                  <button 
                    class="nav-link border-0 px-3 pb-2 transition" 
                    :class="filtroViajes === 'activos' ? 'active fw-bold border-bottom border-3 border-primary text-primary' : 'text-muted'"
                    style="background: none;"
                    @click="filtroViajes = 'activos'"
                  >
                    Próximos Viajes
                  </button>
                </li>
                <li class="nav-item">
                  <button 
                    class="nav-link border-0 px-3 pb-2 transition" 
                    :class="filtroViajes === 'pasados' ? 'active fw-bold border-bottom border-3 border-primary text-primary' : 'text-muted'"
                    style="background: none;"
                    @click="filtroViajes = 'pasados'"
                  >
                    Historial de Viajes
                  </button>
                </li>
              </ul>
              <div class="border-bottom w-100" style="margin-top: -1px;"></div>
            </div>

            <div class="row row-cols-1 row-cols-lg-2 g-3">
              <div 
                v-for="viaje in misViajes.filter(v => v.estado === filtroViajes)" 
                :key="viaje.id" 
                class="col"
              >
                <div class="card h-100 border rounded p-3 bg-white shadow-none hover-shadow transition">
                  <div class="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <div>
                      <span class="text-muted small d-block fw-bold text-uppercase" style="font-size: 0.75rem;">Destino:</span>
                      <h4 class="fs-5 fw-bold text-dark m-0">{{ viaje.destino }}</h4>
                    </div>
                    <span 
                      class="badge rounded px-2 py-1 small border" 
                      :class="viaje.estado === 'activos' ? 'bg-success-subtle text-success border-success-subtle' : 'bg-secondary-subtle text-secondary border-secondary-subtle'"
                    >
                      {{ viaje.estado === 'activos' ? `Embarque ${viaje.boarding}` : 'Finalizado' }}
                    </span>
                  </div>
                  
                  <div class="text-muted small pt-2 border-top mt-2">
                    <p class="mb-1"><strong>Fecha:</strong> {{ viaje.fecha }}</p>
                    <p class="mb-1"><strong>Horario:</strong> {{ viaje.hora }} hs</p>
                    <p class="m-0"><strong>Asiento:</strong> <span class="text-dark fw-bold">{{ viaje.asiento }}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="misViajes.filter(v => v.estado === filtroViajes).length === 0" class="alert alert-light text-center py-4 border text-muted mt-3">
              <span>📂</span> No tienes itinerarios registrados en este apartado.
            </div>
          </div>

          <div v-if="seccionActual === 'ia'" class="d-flex flex-column">
            <div class="mb-3">
              <h2 class="fs-4 fw-bold text-dark m-0">Asistente de Viajes Inteligente</h2>
              <p class="text-muted small m-0">Pregúntame sobre destinos, horas de vuelo o presupuestos.</p>
            </div>
            
            <div class="card border bg-light flex-grow-1 d-flex flex-column" style="min-height: 350px;">
              <div class="card-body overflow-auto p-3 d-flex flex-column gap-3" style="height: 350px;">
  
            <div 
              v-for="msg in mensajesChat" 
              :key="msg.id" 
              class="p-2 rounded shadow-sm mw-75"
              :class="msg.sender === 'user' ? 'bg-primary text-white align-self-end' : 'bg-white text-dark border align-self-start'"
              style="width: fit-content;"
            >
              <span class="d-block text-break">{{ msg.text }}</span>
            </div>

          </div>
              
              <div class="card-footer bg-white border-top p-2">
                <div class="input-group">
                  <input 
                    v-model="nuevoMensaje" 
                    type="text" 
                    class="form-control"
                    :placeholder="cargandoIA ? 'OrtFly IA está pensando...' : 'Ej: Quiero viajar 5 días con 1000 USD...'" 
                    :disabled="cargandoIA"
                    @keyup.enter="enviarMensaje"
                  />
                  <button class="btn btn-primary px-4" :disabled="cargandoIA" @click="enviarMensaje">
                    {{ cargandoIA ? '...' : 'Enviar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  </div>
</template>
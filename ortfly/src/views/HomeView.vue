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
  <div class="w-100 m-0 p-0">

    <section id="carruselDestinos" class="carousel slide shadow-sm w-100 m-0" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carruselDestinos" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carruselDestinos" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carruselDestinos" data-bs-slide-to="2" aria-label="Slide 3"></button>
      </div>
      
      <div class="carousel-inner w-100">
        <div class="carousel-item active" data-bs-interval="4000">
          <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop" class="d-block w-100 object-fit-cover header-carousel-img" alt="Caribe">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
            <h5 class="fw-bold fs-3 text-white">¡Descubrí el Caribe!</h5>
            <p class="m-0 text-white-50">Playas paradisíacas y aguas cristalinas te esperan.</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="4000">
          <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1920&auto=format&fit=crop" class="d-block w-100 object-fit-cover header-carousel-img" alt="Costa Italiana">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
            <h5 class="fw-bold fs-3 text-white">Costa Amalfitana</h5>
            <p class="m-0 text-white-50">Cultura, historia y paisajes inolvidables en el Mediterráneo.</p>
          </div>
        </div>
        <div class="carousel-item" data-bs-interval="4000">
          <img src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop" class="d-block w-100 object-fit-cover header-carousel-img" alt="Maldivas">
          <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-3">
            <h5 class="fw-bold fs-3 text-white">Isla Maldivas</h5>
            <p class="m-0 text-white-50">El descanso de lujo que te merecés al mejor precio.</p>
          </div>
        </div>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#carruselDestinos" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carruselDestinos" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </section>

    <div class="px-3 px-md-5 py-4">

      <section class="card shadow-sm p-4 border-0 bg-white mb-5">
        <h3 class="fs-5 fw-bold mb-3 text-dark">Busca tu próximo destino</h3>
        <form class="row g-3 align-items-end">
          <div class="col-12 col-md-4">
            <label class="form-label text-muted small fw-medium m-1">Origen</label>
            <input type="text" class="form-control" value="Buenos Aires" disabled />
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label text-muted small fw-medium m-1">Destino</label>
            <input type="text" class="form-control" placeholder="¿A dónde vas?" />
          </div>
          <div class="col-12 col-md-4">
            <label class="form-label text-muted small fw-medium m-1">Fecha</label>
            <input type="date" class="form-control" />
          </div>
          <div class="col-12">
            <button type="submit" class="btn btn-dark w-100 py-2 fw-medium">🔍 Buscar Vuelos</button>
          </div>
        </form>
      </section>

      <section class="mb-4">
        <h2 class="fs-4 fw-bold text-dark mb-4">Vuelos Disponibles</h2>
        
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4 g-4">
          
          <div v-for="vuelo in vuelos" :key="vuelo.id" class="col">
            <div class="card h-100 border-0 shadow-sm overflow-hidden transition-hover">
              
              <div class="position-relative">
                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop" class="card-img-top object-fit-cover" style="height: 160px;" alt="Destino Itinerario">
                <span class="position-absolute top-3 end-3 badge rounded-pill px-3 py-2" :class="vuelo.estado === 'Activo' ? 'bg-success text-white' : 'bg-secondary text-white'">
                  {{ vuelo.estado }}
                </span>
              </div>

              <div class="card-body p-4 d-flex flex-column justify-content-between">
                <div>
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="text-start">
                      <span class="fs-4 fw-bold text-dark d-block">{{ vuelo.hora }}</span>
                      <small class="text-muted text-break">{{ vuelo.origen }}</small>
                    </div>
                    <div class="text-muted fs-5">✈️</div>
                    <div class="text-end">
                      <span class="fs-4 fw-bold text-dark d-block">{{ vuelo.horaDestino || '00:00' }}</span>
                      <small class="text-muted text-break">{{ vuelo.destino }}</small>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center pt-3 border-top mb-4">
                    <div class="d-flex align-items-center gap-1 text-muted small">
                      <span>📅</span>
                      <span>{{ new Date(vuelo.fecha).toLocaleDateString() }}</span>
                    </div>
                    <span class="fs-5 fw-bold text-primary">USD ${{ vuelo.precio }}</span>
                  </div>
                </div>

                <button class="btn btn-primary w-100 py-2 fw-medium" :disabled="vuelo.estado !== 'Activo'">
                  {{ vuelo.estado === 'Activo' ? 'Seleccionar Vuelo' : 'Cancelado' }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  </div>
  <footer class="bg-dark text-white pt-5 pb-3 mt-5 border-top border-secondary w-100 position-relative" style="margin-left: calc(-1 * px-3); margin-right: calc(-1 * px-3);">
      <div class="container-fluid px-4 px-md-5">
        <div class="row g-4">
          
          <div class="col-12 col-md-4">
            <h5 class="fw-bold text-primary mb-3">OrtFly</h5>
            <p class="text-muted small mb-3 text-balance">
              Tu agencia de vuelos de confianza. Conectamos destinos globales con el mejor precio garantizado y soporte inteligente las 24 horas.
            </p>
            <div class="d-flex gap-3 fs-5">
              <a href="#" class="text-white-50 text-decoration-none transition-hover-link">🌐</a>
              <a href="#" class="text-white-50 text-decoration-none transition-hover-link">📸</a>
              <a href="#" class="text-white-50 text-decoration-none transition-hover-link">🐦</a>
              <a href="#" class="text-white-50 text-decoration-none transition-hover-link">💼</a>
            </div>
          </div>

          <div class="col-12 col-sm-6 col-md-2">
            <h6 class="fw-bold text-white mb-3">Compañía</h6>
            <ul class="list-unstyled d-flex flex-column gap-2 small">
              <li><a href="#" class="text-white-50 text-decoration-none transition-hover-link">Sobre Nosotros</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none transition-hover-link">Destinos Populares</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none transition-hover-link">Blog de Viajes</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none transition-hover-link">Prensa</a></li>
            </ul>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <h6 class="fw-bold text-white mb-3">Soporte Legal</h6>
            <ul class="list-unstyled d-flex flex-column gap-2 small">
              <li><a href="#" class="text-white-50 text-decoration-none transition-hover-link">Centro de Ayuda / FAQ</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none transition-hover-link">Términos y Condiciones</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none transition-hover-link">Políticas de Privacidad</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none transition-hover-link">Derechos del Pasajero</a></li>
            </ul>
          </div>

          <div class="col-12 col-md-3">
            <h6 class="fw-bold text-white mb-3">Contacto Oficial</h6>
            <ul class="list-unstyled d-flex flex-column gap-2 small text-white-50">
              <li class="d-flex align-items-center gap-2">
                <span>📍</span> Av. Yatay 240, Almagro, CABA
              </li>
              <li class="d-flex align-items-center gap-2">
                <span>📞</span> +54 (11) 4981-5555
              </li>
              <li class="d-flex align-items-center gap-2">
                <span>✉️</span> soporte@ortfly.com.ar
              </li>
              <li class="d-flex align-items-center gap-2">
                <span>⏰</span> Lun a Dom — 24 hs Activo
              </li>
            </ul>
          </div>

        </div>

        <div class="border-top border-secondary mt-4 pt-3 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <p class="text-muted small m-0">
            &copy; 2026 OrtFly S.A. Todos los derechos reservados.
          </p>
          <p class="text-muted small m-0">
            Desarrollado para <span class="text-white-50 fw-semibold">ORT Argentina</span>
          </p>
        </div>
      </div>
    </footer>
</template>
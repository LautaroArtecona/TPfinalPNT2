<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'

const router = useRouter()
const menuAbierto = ref(false)
const tieneScroll = ref(false)

// Función que analiza la posición del scroll
const manejarScroll = () => {
  // Si el usuario bajó más de 75 píxeles, activamos la transparencia
  if (window.scrollY > 75) {
    tieneScroll.value = true
  } else {
    tieneScroll.value = false
  }
}

// Escuchamos el scroll
onMounted(() => {
  window.addEventListener('scroll', manejarScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', manejarScroll)
})

// Estados para controlar el modal
const modalAbierto = ref(false)
const modalRegisterAbierto = ref(false)
const rolSeleccionado = ref('cliente')

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}

// Abre el modal configurando el rol correspondiente
const abrirLogin = (rol) => {
  menuAbierto.value = false
  rolSeleccionado.value = rol
  modalRegisterAbierto.value = false
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
}

const manejarLoginExitoso = (rol) => {
  modalAbierto.value = false
  if (rol === 'admin') {
    router.push('/admin')
  } else {
    router.push('/cliente')
  }
}

const saltarARegistro = () => {
  modalAbierto.value = false
  modalRegisterAbierto.value = true
}

const saltarALogin = () => {
  modalRegisterAbierto.value = false
  modalAbierto.value = true
}
</script>

<template>
  <header class="header" :class="{ 'header-scrolled': tieneScroll }">
    <div class="logo" @click="router.push('/')">
       <span class="brand">OrtFly</span>
    </div>
    
    <div class="nav-container">
      <button class="btn-login" @click="toggleMenu">
        Iniciar Sesión ▾
      </button>
      
      <div v-if="menuAbierto" class="dropdown-menu">
        <button @click="abrirLogin('cliente')">🔑 Entrar como Cliente</button>
        <button @click="abrirLogin('admin')">🛠️ Entrar como Admin</button>
      </div>
    </div>
  </header>

  <main class="w-100 p-0 m-0" style="padding-top: 75px !important;">
    <RouterView />
  </main>

  <LoginModal 
    :mostrar="modalAbierto" 
    :rol="rolSeleccionado" 
    @cerrar="cerrarModal" 
    @loginExitoso="manejarLoginExitoso"
    @irARegistro="saltarARegistro"
  />
  <RegisterModal 
    :mostrar="modalRegisterAbierto" 
    @cerrar="modalRegisterAbierto = false" 
    @irALogin="saltarALogin"
  />
</template>
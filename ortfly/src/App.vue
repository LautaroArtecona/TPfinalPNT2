<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuAbierto = ref(false)

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}

const simularLogin = (rol) => {
  menuAbierto.value = false
  if (rol === 'admin') {
    // Cambiar las rutas segun corresponda
    router.push('/') 
    alert('Simulación: Logueado como Administrador')
  } else {
    router.push('/')
    alert('Simulación: Logueado como Cliente')
  }
}
</script>

<template>
  <header class="header">
    <div class="logo" @click="router.push('/')">
      ✈️ <span class="brand">OrtFly</span>
    </div>
    
    <div class="nav-container">
      <button class="btn-login" @click="toggleMenu">
        Iniciar Sesión ▾
      </button>
      
      <div v-if="menuAbierto" class="dropdown-menu">
        <button @click="simularLogin('cliente')">🔑 Entrar como Cliente</button>
        <button @click="simularLogin('admin')">🛠️ Entrar como Admin</button>
      </div>
    </div>
  </header>

  <main class="main-content">
    <RouterView />
  </main>
</template>
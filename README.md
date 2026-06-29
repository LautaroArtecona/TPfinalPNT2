# ✈️ OrtFly - Sistema de Gestión y Reserva de Vuelos

Este proyecto es una aplicación web moderna y completamente responsiva desarrollada como trabajo final para la la materia Practicas en Nuevas Tecnologias 2, de la carrera de **Analista de Sistemas en ORT Argentina**. La plataforma simula el funcionamiento real de una agencia de vuelos, integrando un flujo completo para el usuario final (pasajero) y un panel de control avanzado para la administración operativa.

---

## 🚀 Características Principales

### 🌐 Interfaz Pública y Experiencia de Usuario (UX/UI)
*   **Buscador Inteligente de Vuelos:** Filtrado dinámico por origen, destino y fecha, alimentado en tiempo real sin inputs de texto libre (utiliza selectores adaptativos basados en datos reales).
*   **Diseño Responsivo:** Entre otros elementos de la aplicacion, se implementa un carrusel imponente de punta a punta optimizado con Bootstrap 5 para una visualización fluida desde celulares hasta monitores de escritorio de gran resolución, la gestion ABM de vuelos puede ser utilizada tanto desde celulares como desde computadoras.
*   **Menu centralizado:** Barra de navegación fija (*Sticky Header*) con efecto de vidrio esmerilado (*Glassmorphism*) que se vuelve semi-transparente de forma automática al hacer scroll.
*   **Experiencia de Usuario Fluida:** Botón dinámico de acceso rápido al perfil del cliente que se oculta inteligentemente dentro de su propio panel para evitar redundancias de navegación.

### 👤 Panel de Clientes (Dashboard)
*   **Gestión de Pasajes:** Vista interactiva de próximos viajes y acceso al historial completo de vuelos del usuario.
*   **Asistente IA Integrado:** Espacio dedicado para la asistencia inteligente al viajero (recomendacion de viajes segun destinos, orgien o presupuesto).
*   **Perfil Corporativo:** Información del pasajero totalmente sincronizada.

### 🛠️ Panel de Control de Administración (ABM)
*   **Métricas Operativas en Tiempo Real:** Dashboard centralizado que renderiza ingresos totales, pasajes vendidos, capacidad operativa de la flota y barras de progreso con los destinos más vendidos.
*   **Gestión Integral de Vuelos (ABM):** Listado y control total sobre la creación, modificación y estado (Activo/Cancelado) de los itinerarios disponibles.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend Framework:** Vue 3 
*   **Manejo de Estado Global:** Pinia (Autenticación persistente con almacenamiento local)
*   **Enrutamiento:** Vue Router
*   **Estilos y Maquetación:** Bootstrap 5, CSS3 Avanzado (Filtros, Flexbox y Grid)
*   **Persistencia de Datos:** MockAPI Cloud Integration (Simulación de base de datos e itinerarios en la nube)

---

## 📁 Estructura del Proyecto

```text
src/
├── components/          # Componentes reutilizables (Modales, Tarjetas, etc.)
├── config/              # Configuración centralizada de las APIs internas
├── stores/              # Estados globales de Pinia (auth.js)
├── views/               # Vistas principales (Home, Admin, Cliente)
├── App.vue              # Componente raíz y Layout base de la aplicación
└── main.js              # Inicialización y arranque del entorno Vue
```

---


## ⚙️ Instalación y Configuración

### Clonar el repositorio:

```sh
git clone [https://github.com/LautaroArtecona/proyecto-git.git](https://github.com/LautaroArtecona/TPfinalPNT2.git)
```

### Ingresar al directorio del proyecto:

```sh
cd ortfly
```

### Instalar las dependencias necesarias:

```sh
npm install
```

### Configurar las variables de entorno:

```sh
export const MOCKAPI_URL = 'TU_URL_DE_MOCKAPI'
```

### Iniciar el servidor de desarrollo local:

```sh
npm run dev
```

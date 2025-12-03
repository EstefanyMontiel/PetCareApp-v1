# 🐾 PetCare App

<div align="center">


**Aplicación móvil completa para el cuidado y seguimiento de mascotas**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Arquitectura](#-arquitectura) • [Tecnologías](#-tecnologías)

</div>

---

## 📋 Descripción

**PetCare App** es una aplicación móvil desarrollada en React Native que permite a los dueños de mascotas gestionar de manera integral la información de salud y cuidado de sus compañeros peludos. La app proporciona un sistema completo de registro, seguimiento y recordatorios para mantener actualizados todos los aspectos del cuidado veterinario.

## ✨ Características

### 🏠 Gestión de Mascotas
- **Registro de mascotas** con información completa (nombre, especie, raza, fecha de nacimiento, género)
- **Perfil personalizado** para cada mascota con foto
- **Cálculo automático de edad** basado en fecha de nacimiento
- **Edición de información** de mascotas existentes
- **Archivado de mascotas** para mantener un historial organizado
- **Cambio de foto de perfil** desde cámara o galería

### 💉 Seguimiento de Vacunación
- **Registro de vacunas** aplicadas con fecha y descripción
- **Vacunas específicas por especie** (perros y gatos)
- **Historial completo** de vacunaciones
- **Fecha de aplicación** y detalles del veterinario
- **Recordatorios** para próximas dosis

### 🐛 Control de Desparasitación
- **Registro de desparasitaciones** internas y externas
- **Productos específicos** para cada tipo de tratamiento
- **Fecha de aplicación** y próxima dosis
- **Historial detallado** de tratamientos antiparasitarios
- **Notas adicionales** para cada aplicación

### 🏥 Exámenes Anuales
- **Registro de chequeos médicos** anuales completos
- **Datos vitales**: peso, temperatura, frecuencia cardíaca
- **Información del veterinario** y clínica
- **Resultados de exámenes** y diagnósticos
- **Recomendaciones médicas** y observaciones
- **Próxima cita** programada

### 🌍 Funcionalidades Adicionales
- **Multiidioma**: Soporte para Español e Inglés
- **Autenticación segura** con Firebase Authentication
- **Notificaciones push** para recordatorios importantes
- **Mapas integrados** para localizar veterinarias
- **Interfaz moderna y amigable** con diseño Material
- **Modo offline** con sincronización automática

## 🛠️ Tecnologías

### Core
- **React Native** 0.81.4 - Framework de desarrollo móvil
- **Expo** ~54.0 - Plataforma de desarrollo y despliegue
- **React** 19.1.0 - Librería de UI

### Backend & Database
- **Firebase** 9. 23.0
  - Authentication (autenticación de usuarios)
  - Firestore (base de datos NoSQL)
  - Storage (almacenamiento de imágenes)
  - Cloud Messaging (notificaciones push)

### Navegación
- **@react-navigation/native** 7.1.18
- **@react-navigation/native-stack** 7.3. 27
- **@react-navigation/bottom-tabs** 7.4. 9

### UI/UX
- **@expo/vector-icons** 15. 0.2 - Iconografía
- **expo-linear-gradient** 15.0. 7 - Gradientes
- **react-native-modal** 14.0.0 - Modales personalizados
- **react-native-calendars** 1.1313. 0 - Calendario interactivo
- **@react-native-picker/picker** 2.11.4 - Selectores nativos

### Funcionalidades Nativas
- **expo-image-picker** 17. 0.8 - Selección de imágenes
- **expo-location** 19.0.7 - Geolocalización
- **expo-notifications** 0.32.12 - Notificaciones push
- **react-native-maps** 1.20.1 - Mapas nativos
- **@react-native-community/datetimepicker** 8.4.5 - Selectores de fecha

### Estado y Formularios
- **react-hook-form** 7.64.0 - Gestión de formularios
- **@react-native-async-storage/async-storage** 2.2.0 - Almacenamiento local
- **axios** 1.13.2 - Cliente HTTP

## 📁 Arquitectura del Proyecto

```
PetCareApp-v1/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── common/         # Componentes comunes
│   │   └── pets/           # Componentes específicos de mascotas
│   ├── config/             # Configuración (Firebase, etc.)
│   ├── context/            # Context API (Auth, Language)
│   ├── hooks/              # Custom Hooks
│   ├── locales/            # Archivos de internacionalización
│   ├── navigation/         # Configuración de navegación
│   ├── services/           # Servicios y API calls
│   │   ├── vaccionationService.js
│   │   ├── dewormingService.js
│   │   ├── annualExamService.js
│   │   └── petServices.js
│   ├── styles/             # Estilos globales y por componente
│   └── utils/              # Utilidades y helpers
├── assets/                 # Imágenes y recursos estáticos
├── App.js                  # Componente principal
├── app.json                # Configuración de Expo
├── firestore.rules         # Reglas de seguridad de Firestore
└── package.json            # Dependencias del proyecto
```

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 16.x
- **npm** o **yarn**
- **Expo CLI** instalado globalmente
- Cuenta de **Firebase** configurada
- **Android Studio** (para Android) o **Xcode** (para iOS)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github. com/EstefanyMontiel/PetCareApp-v1.git
cd PetCareApp-v1
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilitar Authentication, Firestore Database y Storage
   - Descargar el archivo de configuración
   - Crear `src/config/firebase.js` con tus credenciales:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

4. **Configurar variables de entorno** (opcional)
```bash
cp .env.example .env
```

5. **Iniciar la aplicación**
```bash
npm start
# o
yarn start
```

6. **Ejecutar en dispositivo/emulador**
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 Uso

### Primer Uso

1. **Registro/Inicio de sesión**: Crea una cuenta o inicia sesión con credenciales existentes
2. **Agregar mascota**: Completa el formulario con la información de tu mascota
3.  **Subir foto**: Toma una foto o selecciona una de la galería
4. **Registrar información médica**: Comienza a registrar vacunas, desparasitaciones y exámenes

### Funcionalidades Principales

#### Registrar una Vacuna
```
Home → Seleccionar Mascota → Vacunación → Agregar Registro
```

#### Registrar Desparasitación
```
Home → Seleccionar Mascota → Desparasitación → Agregar Registro
```

#### Registrar Examen Anual
```
Home → Seleccionar Mascota → Examen Anual → Agregar Registro
```

#### Editar Información de Mascota
```
Home → Opciones de Mascota → Editar Información
```

## 🔒 Seguridad

### Reglas de Firestore

El proyecto incluye reglas de seguridad de Firestore (`firestore.rules`) que garantizan:

- **Autenticación obligatoria** para todas las operaciones
- **Acceso solo a datos propios** del usuario
- **Validación de datos** en el servidor
- **Protección contra accesos no autorizados**

### Buenas Prácticas Implementadas

- ✅ Validación de formularios en cliente
- ✅ Sanitización de datos de entrada
- ✅ Manejo seguro de tokens de autenticación
- ✅ Almacenamiento seguro de credenciales
- ✅ HTTPS para todas las comunicaciones

## 🧪 Testing

```bash
# Ejecutar tests de Firebase Rules
node test-firebase-rules.js
```

## 📄 Estructura de Datos

### Modelo de Mascota (Pet)
```javascript
{
  id: string,
  userId: string,
  nombre: string,
  especie: 'Perro' | 'Gato',
  raza: string,
  fechaNacimiento: Timestamp,
  genero: 'Macho' | 'Hembra',
  peso: number,
  color: string,
  imageUrl: string,
  archived: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Modelo de Vacunación
```javascript
{
  id: string,
  petId: string,
  vaccineName: string,
  applicationDate: Timestamp,
  description: string,
  createdAt: Timestamp
}
```


### Convención de Commits

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato/estilo
- `refactor:` Refactorización de código
- `test:` Añadir o modificar tests



## 👥 Autores

- **Estefany Montiel** - [@EstefanyMontiel](https://github.com/EstefanyMontiel)
- **Axel Estrada** 


## 📜 Licencia

Este proyecto es privado y está protegido por derechos de autor. 

---

<div align="center">

**Hecho con ❤️ para el cuidado de nuestras mascotas**

⭐ Si te gusta este proyecto, considera darle una estrella en GitHub ⭐

</div>

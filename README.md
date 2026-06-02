# Todoit — Frontend Móvil

Aplicación móvil de gestión de tareas construida con **React Native + Expo**. Permite crear listas, agregar tareas con prioridades y fechas límite, buscar contenido y gestionar el perfil de usuario.

## Descripción

Todoit es una app de to-do list con autenticación Firebase. Los usuarios pueden registrarse, iniciar sesión y gestionar sus listas y tareas de forma privada. Consume la API REST del backend en Render.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | React Native + Expo SDK 56 |
| Lenguaje | TypeScript |
| Autenticación | Firebase Authentication |
| HTTP Client | Axios |
| Navegación | React Navigation (Stack + Bottom Tabs) |
| Deploy web | Vercel |

## Pantallas

- **Login / Registro** — autenticación con email y contraseña
- **Home** — listado de listas con progreso y estadísticas
- **Detalle de lista** — tareas con toggle, prioridad (alta/media/baja) y fecha límite
- **Búsqueda** — búsqueda en tiempo real de listas y tareas
- **Perfil** — información del usuario y cierre de sesión

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

# URL del backend
EXPO_PUBLIC_API_URL=https://todo-list-backend-tvzg.onrender.com/api
```

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/aislinng/todo-list-frontend.git
cd todo-list-frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npx expo start
```

## Cómo ejecutar

```bash
# Expo Go (iOS / Android físico o simulador)
npx expo start

# Expo Web (navegador)
npx expo start --web
```

Para dispositivo físico, cambia `EXPO_PUBLIC_API_URL` por la IP local de tu máquina:
```
http://192.168.x.x:8080/api
```

## Deploy

La versión web está desplegada en **Vercel**:

🔗 **[https://todo-web-orcin.vercel.app](https://todo-web-orcin.vercel.app)**

## Usuario de prueba

| Campo | Valor |
|---|---|
| Email | `test@gmail.com` |
| Contraseña | `Test1234` |

## Backend

🔗 **[https://github.com/aislinng/todo-list-backend](https://github.com/aislinng/todo-list-backend)** — API REST con Quarkus + Firebase + MySQL

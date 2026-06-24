# Assessment Autotraffic - Hyrule Board

Evaluación técnica Full Stack desarrollada para Autotraffic.

## Tecnologías utilizadas

### Frontend
- React
- TypeScript
- Vite
- Axios
- CSS

### Backend
- Node.js
- Express
- TypeScript
- SQLite
- bcryptjs

## Funcionalidades

- Registro de usuarios
- Inicio de sesión
- Crear tareas
- Consultar tareas
- Editar tareas
- Eliminar tareas
- Marcar tareas como completadas o pendientes
- Buscar tareas
- Filtrar tareas por estado
- Tareas asociadas por usuario

## Formato de una tarea

```json
{
  "id": 1,
  "title": "Título de la tarea",
  "description": "Descripción opcional",
  "completed": false,
  "created_at": "2026-06-24",
  "updated_at": "2026-06-24"
}
Instrucciones para ejecutar el proyecto
Backend
cd backend
npm install
npm run dev

El backend se ejecuta en:

http://localhost:3000
Frontend
cd frontend
npm install
npm run dev

El frontend se ejecuta en:

http://localhost:5173
Endpoints principales
POST /auth/register
POST /auth/login

GET /tasks?userId=1
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id?userId=1
Credenciales de prueba

Usuario: graciela
Contraseña: admin123

Usuario: demo
Contraseña: demo123

Enlaces

Repositorio público:

https://github.com/zapotitlagraciela872-cell/Assessment-Autotraffic-Hyrule-Board

Backend configurado en Render:

https://assessment-autotraffic-hyrule-board.onrender.com
Nota sobre despliegue

El proyecto funciona correctamente en entorno local. El backend fue configurado en Render; durante el despliegue se presentó un conflicto con dependencias nativas de SQLite/better-sqlite3 en ambiente Linux.

Explicación breve del sistema

El sistema permite que un usuario se registre e inicie sesión. Después de autenticarse, puede administrar sus tareas personales: crear, consultar, editar, eliminar y marcar tareas como completadas o pendientes.

El frontend fue desarrollado con React, TypeScript y Vite. La comunicación con el backend se realiza mediante Axios.

El backend fue desarrollado con Node.js, Express y TypeScript. La información se almacena en SQLite. Las contraseñas se protegen utilizando bcryptjs y cada tarea se relaciona con un usuario mediante user_id.

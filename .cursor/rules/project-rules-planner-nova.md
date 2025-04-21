
# 🚀 Reglas de Desarrollo para Proyecto Planner Nova (Stack Gratuito y Escalable)

Este documento define las reglas fundamentales que guían el desarrollo de este proyecto de gestión de tareas y proyectos. El objetivo es asegurar una arquitectura sólida, moderna, gratuita y escalable.

---

## 🎯 Objetivo del Proyecto

Crear una aplicación fullstack profesional, completamente gratuita para desarrollo y MVP, que combine:

- UI moderna en **Next.js + Tailwind CSS**
- Autenticación robusta con **Supabase Auth**
- Backend con soporte SSR/API Routes (App Router)
- Base de datos relacional PostgreSQL vía **Supabase**
- Hosting en **Vercel** (Frontend + API)

---

## 🧱 Estructura de Stack

| Capa            | Tecnología                  | Gratis | Descripción                                     |
|-----------------|-----------------------------|--------|-------------------------------------------------|
| Frontend        | Next.js + Tailwind CSS      | ✅     | SPA + SSR con UI responsiva y moderna          |
| Auth            | Supabase Auth               | ✅     | Login, registro, JWT, OAuth                    |
| Backend         | API Routes (Next.js)        | ✅     | Serverless Functions + Middleware              |
| Database        | Supabase PostgreSQL         | ✅     | SQL, relaciones, RLS, funciones RPC            |
| Hosting         | Vercel                      | ✅     | Build, deploy y preview automático             |

---

## 📜 Reglas de Desarrollo

### 1. 📦 Estructura de carpetas

```txt
/app
  ├── layout.tsx
  ├── page.tsx
  ├── dashboard/
  ├── login/
  └── api/
      └── auth/
      └── tasks/
      └── projects/
```

### 2. 🧠 Lógica y reglas clave

- Toda la lógica del usuario debe estar protegida por **middleware SSR**.
- El **estado del usuario** debe mantenerse sincronizado vía `supabase.auth.getUser()` + React Context.
- La app **NO** debe usar cookies `.get()` `.set()` `.remove()` manuales → usar **`getAll()` y `setAll()`** como indica Supabase SSR.

---

## 🔐 Seguridad

- Hash de contraseñas = lo maneja Supabase (✅ seguro).
- Rutas privadas (dashboard, tareas, etc.) deben ser verificadas en SSR/middleware.
- Autorización avanzada debe usar RLS en Supabase si aplica.
- Tokens JWT deben tener expiración razonable (~1h).
- Logout debe limpiar estado cliente y cookies correctamente.

---

## 🧰 Buenas prácticas técnicas

- Toda entrada de usuario debe ser validada con Zod/Yup.
- Preferir `async/await` y funciones puras.
- Tipado estricto (`any` prohibido).
- Code linting con ESLint + Prettier.
- Usar `.env.local` y nunca subir claves privadas.

---

## 🧪 Testing mínimo esperado

- Comprobación de login/logout correcto.
- Middleware que redirige si el usuario no está autenticado.
- Prueba de CRUD para tareas y proyectos.
- Refrescos de sesión funcionales.

---

## 📦 Despliegue

- **Vercel** como único destino de producción.
- Las PR deben pasar el build y no romper la API ni auth.
- Las páginas `/login` y `/dashboard` deben funcionar como SSR.

---

## 🧠 Filosofía de desarrollo

- Código limpio > Código rápido.
- Seguridad primero.
- Escalabilidad: construir como si el proyecto fuese crecer.
- Mantenibilidad: todo lo que hagas debe entenderlo otro desarrollador.

---

## 🧾 Créditos / Stack usado

- Supabase (https://supabase.com)
- Next.js App Router (https://nextjs.org)
- TailwindCSS (https://tailwindcss.com)
- Vercel (https://vercel.com)

---


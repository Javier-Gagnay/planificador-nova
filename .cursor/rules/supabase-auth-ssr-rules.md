
# 🛡️ Supabase Auth SSR Rules — Next.js Fullstack Apps

Guía completa de implementación, seguridad y mantenimiento de Supabase Auth con soporte para Server-Side Rendering en apps Next.js modernas.

> ⚠️ Esta guía contiene reglas estrictas para evitar errores en producción, pérdida de sesiones y vulnerabilidades.

---

## 📦 Instalación de dependencias

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

## 🔐 Variables de entorno

Define estas variables en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-key  # Solo usar del lado servidor
```

---

## ✅ Implementación correcta de cliente Supabase

### 📱 Browser Client

```ts
// lib/supabase/browser.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 🧠 Server Client (SSR)

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar si estamos en un Server Component sin acceso a `set`
          }
        },
      },
    }
  )
}
```

---

## 🧱 Middleware SSR con protección de rutas

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## 🚨 Patrones PROHIBIDOS (NO USAR)

❌ **NO uses estos métodos de cookies**:

```ts
cookies: {
  get()      // ❌ NO
  set()      // ❌ NO
  remove()   // ❌ NO
}
```

❌ **NO uses `@supabase/auth-helpers-nextjs`**:

```ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs' // ❌
```

---

## 📐 Reglas adicionales recomendadas (by Cody 🧠)

### 1. Tipado estricto
```ts
// ✅ Define interfaces para user, session, task, etc.
interface SupabaseUser {
  id: string
  email: string
}
```

### 2. Validación y control de errores
- Siempre atrapa errores de Supabase.
- Usa Zod, Yup o Valibot para validar inputs del usuario.

### 3. Control de roles y claims
- Si tienes usuarios con roles distintos (admin, viewer, etc.), guárdalos en la metadata del token y actúa en el middleware.

### 4. Seguridad en logout
- Asegura que `signOut` limpie sesiones del navegador + cookies + estado local.

### 5. Acceso condicional
- Toda ruta privada debe validarse con SSR/middleware.
- Usa context o Zustand para mantener estado auth en cliente.

---

## 🧪 Testeo

- Usa Cypress o Playwright para asegurar que las sesiones se mantengan al navegar entre páginas.
- Verifica expiración de tokens.
- Haz pruebas con múltiples navegadores o usuarios logueados.

---

## 🧾 Logs sugeridos

En modo desarrollo:
```ts
console.log('User:', user)
console.log('Cookies:', request.cookies.getAll())
```

---

## ❓¿Por qué todo esto?

> Supabase maneja sesiones vía cookies. SSR en Next.js puede romper sesiones si no manejas las cookies exactamente igual entre servidor y cliente.

Estas reglas garantizan una sesión consistente, segura y compatible con middleware, RSC, y edge rendering.

---

